
function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/main/E2/chile_earthquakes.csv?token=GHSAT0AAAAAACTVPHYGIDRFUFPMVM6WDJGCZTUO7IQ";
    return d3.csv("chile_earthquakes.csv", d3.autoType);
}

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

const WIDTH_VIS_1 = 1200;
const HEIGHT_VIS_1 = 400;

const container = d3.select("#vis-2");
const WIDTH_VIS_2 = +container.style("width").slice(0, -2);
const HEIGHT_VIS_2 = +container.style("height").slice(0, -2);

const MARGIN = {
    top: 20,
    bottom: 20,
    right: 15,
    left: 45,
  };

const HEIGHTVIS_VIS_1 = HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS_VIS_1 = WIDTH_VIS_1 - MARGIN.right - MARGIN.left;


SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

// Creamos un contenedor específico para agregar las visualizaciones.
const contenedor1 = SVG1
.append("g")
.attr("class", "graphHumanDamage")
.attr("transform", `translate(${MARGIN.left} ${MARGIN.top-5})`); 

const contenedor2 = SVG1
.append("g")
.attr("class", "graphEconomicDamage")
.attr("transform", `translate(${MARGIN.left + WIDTHVIS_VIS_1/3 + 20} ${MARGIN.top-5})`); 

const contenedor3 = SVG1
.append("g")
.attr("class", "graphEstructuralDamage")
.attr("transform", `translate(${MARGIN.left + WIDTHVIS_VIS_1*2/3 + 20} ${MARGIN.top-5})`); 

let DATA;
fetchEarthquakeData().then(data => {
    DATA = data;
});

d3.selectAll(".magnitudeFilterButton").on("click", function() {
    const range = d3.select(this).attr("data-range");
    let filteredData;

    if (range === "5.0 - 6.0") {
        filteredData = DATA.filter(d => d.Magnitude >= 5.0 && d.Magnitude <= 6.0);
    } else if (range === "6.1 - 7.0") {
        filteredData = DATA.filter(d => d.Magnitude >= 6.1 && d.Magnitude <= 7.0);
    } else if (range === "7.1 - 8.0") {
        filteredData = DATA.filter(d => d.Magnitude >= 7.1 && d.Magnitude <= 8.0);
    } else if (range === "8.1+") {
        filteredData = DATA.filter(d => d.Magnitude >= 8.1);
    } else if (range === "all") {
        filteredData = DATA;
    }

    generateEarthquakeImpactGraphs(filteredData);
    console.log(filteredData);
});

function filtrarVis1(region) {

}


