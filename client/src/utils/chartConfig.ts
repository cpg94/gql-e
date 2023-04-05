import Highcharts from "highcharts"
import { IEnergyQuery } from "./energyQuery"

const ENERGY_CONSUMPTION = 'Energy Consumption'
const AVERAGE_TEMPERATURE = 'Average Temperature'

interface IConsumptionPoint {
  x: number;
  y: number;
  custom: {
    avgTemp?: number | string;
    avgHum?: number | string;
    anomaly: boolean;
  }
}

interface ITemperaturePoint {
  x: number;
  y: number;
  custom: {
    avgHum?: number;
    anomaly: boolean;
  }
}

const buildEnergyConsumptionTooltip = (point: Highcharts.Point) => {
  return `Time:<b> ${Highcharts.dateFormat('%d/%m/%Y %H:%M', point.x)}</b></br>
  Energy Consumption:<b> ${point.y}</b></br>
  Anomaly:<b> ${point.custom.anomaly}</b></br>
  Average Temp:<b> ${point.custom.avgTemp}</b></br>
  Average Humidity:<b> ${point.custom.avgHum}</b>
  `
}
const buildAverageTemperatureTooltip = (point: Highcharts.Point) => {
  return `Time:<b> ${Highcharts.dateFormat('%d/%m/%Y %H:%M', point.x)}</b></br>
  Average Temp:<b> ${point.y}</b></br>
  Average Humidity:<b> ${point.custom.avgHum}</b>
  `
}

const chartConfig = (data?: IEnergyQuery): Highcharts.Options => ({
  title: {
    text: 'Energy Chart'
  },
  chart: {
      type: 'spline',
  },
  yAxis: {
      title: {
        text: ENERGY_CONSUMPTION,
      }
  },
  xAxis: {
      type: 'datetime',
      labels: {
          formatter() {
            const timeValue = this.value as number
              return Highcharts.dateFormat('%e - %b - %y', timeValue)
          },
      }
  },
  tooltip: {
    formatter() {
          return ({
            [AVERAGE_TEMPERATURE]: buildAverageTemperatureTooltip(this.point),
            [ENERGY_CONSUMPTION]: buildEnergyConsumptionTooltip(this.point)
          })[this.series.name]
    }
  },
  series: [
      {
          data: data?.energy?.reduce((consumption: IConsumptionPoint[], record) => {
              return [
                ...consumption,
                {
                  y: record.consumption,
                  x: new Date(record.ts).getTime(),
                  custom: {
                    avgTemp: record?.weather?.avgTemp ?? 'N/A',
                    avgHum: record?.weather?.avgHum ?? 'N/A',
                    anomaly: record.anomaly
                  }
                }
              ]
          }, []) ?? [],
          name: ENERGY_CONSUMPTION,
          type: 'line'
      },
      {
        data: data?.energy?.reduce((temperatures: ITemperaturePoint[], record) => {
            if(!record?.weather?.avgTemp) return temperatures

            return [
              ...temperatures,
              {
                y: record?.weather?.avgTemp,
                x: new Date(record.ts).getTime(),
                custom: {
                  avgHum: record?.weather?.avgHum,
                  anomaly: record.anomaly
                }
              }
            ]
        }, []) ?? [],
          name: AVERAGE_TEMPERATURE,
          type: 'line'
      },
  ]
})

export default chartConfig
