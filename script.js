// =====================================================
// PORTA → GALLERIA + ZOOM
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const door = document.getElementById("door");
    const bg = document.querySelector(".full-bg");

    if (!door) return;

    let lastTap = 0;
    let goingToGallery = false;

    function openGallery() {

        if (goingToGallery) return;

        goingToGallery = true;

        // Punto da cui parte lo zoom
        const rect = door.getBoundingClientRect();

        const x =
            (rect.left + rect.width / 2) /
            window.innerWidth * 100;

        const y =
            (rect.top + rect.height / 2) /
            window.innerHeight * 100;

        if (bg) {

            bg.style.transformOrigin =
                `${x}% ${y}%`;

            bg.classList.add("zoomed");

        }

        // Aspetta che finisca l'animazione
        setTimeout(function () {

            window.location.href =
                "info.html";

        },2000);

    }


    // =============================================
    // DESKTOP — DOPPIO CLICK
    // =============================================

    door.addEventListener("dblclick", function () {

        openGallery();

    });


    // =============================================
    // MOBILE — DOPPIO TAP
    // =============================================

    door.addEventListener("touchend", function (e) {

        e.preventDefault();

        const now = Date.now();

        if (now - lastTap < 500) {

            openGallery();

            return;

        }

        lastTap = now;

    }, { passive: false });


    // =============================================
    // AUTOMATICO DOPO 5 SECONDI
    // =============================================

    setTimeout(function () {

        openGallery();

    }, 45000);

});



/* ============================= */
/* TOOLTIP CELLE OVERFLOW */
/* ============================= */


function initTooltips() {


    document.querySelectorAll(".jobs-body .row div")
    .forEach(cell => {


        // evita duplicati
        if (cell.dataset.tooltipReady) return;


        cell.dataset.tooltipReady = true;


        let timer;
        let tooltip;



        cell.addEventListener("mouseenter", () => {


            // controlla ogni volta
            // così segue il responsive

            if (cell.scrollWidth <= cell.clientWidth) {
                return;
            }



            timer = setTimeout(() => {


                tooltip = document.createElement("div");

                tooltip.className = "cell-tooltip";

                tooltip.textContent =
                    cell.textContent.trim();


                document.body.appendChild(tooltip);



                const rect =
    cell.getBoundingClientRect();


const tooltipHeight =
    tooltip.offsetHeight;


/* POSIZIONE VERTICALE */

if (
    rect.bottom + tooltipHeight + 10
    < window.innerHeight
) {

    tooltip.style.top =
        rect.bottom + 8 + "px";

} else {

    tooltip.style.top =
        rect.top - tooltipHeight - 8 + "px";

}


/* ============================= */
/* POSIZIONE ORIZZONTALE */
/* ============================= */

const margin = 10;

let left = rect.left;

const tooltipWidth =
    tooltip.offsetWidth;


/* destra */

if (
    left + tooltipWidth + margin >
    window.innerWidth
) {

    left =
        window.innerWidth -
        tooltipWidth -
        margin;

}


/* sinistra */

if (left < margin) {

    left = margin;

}


tooltip.style.left =
    left + "px";



            }, 500);



        });



        cell.addEventListener("mouseleave", () => {


            clearTimeout(timer);


            if (tooltip) {

                tooltip.remove();
                tooltip = null;

            }


        });



    });

}



initTooltips();



window.addEventListener("resize", () => {

    document.querySelectorAll(".cell-tooltip")
        .forEach(t => t.remove());


});




/* ============================= */
/* ORDINAMENTO TABELLE */
/* ============================= */
/*
   LAVORI + GALLERIA
   → funzionamento originale

   ATTREZZATURA
   → categoria:
        ordina le categorie intere

   → nome / tipo / descrizione / anno:
        NON modifica l'ordine delle categorie
        ordina solo le righe dentro ogni categoria
*/

