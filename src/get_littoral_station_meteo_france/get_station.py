import tqdm
from api_meteo_france import Client
from const import STATION_URL, LIST_SETTINGS_URL_STATIONS

LIST_DEPARTMENT_COASTLINE = {
    "atlantic_ocean": [
        64,
        40,
        33,
        17,
        85,
        44,
        56,
        29,
    ],
    "english_channel": [
        22,
        35,
        50,
        14,
        76,
        80,
        62
    ],
    "mediterranean": [
        66,
        11,
        34,
        30,
        13,
        83,
        6
    ]
}


def get_stations_from_littoral_department(client: Client) -> list:
    """
    Get the stations from the littoral department
    :return: list of stations
    """
    stations_littoral = []
    all_departments = []
    for ocean in LIST_DEPARTMENT_COASTLINE:
        all_departments.extend(LIST_DEPARTMENT_COASTLINE[ocean])

    for department in tqdm.tqdm(all_departments, desc="Getting stations from littoral department"):
            response = client.request("GET", STATION_URL(department, LIST_SETTINGS_URL_STATIONS[0]))
            if response.status_code != 200:
                raise Exception(f"Error: {response.status_code} - {response.text}")
            stations = response.json()
            if len(stations) < 0:
                raise Exception(f"Error: {response.status_code} - {response.text}")
            stations_littoral.extend(stations)

    return stations_littoral
