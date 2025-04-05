import geopandas as gpd
import tqdm
from shapely.geometry import Point
import matplotlib.pyplot as plt


def is_station_near_coastline(station, coastlines, buffer_km):
    """
    Check if a station is near the coastline within a specified buffer distance.

    Parameters:
        station (dict): Station information containing 'lon' and 'lat'.
        coastlines (GeoDataFrame): GeoDataFrame of coastlines.
        buffer_km (int): Buffer distance in kilometers.

    Returns:
        bool: True if the station is near the coastline, False otherwise.
    """
    point = Point(station["lon"], station["lat"])
    point_gdf = gpd.GeoSeries([point], crs="EPSG:4326").to_crs(epsg=2154)  # Lambert 93
    littoral_proj = coastlines.to_crs(epsg=2154)

    # Create a buffer around the station (in meters)
    buffer = point_gdf.buffer(buffer_km * 1000)

    # Check for intersection with the coastline
    intersection = littoral_proj.intersects(buffer.iloc[0])
    return intersection.any()


def get_france_coastline(coastline_path, france_path):
    coastline_world = gpd.read_file(coastline_path)
    france = gpd.read_file(france_path)

    coastline_france = coastline_world[coastline_world.intersects(france.union_all())]
    return coastline_france


def filter_stations_coastline(stations,
                              buffer_km=10,
                              coastline_path="../../data/ne_10m_coastline/ne_10m_coastline.shp",
                              france_path="../../data/geojson/france.geojson"):
    coastline_france = get_france_coastline(coastline_path, france_path)
    filtered_stations = []
    for station in tqdm.tqdm(stations, desc="Filtering stations near coastline"):
        if is_station_near_coastline(station, coastline_france, buffer_km):
            filtered_stations.append(station)
    return filtered_stations
