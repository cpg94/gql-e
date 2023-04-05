import { useQuery } from '@apollo/client'
import { useMemo } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { ENERGY_QUERY, IEnergyQuery } from '../../utils/energyQuery'
import chartConfig from '../../utils/chartConfig'

const EnergyChart = () => {
  const { data, loading, error } = useQuery<IEnergyQuery>(ENERGY_QUERY)

  const chartOptions = useMemo(() => chartConfig(data), [data, loading, error])

  if (loading) return <div>Loading...</div>

  if (!loading && error) return <div>Something went wrong!</div>

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default EnergyChart
