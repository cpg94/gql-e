import { gql } from "@apollo/client";

export interface IEnergy {
  ts: string
  anomaly: boolean;
  consumption: number;
  weather?: IWeather
}

export interface IWeather {
  avgTemp: number;
  avgHum: number;
}

export interface IEnergyQuery {
  energy: IEnergy[]
}

export const ENERGY_QUERY = gql`
  query {
    energy {
      ts
      anomaly
      consumption
      weather {
        avgTemp
        avgHum
      }
    }
  }
`
