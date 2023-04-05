const schema = `#graphql


  type Weather {
    # date of record
    date: String 
    # average temperature at time
    avgTemp: Float
    # average humidity at time 
    avgHum: Float 
  }

  type Energy {
    # Timestamp of energy record
    ts: String
    # Consumption amount
    consumption: Float
    # Is this an anomaly
    anomaly: Boolean
    # Weather record at time of record
    weather: Weather
  }

  type Query {
    weather: [Weather]
    energy: [Energy]
  }
`;

export default schema
