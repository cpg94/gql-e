var fs = require('fs')

const files = [
  "Weather.csv",
  "HalfHourlyEnergyData.csv",
  "HalfHourlyEnergyDataAnomalies.csv"
]

files.forEach((path) => {
  fs.copyFile(__dirname + "/src/" + path, __dirname + '/dist/' + path, function (err) {
    if (err) throw err
    console.log('Done ' + path)
  })
})
