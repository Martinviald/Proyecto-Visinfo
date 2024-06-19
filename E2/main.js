function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/main/E2/chile_earthquakes.csv?token=GHSAT0AAAAAACTS6A5PWC6NWD5UFBMETS5OZTTCZRA";
    return d3.csv("chile_earthquakes.csv", d3.autoType);
}

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

// Editar tamaños como estime conveniente
const WIDTH_VIS_1 = 858;
const HEIGHT_VIS_1 = 400;

const WIDTH_VIS_2 = 770;
const HEIGHT_VIS_2 = 1600;

const MARGIN = {
    top: 20,
    bottom: 20,
    right: 15,
    left: 15,
  };

const PADDING = 10;

const HEIGHTVIS_VIS_1 = HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS_VIS_1 = WIDTH_VIS_1 - MARGIN.right - MARGIN.left;


SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

        
const escalaColorCategorica2 = d3
    .scaleOrdinal(["brown", "magenta", "gray"]);

generateEarthquakeImpactGraphs();

function generateEarthquakeImpactGraphs() {

    // Creamos un contenedor específico para agregar la visualización.
    const contenedor1 = SVG1
        .append("g")
        .attr("class", "graphHumanDamage")
        .attr("transform", `translate(${MARGIN.left} ${MARGIN.top-5})`); 
    
    const contenedor2 = SVG1
        .append("g")
        .attr("class", "graphEconomicDamage")
        .attr("transform", `translate(${MARGIN.left + WIDTHVIS_VIS_1/3} ${MARGIN.top-5})`); 
    
    const contenedor3 = SVG1
        .append("g")
        .attr("class", "graphEstructuralDamage")
        .attr("transform", `translate(${MARGIN.left + WIDTHVIS_VIS_1*2/3} ${MARGIN.top-5})`); 

    fetchEarthquakeData().then(data => {

        const magnitudeFilterButton = document.querySelectorAll(".magnitudeFilterButton");

        magnitudeFilterButton.forEach(button => {
            button.addEventListener("click", function() {
                console.log(button.getAttribute("data-range"))
                const range = button.getAttribute("data-range");

                if (range === "4.0-4.9") {
                    console.log(data);
                    data = data.filter(d => d.Magnitude >= 4.0 && d.Magnitude <= 4.9);
                    console.log(data);
                } else if (range === "5.0-5.9") {
                    data = data.filter(d => d.Magnitude >= 5.0 && d.Magnitude <= 5.9);
                } else if (range === "6.0+") {
                    data = data.filter(d => d.Magnitude >= 6.0);
                }
            });
        })

        const escalaColorCategorica1 = d3.scaleOrdinal(["red", "yellow", "orange"]);
        const escalaColorCategorica2 = d3.scaleOrdinal(["gray"]);
        const escalaColorCategorica3 = d3.scaleOrdinal(["blue", "green"]);


        // console.log(data);
        const maxDeaths = d3.max(data, (d) => d.Deaths);
        const minDeaths = d3.min(data, (d) => d.Deaths);
        const escalaDeaths = d3
        .scaleLinear()
        .domain([minDeaths, maxDeaths])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxMissing = d3.max(data, (d) => d.Missing);
        const minMissing = d3.min(data, (d) => d.Missing);
        const escalaMissing = d3
        .scaleLinear()
        .domain([minMissing, maxMissing])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxInjuries = d3.max(data, (d) => d.Injuries);
        const minInjuries = d3.min(data, (d) => d.Injuries);
        const escalaInjuries = d3
        .scaleLinear()
        .domain([minInjuries, maxInjuries])
        .range([HEIGHTVIS_VIS_1, 0]);


        const maxDamage = d3.max(data, (d) => d.Damage);
        const minDamage = d3.min(data, (d) => d.Damage);

        // console.log(maxDamage);
        // console.log(minDamage);

        const escalaDamage = d3
        .scaleLinear()
        .domain([minDamage, maxDamage])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxHousesDestroyed = d3.max(data, (d) => d.HousesDestroyed);
        const minHousesDestroyed = d3.min(data, (d) => d.HousesDestroyed);
        const escalaHousesDestroyed = d3
        .scaleLinear()
        .domain([minHousesDestroyed, maxHousesDestroyed])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxHousesDamaged = d3.max(data, (d) => d.HousesDamaged);
        const minHousesDamaged = d3.min(data, (d) => d.HousesDamaged);
        const escalaHousesDamaged = d3
        .scaleLinear()
        .domain([minHousesDamaged, maxHousesDamaged])
        .range([HEIGHTVIS_VIS_1, 0]);

        const maxYear = d3.max(data, (d) => d.Year);
        const minYear = d3.min(data, (d) => d.Year);
        const escalaX = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([0, WIDTHVIS_VIS_1/3 -20]);

        const ejeX = d3.axisBottom(escalaX);

        contenedor1
        .append("g")
        .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
        .call(ejeX);
        contenedor2
        .append("g")
        .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
        .call(ejeX);
        contenedor3
        .append("g")
        .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
        .call(ejeX);

        contenedor1
        .selectAll(".casita")
        .data(data,  d => d.id)
        .join(
            enter => {
                const CASITA = enter.append("g").attr("class", "casita")

                CASITA.append("circle")
                    .attr("class", "Deaths")
                    .attr("fill", escalaColorCategorica1(0))
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaDeaths(d.Deaths));
                
                CASITA.append("circle")
                    .attr("class", "Missing")
                    .attr("fill", escalaColorCategorica1(1))
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaMissing(d.Missing));
                
                CASITA.append("circle")
                    .attr("class", "Injuried")
                    .attr("fill", escalaColorCategorica1(2))
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaInjuries(d.Injuries));

                return CASITA
            },
            update => {
                return update
            },
            exit => {
                // console.log("Holaaa");
                // exit.selectAll(".Deaths").remove()
                // exit.remove()
                return exit
            }
        )

        // Definir la función de línea
        const linea1 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaDeaths(d.Deaths));

        const linea2 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaMissing(d.Missing));

        const linea3 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaInjuries(d.Injuries));

        // Agregar la línea al contenedor
        contenedor1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica1(0))
        .attr("stroke-width", 0.75)
        .attr("d", linea1);

        contenedor1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica1(1))
        .attr("stroke-width", 0.75)
        .attr("d", linea2);

        contenedor1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica1(2))
        .attr("stroke-width", 0.75)
        .attr("d", linea3);


        contenedor2
        .selectAll(".casita")
        .data(data,  d => d.id)
        .join(
            enter => {
                const CASITA = enter.append("g").attr("class", "casita")

                CASITA.append("circle")
                    .attr("class", "EconomicDamage")
                    .attr("fill", escalaColorCategorica2())
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaDamage(d.Damage));

                return CASITA
            },
        )

        const linea4 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaDamage(d.Damage));

        contenedor2.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica2())
        .attr("stroke-width", 0.75)
        .attr("d", linea4);

        contenedor3
        .selectAll(".casita")
        .data(data,  d => d.id)
        .join(
            enter => {
                const CASITA = enter.append("g").attr("class", "casita")

                CASITA.append("circle")
                    .attr("class", "HousesDestroyed")
                    .attr("fill", escalaColorCategorica3(0))
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaHousesDestroyed(d.HousesDestroyed));
                
                CASITA.append("circle")
                    .attr("class", "HousesDamaged")
                    .attr("fill", escalaColorCategorica3(1))
                    .attr("r", 2)
                    .attr("cx", (d) => escalaX(d.Year))
                    .attr("cy", (d) => escalaHousesDamaged(d.HousesDamaged));

                return CASITA
            },
        )

        const linea5 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaHousesDestroyed(d.HousesDestroyed));

        const linea6 = d3.line()
        .x(d => escalaX(d.Year))
        .y(d => escalaHousesDamaged(d.HousesDamaged));

        contenedor3.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica3(0))
        .attr("stroke-width", 0.75)
        .attr("d", linea5);

        contenedor3.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", escalaColorCategorica3(1))
        .attr("stroke-width", 0.75)
        .attr("d", linea6);

    })
}

generateMapGraph();

function generateMapGraph() {

    const EarthquakeData = fetchEarthquakeData();

    EarthquakeData.then(data => {
        console.log("EarthquakeData:")
        console.log(data);

        d3.json("regiones_chile.json").then((MapData) => {
            console.log("MapData:")
            console.log(MapData);

            // Define la transformación
            const proyeccion = d3.geoMercator()
            .rotate([-25, 90]) // Rotamos el mapa 90 grados
            .fitSize([WIDTH_VIS_2, HEIGHT_VIS_2], MapData)
            .center([0, -19])
            // .translate([0, 0]);

            const caminosGeo = d3.geoPath().projection(proyeccion);

            SVG2
            .selectAll("path")
            .data(MapData.features)
            .join("path")
            .attr("d", caminosGeo)
            .attr("stroke", "#ccc");

            // Agrega los puntos para cada terremoto
            SVG2
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => proyeccion([d.Longitude, d.Latitude])[0])
            .attr("cy", d => proyeccion([d.Longitude, d.Latitude])[1])
            .attr("r", 1.5) // radio del círculo
            .attr("fill", "red"); // color del círculo

        });
    });
}