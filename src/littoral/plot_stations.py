import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import matplotlib.pyplot as plt


def plot_stations(stations, title):
    stations_df = pd.DataFrame(stations)
    geometry = [Point(xy) for xy in zip(stations_df["lon"], stations_df["lat"])]
    stations_gdf = gpd.GeoDataFrame(stations_df, geometry=geometry, crs="EPSG:4326")

    stations_gdf.plot(marker='o', color='red', markersize=50)
    plt.title(title)
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    plt.grid(True)
    plt.show()

