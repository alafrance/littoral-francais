from littoral_api_meteo_france import Client
from dotenv import load_dotenv
from get_station import get_stations_from_littoral_department
from filter_station import filter_stations_coastline
from plot_stations import plot_stations
from get_stations_info import get_stations_infos
import os


def main():
    if not os.path.exists("../../../.env"):
        raise Exception("Please create a .env file with your credentials.")
    load_dotenv("../../../.env")
    client = Client()
    client.session.headers.update({'Accept': 'application/json'})

    stations = get_stations_from_littoral_department(client)
    print(f"Number of stations: {len(stations)}")
    plot_stations(stations, "All stations")

    stations = filter_stations_coastline(stations)
    print(f"Number of stations filtered: {len(stations)}")
    plot_stations(stations, "Stations filtered")

    stations_infos = get_stations_infos(client, stations)
    stations_infos.to_csv("stations_infos.csv", index=False)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"An error occurred: {e}")
        raise
