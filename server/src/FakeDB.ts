import fs from 'fs'
import csv from 'csv-parser'
import { format } from 'date-fns'

export interface Weather {
  date: string;
  avgHum: number;
  avgTemp: number;
}

export interface EnergyData {
  ts: string;
  consumption: number;
}

interface IReadCSVOptions {
  path: string;
  headerMapping?: Record<string, string>
  valueMapping?: Record<string, (value: string) => string | number>
}

const fakeLatency = (ms: number = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true)
  }, ms)
})

const NEW_WEATHER_KEYS = {
  AVG_TEMP: 'avgTemp',
  AVG_HUMIDITY: 'avgHum',
  DATE: 'date'
}

const NEW_ENERGY_KEYS = {
  TIMESTAMP: 'ts',
  CONSUMPTION: 'consumption',
}


class FakeDB {
  readCSV = async <T>({ path, headerMapping, valueMapping }: IReadCSVOptions): Promise<T> => {
    return new Promise((resolve, reject) => {
      const results = []
      fs.createReadStream(path).on('error', (error) => reject(error))
        .pipe(csv({
          mapHeaders: ({ header }) => {
            const trimmedHeader = header.trim();
            return headerMapping[trimmedHeader] ?? trimmedHeader
          },
          mapValues: ({ header, value }) => {
            const trimmedHeader = header.trim();
            return valueMapping[trimmedHeader] ? valueMapping[trimmedHeader](value) : value
          }
        })
          .on('error', (error) => reject(error))
          .on('data', (data) => results.push(data))
          .on('end', () => {
            resolve(results as T)
          }))
    })
  }

  getWeather = async () => {
    await fakeLatency();

    try {
      const csvReadOptions: IReadCSVOptions = {
        path: __dirname + '/Weather.csv',
        headerMapping: {
          'Date': NEW_WEATHER_KEYS.DATE,
          'AverageTemperature': NEW_WEATHER_KEYS.AVG_TEMP,
          'AverageHumidity': NEW_WEATHER_KEYS.AVG_HUMIDITY
        },
        valueMapping: {
          [NEW_WEATHER_KEYS.DATE]: (value) => {
            const convertedDate = new Date(value).toLocaleString('en-GB')
            return format(new Date(convertedDate), 'yyyy/MM/dd-HH:mm')
          },
          [NEW_WEATHER_KEYS.AVG_TEMP]: (value) => Number(value),
          [NEW_WEATHER_KEYS.AVG_HUMIDITY]: (value) => Number(value)
        }
      }

      const weatherData = await this.readCSV<Weather[]>(csvReadOptions)
      return weatherData
    } catch (e) {
      console.error('getWeather ERROR', e)
      return []
    }
  }

  getHalfHourlyEnergyData = async (getAnomalies: boolean = false) => {
    await fakeLatency();

    const path = getAnomalies ? __dirname + '/HalfHourlyEnergyDataAnomalies.csv' : __dirname + '/HalfHourlyEnergyData.csv'

    try {
      const csvReadOptions: IReadCSVOptions = {
        path,
        headerMapping: {
          'Timestamp': NEW_ENERGY_KEYS.TIMESTAMP,
          'Consumption': NEW_ENERGY_KEYS.CONSUMPTION,
        },
        valueMapping: {
          [NEW_ENERGY_KEYS.TIMESTAMP]: (value) => format(new Date(value), 'yyyy/MM/dd-HH:mm'),
          [NEW_ENERGY_KEYS.CONSUMPTION]: (value) => Number(value)
        }
      }

      const halfHourlyEnergyData = await this.readCSV<EnergyData[]>(csvReadOptions)
      return halfHourlyEnergyData
    } catch (e) {
      console.error('getHalfHourlyEnergyData ERROR', e)
      return []
    }
  }

}

export default new FakeDB();
