import random
import time
from io import StringIO
from time import sleep

import pandas as pd
from littoral_api_meteo_france import Client
from datetime import datetime
from littoral_const import MENSUEL_URL, COMMAND_URL


def get_stations_infos(client: Client, stations, start_date_str="1950-01-01T00:00:00Z") -> pd.DataFrame:
    stations_infos = pd.DataFrame()
    format_strftime = "%Y-%m-%dT%H:%M:%SZ"
    start_date = datetime.strptime(start_date_str, format_strftime)
    end_date = datetime.now()
    random.shuffle(stations)
    for index, station in enumerate(stations):
        current = start_date
        print(f"Station {index + 1}/{len(stations)}: {station['nom']}")
        while current <= end_date.replace(month=end_date.month - 1):
            current_next_year = current.replace(year=current.year + 1)
            print(f"Current date: {current.strftime(format_strftime)}")
            if current_next_year > end_date:
                break
            csv_info = get_csv_info_station(station["id"], client, current, current_next_year, format_strftime)
            current = current_next_year
            if csv_info is not None:
                for key in station:
                    if key not in csv_info.columns:
                        csv_info[key] = station[key]
                stations_infos = pd.concat([stations_infos, csv_info], ignore_index=True)
                stations_infos.to_csv("stations_infos.csv", index=False)
    return stations_infos


def get_csv_info_station(station_id, client, current, current_next_year, format_strftime):
    response = get_command_for_mensuel_info(client, station_id, current, current_next_year, format_strftime)

    if response.status_code != 202:
        print("Error: ", response.status_code)
        return None
    code = response.json()["elaboreProduitAvecDemandeResponse"]["return"]
    if int(code) <= 0:
        raise Exception(f"Error: {response.status_code} - {response.text}")
    sleep(0.1)
    commande = get_commande(client, code)

    # if commande.status_code == 500:
        # print("Data not available")

    # 204 : production encore en attente ou en cours
    if commande.status_code == 204:
        while commande.status_code == 204:
            commande = get_commande(client, code)

    # Error 500 : data not available
    if commande.status_code == 500:
        return None
    csv_return = commande.text
    csv_io = StringIO(csv_return)
    df = pd.read_csv(csv_io, sep=";")
    return df


def get_commande(client, code):
    response_commande = client.request("GET",
                                       COMMAND_URL(code))
    return response_commande


def get_command_for_mensuel_info(client, station_id, current, current_next_year, format_strftime):
    return client.request("GET",
                          MENSUEL_URL(station_id,
                                      current.strftime(format_strftime),
                                      current_next_year.strftime(format_strftime)))


