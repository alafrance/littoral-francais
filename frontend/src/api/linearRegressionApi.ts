import api from "./axios.ts";
import {FilterStationDataValue} from "../components/map/station/CardStation.tsx";

export interface ResLinearRegression {
  a: number,
  b: number,
  r_squared: number
}

export const getLinearRegression = async (data: FilterStationDataValue[]) => {
  const refactorData = data.map(d => ({
    x: d.date.getTime(),
    y: d.value,
  }));
  const response = await api.post(`/linear-regression`, {
    data: refactorData,
  });
  return response.data as ResLinearRegression
}