
function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/main/E2/chile_earthquakes.csv?token=GHSAT0AAAAAACTS6A5PE7FMUHXC7AEDBKEUZTR5LAQ";
    return d3.dsv(';', TERREMOTOS_URL);
}

fetchEarthquakeData().then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});
