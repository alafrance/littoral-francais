import api from "./axios";

export const getStations = async () => {
  const response = await api.get("/stations");
  return response.data;
};

export const getStation = async (id: string) => {
  const response = await api.get(`/stations/${id}`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return response.data
}