function generateEarthquakeImpactGraphs(data) {
    console.log("data filtrada por region: ", data);
    data.sort((a, b) => a.Year - b.Year);

    // ESCALAS
    const escalaColorCategorica1 = d3.scaleOrdinal(["red", "orange", "yellowgreen"]);
    const escalaColorCategorica2 = d3.scaleOrdinal(["gray"]);
    const escalaColorCategorica3 = d3.scaleOrdinal(["blue", "green"]);

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
    .range([0, WIDTHVIS_VIS_1/4]);


    // EJES
    const ejeX = d3.axisBottom(escalaX);
    const ejeY11 = d3.axisLeft(escalaDeaths);
    const ejeY12 = d3.axisRight(escalaInjuries);
    const ejeY2 = d3.axisLeft(escalaDamage);
    const ejeY31 = d3.axisLeft(escalaHousesDestroyed);
    const ejeY32 = d3.axisRight(escalaHousesDamaged);

    contenedor1
    .append("g")
    .attr("class", "ejeX1")
    .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
    .call(ejeX);

    contenedor1
    .append("g")
    .attr("class", "ejeY1")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("stroke", escalaColorCategorica1(0))
    .call(ejeY11);
    contenedor1
    .append("g")
    .attr("class", "ejeY2")
    .attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)
    .attr("stroke", escalaColorCategorica1(2))
    .call(ejeY12);
    

    contenedor2
    .append("g")
    .attr("class", "ejeX2")
    .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
    .call(ejeX);
    contenedor2
    .append("g")
    .attr("class", "ejeY")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("stroke", escalaColorCategorica2(0))
    .call(ejeY2);

    contenedor3
    .append("g")
    .attr("class", "ejeX3")
    .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
    .call(ejeX);

    contenedor3
    .append("g")
    .attr("class", "ejeY1")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("stroke", escalaColorCategorica3(0))
    .call(ejeY31);
    contenedor3
    .append("g")
    .attr("class", "ejeY2")
    .attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)
    .attr("stroke", escalaColorCategorica3(1))
    .call(ejeY32);


    // CREAMOS LA VISUALIZACIÓN
    contenedor1
    .selectAll(".casita")
    .data(data,  d => d.id)
    .join(
        enter => {
            const CASITA = enter.append("g").attr("class", "casita").style("opacity", 0);
            console.log("ENTER");
            console.log(CASITA);
            console.log("ENTER");

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
                .attr("cy", (d) => escalaInjuries(d.Missing));
            
            CASITA.append("circle")
                .attr("class", "Injuried")
                .attr("fill", escalaColorCategorica1(2))
                .attr("r", 2)
                .attr("cx", (d) => escalaX(d.Year))
                .attr("cy", (d) => escalaInjuries(d.Injuries));

            // Definir la función de línea
            const linea1 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaDeaths(d.Deaths));

            const linea2 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaInjuries(d.Missing));

            const linea3 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaInjuries(d.Injuries));

            // Agregar la línea al contenedor
            CASITA.append("path")
            .datum(data)
            .attr("class", "line-Deaths")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica1(0))
            .attr("stroke-width", 0.75)
            .attr("d", linea1);

            CASITA.append("path")
            .datum(data)
            .attr("class", "line-Missing")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica1(1))
            .attr("stroke-width", 0.75)
            .attr("d", linea2);

            CASITA.append("path")
            .datum(data)
            .attr("class", "line-Injuries")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica1(2))
            .attr("stroke-width", 0.75)
            .attr("d", linea3);

            CASITA.transition("crear")
                .duration(500)
                .style("opacity", 1);

            return CASITA
        },
        update => {            
            // Actualizar ejes
            contenedor1.selectAll(".ejeX1").call(ejeX);
            contenedor1.selectAll(".ejeY1").call(ejeY11);
            contenedor1.selectAll(".ejeY1").attr("transform", `translate(${0}, ${0})`);
            contenedor1.selectAll(".ejeY2").call(ejeY12);
            contenedor1.selectAll(".ejeY2").attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)

            // console.log(update);
            // const CASITA = update.selectAll(".casita");
            // console.log("UPDATE");
            // console.log(CASITA);
            // console.log("UPDATE");
            // console.log("UPDATE circle deaths");
            // console.log(CASITA._parents[0]);
            // console.log("UPDATE circle deaths");

            // Actualizar círculos
            update.selectAll(".Deaths").transition("nuevaPos1")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaDeaths(d.Deaths);
                return cy;
            })

            update.selectAll(".Missing").transition("nuevaPos2")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaInjuries(d.Missing);
                return cy;
            })

            update.selectAll(".Injuries").transition("nuevaPos3")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaInjuries(d.Injuries);
                return cy;
            })
            
            // Actualizar líneas
            const linea1 = d3.line()
                .x(d => escalaX(d.Year))
                .y(d => escalaDeaths(d.Deaths));

            const linea2 = d3.line()
                .x(d => escalaX(d.Year))
                .y(d => escalaInjuries(d.Missing));

            const linea3 = d3.line()
                .x(d => escalaX(d.Year))
                .y(d => escalaInjuries(d.Injuries));

            update.selectAll(".line-Deaths").transition("nuevaPos11")
            .duration(1000)
                .attr("d", linea1);

            update.selectAll(".line-Missing").transition("nuevaPos12")
            .duration(1000)
                .attr("d", linea2);

            update.selectAll(".line-Injuried").transition("nuevaPos13")
            .duration(1000)
                .attr("d", linea3);

            return update
        },
        exit => {
            exit.remove()
            return exit
        }
    )


    contenedor2
    .selectAll(".casita")
    .data(data,  d => d.id)
    .join(
        enter => {
            const CASITA = enter.append("g").attr("class", "casita").style("opacity", 0);

            CASITA.append("circle")
                .attr("class", "EconomicDamage")
                .attr("fill", escalaColorCategorica2())
                .attr("r", 2)
                .attr("cx", (d) => escalaX(d.Year))
                .attr("cy", (d) => escalaDamage(d.Damage));
            
            const linea4 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaDamage(d.Damage));
        
            CASITA.append("path")
            .datum(data)
            .attr("class", "line-EconomicDamage")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica2())
            .attr("stroke-width", 0.75)
            .attr("d", linea4);

            CASITA.transition("crear")
                .duration(500)
                .style("opacity", 1);

            return CASITA
        },
        update => {
            // Actualizar ejes
            contenedor2.selectAll(".ejeX2").call(ejeX);
            contenedor2.selectAll(".ejeY").call(ejeY2);
            contenedor2.selectAll(".ejeY").attr("transform", `translate(${0}, ${0})`)

            // update.selectAll(".EconomicDamage").transition("nuevaPos21")
            // .duration(1000)
            // .attr("transform", (d, i) => {
            //     const x = escalaX(d.Year);
            //     const y = escalaDamage(d.Damage);
            //     return `translate(${x}, ${y})`;})

            // Actualizar circulos
            update.selectAll(".EconomicDamage").transition("nuevaPos21")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaDamage(d.Damage);
                return cy;
            })

            // Actualizar lineas
            const linea4 = d3.line()
                .x(d => escalaX(d.Year))
                .y(d => escalaDamage(d.Damage));

            update.selectAll(".line-EconomicDamage").transition("nuevaPos212")
            .duration(1000)
                .attr("d", linea4);

            return update
        },
        exit => {
            exit.remove()
            return exit
        }

    )

    contenedor3
    .selectAll(".casita")
    .data(data,  d => d.id)
    .join(
        enter => {
            const CASITA = enter.append("g").attr("class", "casita").style("opacity", 0);

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

            const linea5 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaHousesDestroyed(d.HousesDestroyed));
        
            const linea6 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaHousesDamaged(d.HousesDamaged));
        
            CASITA.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica3(0))
            .attr("stroke-width", 0.75)
            .attr("d", linea5);
        
            CASITA.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica3(1))
            .attr("stroke-width", 0.75)
            .attr("d", linea6);

            CASITA.transition("crear")
                .duration(500)
                .style("opacity", 1);

            return CASITA
        },
        update => {
            // Actualizar ejes
            contenedor3.selectAll(".ejeX3").call(ejeX);
            contenedor3.selectAll(".ejeY1").call(ejeY11);
            contenedor3.selectAll(".ejeY1").attr("transform", `translate(${0}, ${0})`);
            contenedor3.selectAll(".ejeY2").call(ejeY12);
            contenedor3.selectAll(".ejeY2").attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)

            // Actualizar Circulos
            update.selectAll(".HousesDestroyed").transition("nuevaPos31")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaHousesDestroyed(d.HousesDestroyed);
                return cy;
            })

            update.selectAll(".HousesDamaged").transition("nuevaPos32")
            .duration(1000)
            .attr("cx", (d, i) => {
                const cx = escalaX(d.Year);
                return cx;
            })
            .attr("cy", (d, i) => {
                const cy = escalaHousesDamaged(d.HousesDamaged);
                return cy;
            })

            // Actualizar lineas
            const linea5 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaHousesDestroyed(d.HousesDestroyed));
        
            const linea6 = d3.line()
            .x(d => escalaX(d.Year))
            .y(d => escalaHousesDamaged(d.HousesDamaged));

            update.selectAll(".line-HousesDestroyed").transition("nuevaPos311")
            .duration(1000)
                .attr("d", linea5);

            update.selectAll(".line-HousesDamaged").transition("nuevaPos312")
            .duration(1000)
                .attr("d", linea6);

            return update
        },
        exit => {
            exit.remove()
            return exit
        }
    )

    // Crear tooltip vacío con clase "tooltip". En el CSS está todo lo necesario
    let tooltip = d3.select("body").append("div")
        .style("opacity", 0)
        .style("width", 200)
        .style("height", 50)
        .style("pointer-events", "none")
        .style("background", "rgb(117, 168, 234)")
        .style("border-radius", "8px")
        .style("padding", "4px")
        .style("position", "absolute");

    // Seleccionar todos los puntos
    const puntos = SVG1.selectAll(".casita").selectAll("circle");
    // Seleccionar todas las lineas
    const lineas = SVG1.selectAll(".casita").selectAll("path");

    puntos.on("mouseover",  (event, d) => {
        // tooltip
        //         .html(`
        //             ID: ${d.id}<br>
        //             Año: ${d.Year}<br>
        //             Mes: ${d.Month}<br>
        //             Día: ${d.Day}<br>
        //             Lugar epicentro: ${d.LocationName}<br>
        //             Magnitud: ${d.Magnitude}<br>
        //             Muertos: ${d.Deaths}<br>
        //             Lesionados: ${d.Injuries}<br>
        //             Desaparecidos: ${d.Missing}<br>
        //             Daño económico: ${d.Damage}<br>
        //             Casas destruidas: ${d.HousesDestroyed}<br>
        //             Casas dañadas: ${d.HousesDamaged}<br>
        //         `)
        //         .style("opacity", 1)
        //         .style("left", (event.pageX + 10) + "px")
        //         .style("top", (event.pageY - 28) + "px");

        puntos.style("opacity", function(dat) {
            return dat === d ? 1 : 0.5; 
        });
        puntos.style("r", function(dat) {
            return dat === d ? 5 : 2;
        });
        lineas.style("stroke-opacity", 0.1);
        lineas.style("stroke-width", 0.2);

        // Selecciona cada <span> por su ID y actualiza su contenido
        d3.select("#year").text(d.Year);
        d3.select("#month").text(d.Month);
        d3.select("#day").text(d.Day);
        d3.select("#location").text(d.LocationName);
        d3.select("#magnitude").text( d.Magnitude);
        d3.select("#damage").text( d.Damage);
        d3.select("#deaths").text( d.Deaths);
        d3.select("#missing").text( d.Missing);
        d3.select("#injuries").text( d.Injuries);
        d3.select("#housesDes").text( d.HousesDestroyed);
        d3.select("#housesDam").text( d.HousesDamaged);
    })
    .on("mouseleave", (evento, d) => {
        puntos.style("opacity", 1)
        puntos.style("r", 2)
        lineas.style("stroke-opacity", 1);
        lineas.style("stroke-width", 0.75);
        tooltip.style("opacity", 0);

        d3.select("#year").text("");
        d3.select("#month").text("");
        d3.select("#day").text("");
        d3.select("#location").text("");
        d3.select("#magnitude").text("");
        d3.select("#damage").text("");
        d3.select("#deaths").text("");
        d3.select("#missing").text("");
        d3.select("#injuries").text("");
        d3.select("#housesDes").text("");
        d3.select("#housesDam").text("");

    });
}

