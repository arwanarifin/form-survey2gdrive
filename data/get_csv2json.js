async function fetchAndConvertCsvToJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const csvText = await response.text();
        const rows = csvText.trim().split('\n');
        const features = [];

        for (let i = 1; i < rows.length; i++) {
            const csvRow = rows[i].split(',');

            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(csvRow[3]), // longitude
                        parseFloat(csvRow[2])  // latitude
                    ]
                },
                properties: {
                    nama: csvRow[0],
                    tanggal: csvRow[1],
                    link: csvRow[4]
                }
            };

            features.push(feature);
        }

        const geoJson = {
            type: 'FeatureCollection',
            features: features
        };

        return geoJson;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return { error: 'Problem Reading Google CSV' };
    }
}



