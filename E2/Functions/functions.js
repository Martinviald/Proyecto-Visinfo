function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/main/E2/chile_earthquakes.csv?token=GHSAT0AAAAAACTS6A5OQ2VXF62ROHZI3JUEZTR6NNQ";
    return d3.dsv(';', TERREMOTOS_URL).then(data => {
        return data.map(d => {
            delete d['Search Parameters']; // Elimina la columna 'search parameters'
            for (let prop in d) {
                if (d[prop] === null || d[prop] === '') { // Si el dato es nulo o una cadena vacía
                    d[prop] = 0; // Reemplaza por 0
                }
            }
            return d;
        });
    });
}

fetchEarthquakeData().then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});