const https = require('https');
const fs = require('fs');

const url = 'https://www.wienenergie.at/privat/produkte/e-mobilitaet/unterwegs-laden/e-ladestation-finder/';

// HTTP request
https.get(url, (response) => {
  let data = '';
  console.log(data);

  // Save chunks into data variable
  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    // Transform into CSV
    const chargingStations = [];

    // Exemple de code pour extraire les données (à adapter à la structure du site Web)
    data.replace(/<div class="charging-station">([\s\S]*?)<\/div>/g, (_, stationHtml) => {
      const station = {
        //wrong class names
        'Name': stationHtml.match(/<div class="name">(.*?)<\/div>/)[1],
        'Address': stationHtml.match(/<div class="address">(.*?)<\/div>/)[1],
        'Longitude': parseFloat(stationHtml.match(/<div class="longitude">(.*?)<\/div>/)[1]),
        'Latitude': parseFloat(stationHtml.match(/<div class="latitude">(.*?)<\/div>/)[1]),
        'OperatorID': 'VIE',  // À déterminer à partir des données
        'Connector': 'type2',  // À déterminer à partir des données
        'Power': 11  // À déterminer à partir des données
      };

      chargingStations.push(station);
    });

    // Save data in CSV file
    const csv = 'Name,Address,Longitude,Latitude,OperatorID,Connector,Power\n' +
      chargingStations.map(station =>
        `${station.Name},"${station.Address}",${station.Longitude},${station.Latitude},${station.OperatorID},${station.Connector},${station.Power}`
      ).join('\n');

    fs.writeFileSync('charging_stations.csv', csv);

    console.log('Données enregistrées dans charging_stations.csv');
  });
}).on('error', (error) => {
  console.error('Erreur lors de la récupération des données :', error);
});
co