document.querySelectorAll(".jobs-table, .mobile-jobs").forEach(table => {

    const headers = Array.from(
        table.querySelectorAll(".jobs-header > div")
    );

    const body = table.querySelector(".jobs-body");

    if (!headers.length || !body) return;


    /* ================================================= */
    /* CONTROLLA SE È ATTREZZATURA */
    /* ================================================= */

    const isAttrezzatura =
        document.body.classList.contains("attrezzatura");


    /* ================================================= */
    /* TABELLE NORMALI */
    /* LAVORI + GALLERIA */
    /* ================================================= */

    if (!isAttrezzatura) {

        const originalOrder = Array.from(
            body.querySelectorAll(":scope > .row")
        );

        let activeColumn = null;
        let sortState = 0;


        headers.forEach((header, index) => {

            header.style.cursor = "pointer";


            header.addEventListener("click", function () {


                /* CAMBIO COLONNA */

                if (activeColumn !== index) {

                    activeColumn = index;
                    sortState = 1;

                }


                /* STESSA COLONNA */

                else {

                    sortState++;

                    if (sortState > 2) {
                        sortState = 0;
                    }

                }


                /* RESET FRECCE */

                headers.forEach(h => {

                    h.classList.remove(
                        "sort-active",
                        "sort-asc",
                        "sort-desc"
                    );

                });


                /* ORDINE ORIGINALE */

                if (sortState === 0) {

                    originalOrder.forEach(row => {
                        body.appendChild(row);
                    });

                    activeColumn = null;

                    return;

                }


                /* STATO HEADER */

                header.classList.add("sort-active");


                if (sortState === 1) {

                    header.classList.add("sort-asc");

                } else {

                    header.classList.add("sort-desc");

                }


                /* PRENDI LE RIGHE */

                const rows = Array.from(
                    body.querySelectorAll(":scope > .row")
                );


                /* ORDINA */

                rows.sort((a, b) => {

                    const A = a.children[index]
                        ? a.children[index]
                            .textContent
                            .trim()
                            .toLowerCase()
                        : "";

                    const B = b.children[index]
                        ? b.children[index]
                            .textContent
                            .trim()
                            .toLowerCase()
                        : "";


                    return sortState === 1

                        ? A.localeCompare(B, "it", {
                            numeric: true,
                            sensitivity: "base"
                        })

                        : B.localeCompare(A, "it", {
                            numeric: true,
                            sensitivity: "base"
                        });

                });


                rows.forEach(row => {
                    body.appendChild(row);
                });

            });

        });


        return;
    }


    /* ================================================= */
    /* ATTREZZATURA */
    /* ================================================= */


    const allRows = Array.from(
        body.querySelectorAll(":scope > .row")
    );


    /* ================================================= */
    /* CREA LE CATEGORIE */
    /* ================================================= */

    const groups = [];

    let currentGroup = null;


    allRows.forEach(row => {

        const cells = Array.from(row.children);

        const category =
            cells[0]
                ? cells[0].textContent.trim()
                : "";

        const otherCellsEmpty =
            cells.slice(1).every(cell =>
                cell.textContent.trim() === ""
            );


        /*
           Se categoria contiene testo
           e tutte le altre celle sono vuote,
           è una riga categoria.
        */

        if (category && otherCellsEmpty) {

            currentGroup = {

                categoryRow: row,

                rows: []

            };

            groups.push(currentGroup);

        }


        /*
           Altrimenti è una riga appartenente
           alla categoria precedente.
        */

        else if (currentGroup) {

            currentGroup.rows.push(row);

        }

    });


    /* ================================================= */
    /* ORDINE ORIGINALE DELLE CATEGORIE */
    /* ================================================= */

    const originalGroups = groups.map(group => ({

        categoryRow: group.categoryRow,

        rows: [...group.rows]

    }));


    let activeColumn = null;
    let sortState = 0;


    /* ================================================= */
    /* DISEGNA LA TABELLA */
    /* ================================================= */

    function renderGroups() {

        groups.forEach(group => {

            /*
               Prima la categoria
            */

            body.appendChild(
                group.categoryRow
            );


            /*
               Poi tutte le sue righe
            */

            group.rows.forEach(row => {

                body.appendChild(row);

            });

        });

    }


    /* ================================================= */
    /* ORDINA LE RIGHE DI UNA CATEGORIA */
    /* ================================================= */

    function sortRowsInsideGroup(
        group,
        column,
        direction
    ) {

        group.rows.sort((a, b) => {

            const A = a.children[column]
                ? a.children[column]
                    .textContent
                    .trim()
                    .toLowerCase()
                : "";

            const B = b.children[column]
                ? b.children[column]
                    .textContent
                    .trim()
                    .toLowerCase()
                : "";


            return direction === "asc"

                ? A.localeCompare(B, "it", {
                    numeric: true,
                    sensitivity: "base"
                })

                : B.localeCompare(A, "it", {
                    numeric: true,
                    sensitivity: "base"
                });

        });

    }


    /* ================================================= */
    /* CLICK HEADER */
    /* ================================================= */

    headers.forEach((header, index) => {

        header.style.cursor = "pointer";


        header.addEventListener("click", function () {


            /* ================================================= */
            /* CAMBIO COLONNA */
            /* ================================================= */

            if (activeColumn !== index) {

                activeColumn = index;

                sortState = 1;

            }


            /* ================================================= */
            /* STESSA COLONNA */
            /* ================================================= */

            else {

                sortState++;

                if (sortState > 2) {

                    sortState = 0;

                }

            }


            /* ================================================= */
            /* RESET FRECCE */
            /* ================================================= */

            headers.forEach(h => {

                h.classList.remove(
                    "sort-active",
                    "sort-asc",
                    "sort-desc"
                );

            });


            /* ================================================= */
            /* ORDINE ORIGINALE */
            /* ================================================= */

            if (sortState === 0) {


                /*
                   Ripristina completamente
                   categorie + righe.
                */

                groups.length = 0;


                originalGroups.forEach(originalGroup => {

                    groups.push({

                        categoryRow:
                            originalGroup.categoryRow,

                        rows: [
                            ...originalGroup.rows
                        ]

                    });

                });


                renderGroups();


                activeColumn = null;


                return;

            }


            /* ================================================= */
            /* HEADER ATTIVO */
            /* ================================================= */

            header.classList.add(
                "sort-active"
            );


            if (sortState === 1) {

                header.classList.add(
                    "sort-asc"
                );

            } else {

                header.classList.add(
                    "sort-desc"
                );

            }


            const direction =
                sortState === 1
                    ? "asc"
                    : "desc";


            /* ================================================= */
            /* CATEGORIA */
            /* ================================================= */

            if (index === 0) {


                /*
                   SOLO cliccando "categoria"
                   cambiamo l'ordine dei gruppi.
                */

                groups.sort((a, b) => {

                    const A =
                        a.categoryRow.children[0]
                            ? a.categoryRow.children[0]
                                .textContent
                                .trim()
                                .toLowerCase()
                            : "";

                    const B =
                        b.categoryRow.children[0]
                            ? b.categoryRow.children[0]
                                .textContent
                                .trim()
                                .toLowerCase()
                            : "";


                    return direction === "asc"

                        ? A.localeCompare(B, "it", {
                            numeric: true,
                            sensitivity: "base"
                        })

                        : B.localeCompare(A, "it", {
                            numeric: true,
                            sensitivity: "base"
                        });

                });


                /*
                   Le righe interne NON vengono toccate.
                */

                renderGroups();


                return;

            }


            /* ================================================= */
            /* TUTTI GLI ALTRI HEADER */
            /* ================================================= */

            /*
               nome
               tipo
               descrizione
               anno

               NON modificano MAI l'ordine delle categorie.
            */

            groups.forEach(group => {

                sortRowsInsideGroup(
                    group,
                    index,
                    direction
                );

            });


            /*
               Mantiene l'attuale ordine
               delle categorie.
            */

            renderGroups();

        });

    });

});




