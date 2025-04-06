TOKEN_URL = "https://portail-api.meteofrance.fr/token"

LIST_SETTINGS_URL_STATIONS = [
    "temperature",
    "etat_mer"
]


def STATION_URL(department, setting):
    return (f"https://public-api.meteofrance.fr/public/"
            f"DPClim/v1/liste-stations/"
            f"quotidienne?"
            f"id-departement={department}"
            f"&parametre={setting}")


def MENSUEL_URL(id_station, date_beginning, date_end):
    return (f"https://public-api.meteofrance.fr/public/"
            f"DPClim/v1/commande-station/"
            f"mensuelle?id-station={id_station}"
            f"&date-deb-periode={date_beginning}"
            f"&date-fin-periode={date_end}")


def COMMAND_URL(command_id):
    return (f"https://public-api.meteofrance.fr/public/DPClim/v1/"
            f"commande/fichier?id-cmde={command_id}")
