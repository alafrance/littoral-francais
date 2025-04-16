import api from "./axios";

export const getStations = async () => {
  const response = await api.get("/stations");
  return response.data;
};

export const getStation = async (id: string) => {
  const response = await api.get(`/stations/${id}`);
  return response.data.filter((data: StationData) => data.TN !== "None" && data.TX !== "None" && data.TM !== "None");
}