/* ============================= */
/* DRAG COLOR INVERSION */
/* DESKTOP + MOBILE */
/* ============================= */

(function () {

    let selecting = false;

    let startX = 0;
    let startY = 0;

    /* ============================= */
    /* CREA RETTANGOLO */
    /* ============================= */

    const selection = document.createElement("div");

    selection.className = "drag-selection";

    document.body.appendChild(selection);


    /* ============================= */
    /* CREA AREA INVERTITA */
    /* ============================= */

    const invert = document.createElement("div");

    invert.className = "drag-invert";

    document.body.appendChild(invert);


    /* ============================= */
    /* INIZIO SELEZIONE */
    /* ============================= */

    function startSelection(x, y) {

        selecting = true;

        startX = x;
        startY = y;

        selection.style.display = "block";
        invert.style.display = "block";

        selection.style.left = startX + "px";
        selection.style.top = startY + "px";

        selection.style.width = "0px";
        selection.style.height = "0px";

        invert.style.left = startX + "px";
        invert.style.top = startY + "px";

        invert.style.width = "0px";
        invert.style.height = "0px";
    }


    /* ============================= */
    /* AGGIORNA SELEZIONE */
    /* ============================= */

    function updateSelection(x, y) {

        if (!selecting) return;

        const left = Math.min(startX, x);
        const top = Math.min(startY, y);

        const width = Math.abs(x - startX);
        const height = Math.abs(y - startY);


        /* Rettangolo visibile */

        selection.style.left = left + "px";
        selection.style.top = top + "px";

        selection.style.width = width + "px";
        selection.style.height = height + "px";


        /* Area invertita */

        invert.style.left = left + "px";
        invert.style.top = top + "px";

        invert.style.width = width + "px";
        invert.style.height = height + "px";
    }


    /* ============================= */
    /* FINE SELEZIONE */
    /* ============================= */

    function endSelection() {

        if (!selecting) return;

        selecting = false;

        selection.style.display = "none";
        invert.style.display = "none";
    }


    /* ============================= */
    /* MOUSE */
    /* ============================= */

    document.addEventListener("mousedown", function (event) {

        if (event.button !== 0) return;

        startSelection(
            event.clientX,
            event.clientY
        );

    });


    document.addEventListener("mousemove", function (event) {

        if (!selecting) return;

        updateSelection(
            event.clientX,
            event.clientY
        );

    });


    document.addEventListener("mouseup", function () {

        endSelection();

    });


    /* ============================= */
    /* TOUCH MOBILE */
    /* ============================= */

    document.addEventListener("touchstart", function (event) {

        if (event.touches.length !== 1) return;

        const touch = event.touches[0];

        startSelection(
            touch.clientX,
            touch.clientY
        );

    }, { passive: true });


    document.addEventListener("touchmove", function (event) {

        if (!selecting) return;

        if (event.touches.length !== 1) return;

        const touch = event.touches[0];

        updateSelection(
            touch.clientX,
            touch.clientY
        );

    }, { passive: true });


    document.addEventListener("touchend", function () {

        endSelection();

    });


    /* ============================= */
    /* ESC */
    /* ============================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            endSelection();

        }

    });

})();

/* ============================= */
/* METEO DUBINO (SO) */
/* ============================= */

async function loadWeather() {

    const temperatureElement =
        document.querySelector(".weather-temperature");

    const descriptionElement =
        document.querySelector(".weather-description");

    const windElement =
        document.querySelector(".weather-wind");


    try {

        /*
         * Coordinate di Dubino (SO)
         */

        const latitude = 46.171;
        const longitude = 9.433;


        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FRome`
        );


        const data = await response.json();

        const current = data.current;


        /* Temperatura */

        temperatureElement.textContent =
            `${Math.round(current.temperature_2m)}°C`;


        /* Vento */

        windElement.textContent =
            `vento ${Math.round(current.wind_speed_10m)} km/h`;


        /* Descrizione */

        const weatherCode = current.weather_code;

        let description = "";


        if (weatherCode === 0) {
            description = "sereno";
        }

        else if (
            weatherCode === 1 ||
            weatherCode === 2
        ) {
            description = "parzialmente nuvoloso";
        }

        else if (weatherCode === 3) {
            description = "nuvoloso";
        }

        else if (
            weatherCode >= 45 &&
            weatherCode <= 48
        ) {
            description = "nebbia";
        }

        else if (
            weatherCode >= 51 &&
            weatherCode <= 57
        ) {
            description = "pioviggine";
        }

        else if (
            weatherCode >= 61 &&
            weatherCode <= 67
        ) {
            description = "pioggia";
        }

        else if (
            weatherCode >= 71 &&
            weatherCode <= 77
        ) {
            description = "neve";
        }

        else if (
            weatherCode >= 80 &&
            weatherCode <= 82
        ) {
            description = "rovesci";
        }

        else if (
            weatherCode >= 95
        ) {
            description = "temporale";
        }

        else {
            description = "variabile";
        }


        descriptionElement.textContent =
            description;


    } catch (error) {

        console.error(
            "Errore caricamento meteo:",
            error
        );

        descriptionElement.textContent =
            "meteo non disponibile";

    }
}


/* Avvio */

loadWeather();


/* Aggiorna ogni 10 minuti */

setInterval(
    loadWeather,
    10 * 60 * 1000
);


/* ============================= */
/* DATA E ORA */
/* ============================= */

function updateDateTime() {

    const dateElement =
        document.querySelector(".weather-date");

    const timeElement =
        document.querySelector(".weather-time");

    if (!dateElement || !timeElement) return;

    const now = new Date();

    const giorno =
        String(now.getDate()).padStart(2, "0");

    const mese =
        String(now.getMonth() + 1).padStart(2, "0");

    const anno =
        now.getFullYear();

    const ora =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");


    /* DATA */

    dateElement.textContent =
        `${giorno}.${mese}.${anno}`;


    /* ORA */

    timeElement.textContent =
        ora;
}


/* Aggiorna immediatamente */

updateDateTime();


/* Aggiorna ogni minuto */

setInterval(
    updateDateTime,
    60 * 1000
);

