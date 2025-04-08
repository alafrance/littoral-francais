from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# Création de l'instance FastAPI
app = FastAPI()

# Exemple de données sur les "yellow-points"
yellow_points_data = [
    {"id": 1, "name": "Point A", "latitude": 48.8566, "longitude": 2.3522},
    {"id": 2, "name": "Point B", "latitude": 51.5074, "longitude": -0.1278},
    {"id": 3, "name": "Point C", "latitude": 40.7128, "longitude": -74.0060},
]

# Modèle de réponse pour un point jaune
class YellowPoint(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float

# Endpoint GET pour récupérer la liste des points jaunes
@app.get("/api/yellow-points", response_model=List[YellowPoint])
async def get_yellow_points():
    return yellow_points_data

# Endpoint GET pour récupérer un point jaune spécifique par son ID
@app.get("/api/yellow-points/{point_id}", response_model=YellowPoint)
async def get_yellow_point(point_id: int):
    for point in yellow_points_data:
        if point["id"] == point_id:
            return point
    return {"error": "Point not found"}