generateMapGraph();

function generateMapGraph() {

    const EarthquakeData = fetchEarthquakeData();

    EarthquakeData.then(data => {
        console.log("EarthquakeData:")
        console.log(data);

        d3.json("regiones_chile.json").then((MapData) => {

            // Al inicio, deshabilita el botón de profundidad
            document.getElementById('BotonProfundidad').disabled = true;

            // Escucha el evento de clic en el botón de epicentros
            document.getElementById('BotonEpicentros').addEventListener('click', function() {
                // Habilita el botón de profundidad
                document.getElementById('BotonProfundidad').disabled = false;
            });

            // console.log("MapData:")
            // console.log(MapData);

            // Define la transformación
            const proyeccion = d3.geoMercator()
            .rotate([-25, 90]) // Rotamos el mapa 90 grados
            .fitSize([WIDTH_VIS_2, HEIGHT_VIS_2], MapData)
            .center([-23, 0])
            // Hacemos una escala relativa al tamaño del contenedor
            .scale(1.3*WIDTH_VIS_2);

            const caminosGeo = d3.geoPath().projection(proyeccion);

            function calculateEarthquakes(data, MapData) {
                // 1. Calcular la cantidad de terremotos en cada región
                const earthquakeCounts = {};
                const totalEarthquakes = data.length;
                suma = 0;
                data.forEach(d => {
                    MapData.features.forEach(feature => {
                        const [[minLong, minLat], [maxLong, maxLat]] = d3.geoBounds(feature);
                        // console.log("bounds:");
                        // console.log(minLong);
                        if (d3.geoContains(feature, [d.Longitude, d.Latitude])) {
                            if (!earthquakeCounts[feature.properties.Region] || earthquakeCounts[feature.properties.Region] === 0) {
                                // console.log(feature.properties.Region);
                                earthquakeCounts[feature.properties.Region] = 0;
                            }
                            // Agregamos un atributo "Region" al objeto "d" para poder filtrar los terremotos por región
                            d.Region = feature.properties.Region;
                            // console.log(d.Region);
                            earthquakeCounts[feature.properties.Region]++;
                            suma++;
                        } 
                        else if (d.Latitude >= minLat && d.Latitude <= maxLat) {
                            if (!earthquakeCounts[feature.properties.Region]) {
                                if (earthquakeCounts[feature.properties.Region] != 0) {
                                    // console.log(feature.properties.Region);
                                    earthquakeCounts[feature.properties.Region] = 0;
                                    // console.log(earthquakeCounts[feature.properties.Region]);
                                }
                            }
                            if (!d.Region) {
                                d.Region = feature.properties.Region;
                                earthquakeCounts[feature.properties.Region]++;
                                suma++;
                            }
                        }
                    });
                });
            MapData.features.forEach(feature => {
                if (!earthquakeCounts[feature.properties.Region]) {
                    earthquakeCounts[feature.properties.Region] = 0;
                }
            });
            // console.log("suma:");
            // console.log(suma);
            return earthquakeCounts;
            }


            const earthquakeCounts = calculateEarthquakes(data, MapData);

            // 2. Crear una escala de color
            const colorScale = d3.scaleSequential()
                .domain([0, d3.max(Object.values(earthquakeCounts))])
                .interpolator(d3.interpolateReds);

            function drawLegend(SVG2, colorScale, earthquakeCounts) {
                // 1. Define un degradado en los "defs" del SVG
                const defs = SVG2.append("defs");
            
                const gradient = defs.append("linearGradient")
                    .attr("id", "gradient")
                    .attr("gradientTransform", "rotate(90)");
            
                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", colorScale(0));
            
                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", colorScale(d3.max(Object.values(earthquakeCounts))));
            
                // 2. Dibuja un rectángulo y aplica el degradado
                const legend = SVG2.append("rect")
                    .attr("x", 20)
                    .attr("y", 40)
                    .attr("width", 20)
                    .attr("height", 600) // Ajusta el tamaño según sea necesario
                    .style("fill", "url(#gradient)");
            
                // 3. Agrega etiquetas de texto para los valores mínimo y máximo
                SVG2.append("text")
                    .attr("x", 50) // Ajusta la posición según sea necesario
                    .attr("y", 20 + 20) // Alinea el texto con el borde superior del rectángulo
                    .text(0);
            
                SVG2.append("text")
                    .attr("x", 50) // Ajusta la posición según sea necesario
                    .attr("y", 20 + 600 + 25) // Alinea el texto con el borde inferior del rectángulo
                    .text(d3.max(Object.values(earthquakeCounts)));
                
                SVG2.append("text")
                    .attr("x", 10) // Ajusta la posición según sea necesario
                    .attr("y", 20) // Alinea el texto con el borde superior del rectángulo
                    .text("Cantidad de terremotos");
            }

            drawLegend(SVG2, colorScale, earthquakeCounts);

            // Calcular la suma total de terremotos
            let totalEarthquakes = 0;
            for (let region in earthquakeCounts) {
                totalEarthquakes += earthquakeCounts[region];
            }

            // Establecer el nombre de la región y la cantidad de terremotos
            d3.select('#region-name').text(`Chile`);
            d3.select('#earthquake-count').text(`Cantidad total de terremotos: ${totalEarthquakes}`);

            var profundidadVisible = false;

            SVG2
            .selectAll("path")
            .data(MapData.features)
            .join("path")
            .attr("d", caminosGeo)
            .attr("stroke", "#ccc")
            .attr("fill", d => colorScale(earthquakeCounts[d.properties.Region] || 0))
            .on('click', function(event, d) {

                // generateEarthquakeImpactGraphs(d);
                // Remover la aplicación de clases 'opaque' y 'border'
                d3.selectAll('path')
                    .style('opacity', 0.25); // Hacer todos los paths completamente visibles
                d3.select(this)
                    .style('opacity', 1); // Hacer el path clickeado completamente visible
                d3.selectAll('path').classed('border', false);
                d3.select(this).classed('border', true);
                const data = d;
                // console.log(MapData);

                // DATA.filter(d => d.Magnitude >= 5.0 && d.Magnitude <= 6.0);
                var dataFiltrada = [];
                var cont = 0;
                // Opacar todos los círculos que no pertenecen a la región clickeada
                if (puntosVisibles) {
                    d3.selectAll('circle:not(#end)')
                        .style('opacity', function(d) { 
                            if (d.Region !== data.properties.Region) {
                            } else {
                                dataFiltrada[cont] = d;
                                cont += 1;
                            }
                            return d.Region !== data.properties.Region ? 0.5 : 1; 
                        });
                } else {
                    d3.selectAll('circle:not(#end)')
                        .style('opacity', function(d) { 
                            if (d.Region !== data.properties.Region) {
                            } else {
                                dataFiltrada[cont] = d;
                                cont += 1;
                            }
                        });
                }
                generateEarthquakeImpactGraphs(dataFiltrada);

                if (!profundidadVisible) {
                    d3.selectAll('circle.end')
                        .style('opacity', 0);
                }

                if (profundidadVisible) {
                    d3.selectAll('circle.end')
                    .style('opacity', function(d) { 
                        return d.Region !== data.properties.Region ? 0.5 : 1; 
                    });
            
                d3.selectAll('line')
                    .style('opacity', function(d) { 
                        return d.Region !== data.properties.Region ? 0.5 : 1; 
                    });
                }
            
                // Actualizar el nombre de la región y la cantidad de terremotos
                d3.select('#region-name').text(`${data.properties.Region}`);
                d3.select('#earthquake-count').text(`Cantidad de terremotos: ${earthquakeCounts[data.properties.Region]}`);
            })


            // Crear un controlador de zoom
            let zoom = d3.zoom()
                .scaleExtent([0.5, 5])
                .on("zoom", zoomed);

            // Aplicar el controlador de zoom al SVG
            SVG2.call(zoom);

            // Variable para rastrear el nivel de zoom actual
            let currentZoom = d3.zoomIdentity;

            function zoomed(event) {
                currentZoom = event.transform;
                // console.log(currentZoom);
                // Aplica el zoom a todos los elementos dentro del SVG que desees que sean afectados por el zoom.
                // Por ejemplo, si tienes un grupo 'g' que contiene todos los elementos de tu mapa, puedes aplicar el zoom a ese grupo.
                SVG2.selectAll('path') // Asegúrate de seleccionar todos los elementos que quieras que respondan al zoom
                    .attr('transform', currentZoom);

                SVG2.selectAll('circle')
                    .attr('cx', d => currentZoom.applyX(proyeccion([d.Longitude, d.Latitude])[0]))
                    .attr('cy', d => currentZoom.applyY(proyeccion([d.Longitude, d.Latitude])[1]))
                    .attr('r', 1.5 * currentZoom.k);
                
                SVG2.selectAll('circle.end')
                    .attr('cx', d => currentZoom.applyX(proyeccion([d.Longitude, d.Latitude])[0]))
                    .attr('cy', d => currentZoom.applyY(proyeccion([d.Longitude - 0.15*d.FocalDepth, d.Latitude])[1]))
                    .attr('r', 1.5 * currentZoom.k);

                SVG2.selectAll('line')
                    .attr("transform", currentZoom);

                ejeY.selectAll('.scale-text')
                    .attr('x', currentZoom.applyX(WIDTH_VIS_2 - 50)) // Ejemplo de ajuste en x basado en el zoom
                    .attr('y', function(d) {
                        // Aquí necesitas ajustar el cálculo de 'y' basado en tu lógica específica y el zoom
                        var baseY = 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1];
                        var adjustment = this.textContent === "0" ? 5 : this.textContent === "10 Km" ? proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13 : 2 * proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13;
                        return currentZoom.applyY(baseY + adjustment); // Ajuste en y basado en el zoom
                    });

                ejeY.selectAll('.axis-label')
                    .attr('x', currentZoom.applyX( WIDTH_VIS_2 - 50)) // Ajuste en x basado en el zoom
                    .attr('y', currentZoom.applyY(150 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 5)); // Ajuste en y basado en el zoom
                    
            }

            // Creamos los círculos
            SVG2.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => currentZoom.applyX(proyeccion([d.Longitude, d.Latitude])[0]))
                .attr("cy", d => currentZoom.applyY(proyeccion([d.Longitude, d.Latitude])[1]))
                .attr("r", 1.5*currentZoom.k)
                .attr("fill", "green")
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
                .attr("class", d => d.Region)
                .style("opacity", 0)
                .on("mouseover", (event, d) => {
                    // console.log("Datos del terremoto:", d);
                    SVG2.selectAll("circle")
                    .attr("opacity", dat => dat === d ? 1 : 0.5)
                    .attr("r", dat => dat === d ? 5 : 1.5*currentZoom.k);
            
                    // Selecciona cada <span> por su ID y actualiza su contenido
                    d3.select("#year2").text(d.Year);
                    d3.select("#month2").text(d.Month);
                    d3.select("#day2").text(d.Day); // Corregido el ID aquí
                    d3.select("#location2").text(d.LocationName);
                    d3.select("#magnitude2").text(d.Magnitude);
                    d3.select("#damage2").text(d.Damage);
                    d3.select("#deaths2").text(d.Deaths);
                    d3.select("#missing2").text(d.Missing);
                    d3.select("#injuries2").text(d.Injuries);
                    d3.select("#housesDes2").text(d.HousesDestroyed);
                    d3.select("#housesDam2").text(d.HousesDamaged);
                })
                .on("mouseleave", (evento, d) => {
                    // Evento mouseleave
                    SVG2.selectAll("circle")
                                .attr("opacity", 1)
                                .attr("r", 1.5*currentZoom.k);
                        
                            d3.select("#year2").text("");
                            d3.select("#month2").text("");
                            d3.select("#day2").text("");
                            d3.select("#location2").text("");
                            d3.select("#magnitude2").text("");
                            d3.select("#damage2").text("");
                            d3.select("#deaths2").text("");
                            d3.select("#missing2").text("");
                            d3.select("#injuries2").text("");
                            d3.select("#housesDes2").text("");
                            d3.select("#housesDam2").text("");
                });

            // Variable para rastrear la visibilidad de los puntos
            let puntosVisibles = false;

            function generarPuntos() {
                if (!puntosVisibles) {
                    SVG2.selectAll("circle").style("opacity", 1);
                    SVG2.selectAll("circle.end").style("opacity", 0);
                    puntosVisibles = true; // Actualiza la bandera
                    profundidadVisible = false
                    d3.select('#BotonEpicentros').text('Ocultar epicentros');
                } else {
                    d3.select('#BotonEpicentros').text('Mostrar epicentros');
                    // Oculta los puntos si están visibles
                    SVG2.selectAll("circle").style("opacity", 0);
                    SVG2.selectAll("circle.end").style("opacity", 0);
                    SVG2.selectAll("line:not(.scale-line)").style("opacity", 0);
                    profundidadVisible = false;
                    puntosVisibles = false; // Actualiza la bandera
                    d3.select('#BotonProfundidad').attr('disabled', !puntosVisibles);
                }
            }

            d3.select('#BotonEpicentros').on('click', generarPuntos);

            SVG2.selectAll("line")
            .data(data)
            .join("line")
            .attr("x1", d => proyeccion([d.Longitude, d.Latitude])[0])
            .attr("y1", d => proyeccion([d.Longitude, d.Latitude])[1])
            .attr("x2", d => proyeccion([d.Longitude, d.Latitude])[0])
            .attr("y2", d => proyeccion([d.Longitude - 0.15*d.FocalDepth, d.Latitude])[1])
            .attr("transform", currentZoom)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("class", d => d.Region)
            .attr("stroke-dasharray", function() {
                const length = this.getTotalLength();
                return length + " " + length;
            })
            .attr("stroke-dashoffset", function() {
                return this.getTotalLength();
            });

            // Crear círculos
            SVG2.selectAll("circle.end")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "end")
                .attr("cx", d => proyeccion([d.Longitude, d.Latitude])[0])
                .attr("cy", d => proyeccion([d.Longitude - 0.15*d.FocalDepth, d.Latitude])[1])
                .attr("r", 1.5)
                .attr("fill", "red")
                .style("opacity", 0); // Inicialmente invisibles

                function generarLineas() {
                    // Restablecer stroke-dasharray y stroke-dashoffset antes de la transición
                    SVG2.selectAll("line:not(.scale-line)")
                        .attr("stroke-dasharray", function() {
                            return this.getTotalLength();
                        })
                        .attr("stroke-dashoffset", function() {
                            return this.getTotalLength();
                        })
                        .style("opacity", 0)
                        .transition()
                        .duration(2000)
                        .attr("stroke-dashoffset", 0)
                        .style("opacity", 1);
                
                    SVG2.selectAll("circle.end")
                            .style("opacity", 0);
                
                    // Aplicar transición a los círculos después del timeout
                    setTimeout(function() {
                        SVG2.selectAll("circle.end")
                            .style("opacity", 1); // Hacerlos visibles
                    }, 2000);
                    profundidadVisible = true;
                }

            d3.select('#BotonProfundidad').on('click', generarLineas);

            // Buscamos toda la información del punto con el mayor focalDepth
            const maxFocalDepth = data.reduce((max, current) => {
                return current.FocalDepth > max.FocalDepth ? current : max;
            });

            // Creamos un contenedor para la escala
            let ejeY = SVG2.append("g")
                .attr("class", "scale");

            // Creamos una línea de escala del largo maxfocalDepth
            ejeY.append("line")
                .attr("class", "scale-line")
                .attr("x1", d => WIDTH_VIS_2 - 60)
                .attr("y1", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1])
                .attr("x2", d => WIDTH_VIS_2 - 60)
                .attr("y2", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 2 * proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .attr("stroke", "black");
            
            // Le agregamos una línea horizontal al incio con el número 0 y otra al final con el número maxFocalDepth
            ejeY.append("line")
                .attr("class", "scale-line")
                .attr("x1", d => WIDTH_VIS_2 - 50 - 15)
                .attr("y1", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1])
                .attr("x2", d => WIDTH_VIS_2 - 50 - 5)
                .attr("y2", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1])
                .attr("stroke", "black");

            ejeY.append("line")
                .attr("class", "scale-line")
                .attr("x1", d => WIDTH_VIS_2 - 50 - 15)
                .attr("y1", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .attr("x2", d => WIDTH_VIS_2 - 50 - 5)
                .attr("y2", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .attr("stroke", "black");
            
            ejeY.append("line")
                .attr("class", "scale-line")
                .attr("x1", d => WIDTH_VIS_2 - 50 - 15)
                .attr("y1", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 2 * proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .attr("x2", d => WIDTH_VIS_2 - 50 - 5)
                .attr("y2", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 2 * proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .attr("stroke", "black");

            
            // Agregamos el texto 0
            ejeY.append("text")
                .attr("class", "axis-label")
                .attr("x", d => WIDTH_VIS_2 - 50)
                .attr("y", d => 150 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 5)
                .attr("text-anchor", "end")
                .text("Escala de profundidad (Km)");

            // Agregamos el texto 0
            ejeY.append("text")
                .attr("class", "scale-text")
                .attr("x", d => WIDTH_VIS_2 - 50)
                .attr("y", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 5)
                .text("0");

            // Agregamos el texto maxFocalDepth
            ejeY.append("text")
                .attr("class", "scale-text")
                .attr("x", d => WIDTH_VIS_2 - 50)
                .attr("y", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .text("10 Km");
            
            ejeY.append("text")
                .attr("class", "scale-text")
                .attr("x", d => WIDTH_VIS_2 - 50)
                .attr("y", d => 20 + proyeccion([maxFocalDepth.Longitude, maxFocalDepth.Latitude])[1] + 2 * proyeccion([maxFocalDepth.Longitude - 0.15*maxFocalDepth.FocalDepth, maxFocalDepth.Latitude])[1]/13)
                .text("20 Km");
            
            

        });
    });
}
