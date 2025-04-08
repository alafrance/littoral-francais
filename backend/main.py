from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import geojson

app = FastAPI()

# Autoriser CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"] pour plus de sécurité
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello():
    return {"message": "Bienvenue sur l'API Gaia_42 🚀"}

@app.get("/points.geojson")
def get_points():
    features = [
        geojson.Feature(
            geometry=geojson.Point((2.3, 48.85)),
            properties={
                "id": "pointA",
                "taille": "small",
                "couleur": "rouge",
                "opacite": 0.4
            }
        ),
        geojson.Feature(
            geometry=geojson.Point((2.35, 46.86)),
            properties={
                "id": "pointB",
                "taille": "large",
                "couleur": "bleu",
                "opacite": 0.8
            }
        )
    ]
    return JSONResponse(content=geojson.FeatureCollection(features))
