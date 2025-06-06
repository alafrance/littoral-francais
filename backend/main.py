from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI()
df = pd.read_csv("csv/stations_infos.csv")

origins = [
    "http://localhost:5173",
    "https://alafrance.github.io",
    "http://alafrance.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/stations")
async def get_stations():
    return df.groupby("nom", as_index=False).agg({
        "lat": "first",
        "lon": "first",
        "nom": "first",
        "alt": "first",
        "id": "first"
    }).to_dict(orient="records")


@app.get("/stations/{station_id}")
async def get_station_info_by_id(station_id: int):
    """
    Récupère les données d'une station spécifiée par son station_id.

    - **station_id**: L'ID de la station à récupérer. Attention c'est un integer.

    Retourne un dictionnaire contenant les données de la station, avec les informations suivantes :
    - **lon**: Longitude
    - **lat** : Latitude
    - **TN**: Température minimale
    - **TX**: Température maximale
    - **TM**: Température moyenne
    - **RR**: Précipitations en mm
    """
    # stations_ids = df.groupby("id", as_index=False)
    station = df[df["id"] == station_id]

    if station.empty:
        return {"error": "Station non trouvée"}

    # Convert DATE to datetime
    station.loc[:, "date"] = pd.to_datetime(station["DATE"].astype(str), format="%Y%m")

    # Keep only relevant columns
    element_to_keep = ["nom", "lon", "lat", "alt", "id", "date", "TN", "TX", "TM", "RR"]
    station = station[element_to_keep]

    # Remove rows with all TN, TX, TM, RR values as NaN
    station = station.dropna(subset=["TN", "TX", "TM", "RR"], how="all")
    station = convert_to_float_and_replace(station, ["TN", "TX", "TM", "RR"])

    # Fill NaN values with "None" because fastapi doesn't like NaN
    station = station.fillna(value="None")

    # Sort by date and remove duplicates
    station = station.sort_values(by="date")
    station = station.drop_duplicates(subset=["date"], keep="first")

    return station.to_dict(orient="records")


@app.post('/linear-regression')
def create_linear_regression(data: dict):
    value = data.get("data")
    X = np.array([point["x"] for point in value]).reshape(-1, 1)
    y = np.array([point["y"] for point in value])
    reg = LinearRegression().fit(X, y)
    a = reg.coef_[0]
    b = reg.intercept_
    return {
        "a": a,
        "b": b,
        "r_squared": reg.score(X, y),
    }


def convert_to_float_and_replace(station, columns):
    for column in columns:
        station[column] = station[column].apply(lambda x: str(x).replace(",", ".") if pd.notna(x) else x)
        station[column] = station[column].apply(lambda x: float(x) if pd.notna(x) else x)
    return station
