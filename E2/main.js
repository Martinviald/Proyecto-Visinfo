
function fetchEarthquakeData() {
    const TERREMOTOS_URL = "https://raw.githubusercontent.com/Martinviald/Proyecto-Visinfo/main/E2/chile_earthquakes.csv?token=GHSAT0AAAAAACTVPHYGIDRFUFPMVM6WDJGCZTUO7IQ";
    return d3.csv(TERREMOTOS_URL, d3.autoType);
}

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

const WIDTH_VIS_1 = 858;
const HEIGHT_VIS_1 = 400;

const MARGIN = {
    top: 20,
    bottom: 20,
    right: 15,
    left: 45,
  };

const HEIGHTVIS_VIS_1 = HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS_VIS_1 = WIDTH_VIS_1 - MARGIN.right - MARGIN.left;


SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);

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

let data;
const magnitudeFilterButton = document.querySelectorAll(".magnitudeFilterButton");

magnitudeFilterButton.forEach(button => {
    button.addEventListener("click", function() {

        const range = button.getAttribute("data-range");

        if (range === "5.0 - 6.0") {
            data = DATA.filter(d => d.Magnitude >= 5.0 && d.Magnitude <= 6);
            generateEarthquakeImpactGraphs(data)
        } else if (range === "6.1 - 7.0") {
            data = DATA.filter(d => d.Magnitude >= 6.1 && d.Magnitude <= 7);
            generateEarthquakeImpactGraphs(data)
        } else if (range === "7.1 - 8.0") {
            data = DATA.filter(d => d.Magnitude >= 7.1 && d.Magnitude <= 8);
            generateEarthquakeImpactGraphs(data)
        } else if (range === "8.1+") {
            data = DATA.filter(d => d.Magnitude >= 8.1);
            generateEarthquakeImpactGraphs(data)
        } else if (range === "all") {
            data = DATA;
            generateEarthquakeImpactGraphs(data)
        }
        
    });
})


function generateEarthquakeImpactGraphs(data) {
    // console.log(data);

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
    .attr("class", "ejeX")
    .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
    .call(ejeX);

    contenedor1
    .append("g")
    .attr("class", "ejeY")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("stroke", escalaColorCategorica1(0))
    .call(ejeY11);
    contenedor1
    .append("g")
    .attr("class", "ejeY")
    .attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)
    .attr("stroke", escalaColorCategorica1(2))
    .call(ejeY12);
    

    contenedor2
    .append("g")
    .attr("class", "ejeX")
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
    .attr("class", "ejeX")
    .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
    .call(ejeX);

    contenedor3
    .append("g")
    .attr("class", "ejeY")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("stroke", escalaColorCategorica1(0))
    .call(ejeY31);
    contenedor3
    .append("g")
    .attr("class", "ejeY")
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
            .attr("class", "line")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica1(0))
            .attr("stroke-width", 0.75)
            .attr("d", linea1);

            CASITA.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("opacity", 1)
            .attr("stroke", escalaColorCategorica1(1))
            .attr("stroke-width", 0.75)
            .attr("d", linea2);

            CASITA.append("path")
            .datum(data)
            .attr("class", "line")
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
            contenedor1.selectAll(".ejeX").remove()
            contenedor1
            .append("g")
            .attr("class", "ejeX")
            .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
            .call(ejeX);

            contenedor1.selectAll(".ejeY").remove()
            contenedor1
            .append("g")
            .attr("class", "ejeY")
            .attr("transform", `translate(${0}, ${0})`)
            .attr("stroke", escalaColorCategorica1(0))
            .call(ejeY11);

            contenedor1
            .append("g")
            .attr("class", "ejeY")
            .attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)
            .attr("stroke", escalaColorCategorica1(2))
            .call(ejeY12);

            // // Actualizar círculos
            // update.selectAll(".casita")
            // .selectAll(".Deaths")
            // // .attr("cx", d => escalaX(d.Year))
            // // .attr("cy", d => escalaDeaths(d.Deaths));
            // .attr("transform", (d, i) => {
            //     const cx = escalaX(d.Year);
            //     const cy = escalaDeaths(d.Deaths);
            //     return `translate(${cx}, ${cy})`;
            // });

            // update.selectAll(".casita")
            //     .selectAll(".Missing")
            //     .attr("cx", d => escalaX(d.Year))
            //     .attr("cy", d => escalaMissing(d.Missing));

            // update.selectAll(".casita")
            //     .selectAll(".Injuried")
            //     .attr("cx", d => escalaX(d.Year))
            //     .attr("cy", d => escalaInjuries(d.Injuries));

            // // Actualizar líneas
            // const linea1 = d3.line()
            //     .x(d => escalaX(d.Year))
            //     .y(d => escalaDeaths(d.Deaths));

            // const linea2 = d3.line()
            //     .x(d => escalaX(d.Year))
            //     .y(d => escalaMissing(d.Missing));

            // const linea3 = d3.line()
            //     .x(d => escalaX(d.Year))
            //     .y(d => escalaInjuries(d.Injuries));

            // update.selectAll(".casita")
            //     .selectAll(".line-Deaths")
            //     .attr("d", linea1);

            // update.selectAll(".casita")
            //     .selectAll(".line-Missing")
            //     .attr("d", linea2);

            // update.selectAll(".casita")
            //     .selectAll(".line-Injuried")
            //     .attr("d", linea3);
            
            // // Transición
            // update.transition("aparecer")
            //     .duration(500)
            //     .style("opacity", 1)

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
            .attr("class", "line")
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
            contenedor2.selectAll(".ejeX").remove()
            contenedor2
            .append("g")
            .attr("class", "ejeX")
            .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
            .call(ejeX);

            contenedor2.selectAll(".ejeY").remove()
            contenedor2
            .append("g")
            .attr("class", "ejeY")
            .attr("transform", `translate(${0}, ${0})`)
            .attr("stroke", escalaColorCategorica2(0))
            .call(ejeY2);

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
            contenedor3.selectAll(".ejeX").remove()
            contenedor3
            .append("g")
            .attr("class", "ejeX")
            .attr("transform", `translate(${0}, ${HEIGHTVIS_VIS_1})`)
            .call(ejeX);

            contenedor3.selectAll(".ejeY").remove()
            contenedor3
            .append("g")
            .attr("class", "ejeY")
            .attr("transform", `translate(${0}, ${0})`)
            .attr("stroke", escalaColorCategorica3(0))
            .call(ejeY31);

            contenedor3
            .append("g")
            .attr("class", "ejeY")
            .attr("transform", `translate(${WIDTHVIS_VIS_1/4}, ${0})`)
            // .attr("fill", escalaColorCategorica3(1))
            .attr("stroke", escalaColorCategorica3(1))
            .call(ejeY32);

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