function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/estructuraJS/E2/chile_earthquakes_clean.csv?token=GHSAT0AAAAAACTVPHYG7MUJSIEENCP3STRGZTSAWLQ";
    return d3.csv(TERREMOTOS_URL);
}

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

// Editar tamaños como estime conveniente
const WIDTH_VIS_1 = 800;
const HEIGHT_VIS_1 = 250;

// const WIDTH_VIS_2 = 800;
// const HEIGHT_VIS_2 = 1600;

const MARGIN = { // definimos cada margen
    top: 70,
    bottom: 30,
    right: 10,
    left: 50,
  };

const HEIGHTVIS_VIS_1 = HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS_VIS_1 = WIDTH_VIS_1 - MARGIN.right - MARGIN.left;


// SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
// SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

const escalaColorCategorica1 = d3
    .scaleOrdinal(["red", "blue"]);
        
const escalaColorCategorica2 = d3
    .scaleOrdinal(["brown", "magenta", "gray"]);

generateEarthquakeImpactGraphs();

function generateEarthquakeImpactGraphs() {

    // Creamos un contenedor específico para agregar la visualización.
    const contenedor = SVG1
        .append("g")
        .attr("transform", `translate(${MARGIN.left} ${MARGIN.top})`); 

    fetchEarthquakeData().then(data => {
        console.log(data);
        const maxDeaths = d3.max(data, (d) => d.Deaths);
        const minDeaths = d3.min(data, (d) => d.Deaths);
        const escalaDeaths = d3
        .scaleLinear()
        .domain([minDeaths, maxDeaths])
        .range([0, HEIGHTVIS_VIS_1]);

        const maxMissing = d3.max(data, (d) => d.Missing);
        const minMissing = d3.min(data, (d) => d.Missing);
        const escalaMissing = d3
        .scaleLinear()
        .domain([minMissing, maxMissing])
        .range([0, HEIGHTVIS_VIS_1]);

        const maxInjuries = d3.max(data, (d) => d.Injuries);
        const minInjuries = d3.min(data, (d) => d.Injuries);
        const escalaInjuries = d3
        .scaleLinear()
        .domain([minInjuries, maxInjuries])
        .range([0, HEIGHTVIS_VIS_1]);


        const maxDamage = d3.max(data, (d) => d.Damage);
        const minDamage = d3.min(data, (d) => d.Damage);

        const escalaDamage = d3
        .scaleLinear()
        .domain([minDamage, maxDamage])
        .range([0, HEIGHTVIS_VIS_1]);

        const escalaYDamage = d3
        .scaleLinear()
        .domain([minDamage, maxDamage])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxHousesDestroyed = d3.max(data, (d) => d.HousesDestroyed);
        const minHousesDestroyed = d3.min(data, (d) => d.HousesDestroyed);
        const escalaHousesDestroyed = d3
        .scaleLinear()
        .domain([minHousesDestroyed, maxHousesDestroyed])
        .range([0, HEIGHTVIS_VIS_1]);

        const maxHousesDamaged = d3.max(data, (d) => d.HousesDamaged);
        const minHousesDamaged = d3.min(data, (d) => d.HousesDamaged);
        const escalaHousesDamaged = d3
        .scaleLinear()
        .domain([minHousesDamaged, maxHousesDamaged])
        .range([0, HEIGHTVIS_VIS_1]);

        const escalaX = d3
        .scaleBand()
        .domain(data.map((d) => d.Year))
        .range([0, WIDTHVIS_VIS_1])
        .padding(0.1);

        const ejeX = d3.axisBottom(escalaX);

        // Agrega un título a la visualización
        SVG1
        .append("g")
        .append("text")
        .attr("x", WIDTH_VIS_1 / 2)
        .attr("y", MARGIN.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .text("Visualización 1");

        contenedor
        .selectAll(".casita")
        .data(data,  d => d.id)
        .join(
            enter => {
                const CASITA = enter.append("g").attr("class", "casita")

                CASITA.append("rect")
                    .attr("class", "Gráfico Personas")
                    .attr("width", 10)
                    .attr("height", (d) => escalaDamage(d.Damage))
                    .attr("x", (d) => escalaX(d.Year))
                    .attr("y", (d) => escalaYDamage(d.Damage));

            },
        )
    })
}
