import keyBy from "../utils/keyBy";
import FakeDB, { EnergyData, Weather } from "../FakeDB";

interface EnergyWithWeather extends EnergyData {
  anomaly: boolean;
  weather: Weather | null
}

const parseEnergyData = (weatherData: Weather[], energyData: EnergyData[], anomalyEnergyData: EnergyData[]) => {
  const anomalyDataByTime = keyBy(anomalyEnergyData, (item) => item.ts);
  const weatherByTime = keyBy(weatherData, (item) => item.date);

  const sortedData = energyData.reduce((sorted: Record<string, EnergyWithWeather>, record) => {
    const date = record.ts

    const hasAnomaly = !!anomalyDataByTime[date]
    const weatherData = weatherByTime[date] ?? null

    return {
      ...sorted,
      [date]: {
        ...record,
        weather: weatherData,
        anomaly: hasAnomaly,
      }
    }
  }, {})

  return Object.values(sortedData)
}

const energy = async () => {
  try {
    const [
      weatherData,
      energyData,
      anomalyEnergyData
    ] = await Promise.all([
      FakeDB.getWeather(),
      FakeDB.getHalfHourlyEnergyData(),
      FakeDB.getHalfHourlyEnergyData(true)
    ])

    return parseEnergyData(weatherData, energyData, anomalyEnergyData)
  } catch (e) {
    console.error('energyWeatherAnomalyData ERROR', e)
    return []
  }
}

export default energy
