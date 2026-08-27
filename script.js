/* ============================= */
/* ZOOM DOOR */
/* ============================= */

const door = document.getElementById('door');
const background = document.querySelector('.full-bg');


if (door && background) {

    door.addEventListener('dblclick', () => {

        const rect = door.getBoundingClientRect();
        const bgRect = background.getBoundingClientRect();

        const originX =
            ((rect.left + rect.width / 2 - bgRect.left) / bgRect.width) * 100;

        const originY =
            ((rect.top + rect.height / 2 - bgRect.top) / bgRect.height) * 100;


        background.style.transformOrigin =
            `${originX}% ${originY}%`;

        background.classList.add('zoomed');


        setTimeout(() => {
            window.location.href = "galleria.html";
        }, 1000);

    });

}



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



                tooltip.style.left =
                    rect.left + "px";



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
/* DESKTOP + MOBILE */
/* ============================= */

/*
   Cerca TUTTE le tabelle.

   .jobs-table
   → tabelle desktop

   .mobile-jobs
   → tabelle mobile
*/

document.querySelectorAll(".jobs-table, .mobile-jobs").forEach(table => {

    const headers = Array.from(
        table.querySelectorAll(".jobs-header > div")
    );

    const body = table.querySelector(".jobs-body");

    if (!headers.length || !body) return;


    /* ============================= */
    /* ORDINE ORIGINALE */
    /* ============================= */

    const originalOrder = Array.from(
        body.querySelectorAll(":scope > .row")
    );


    /* ============================= */
    /* STATO ORDINAMENTO */
    /* ============================= */

    let activeColumn = null;
    let sortState = 0;

    /*
     * 0 = ordine originale
     * 1 = crescente
     * 2 = decrescente
     */


    /* ============================= */
    /* CLICK SUGLI HEADER */
    /* ============================= */

    headers.forEach((header, index) => {

        header.style.cursor = "pointer";


        header.addEventListener("click", function () {


            /* ============================= */
            /* SE CAMBIO COLONNA */
            /* ============================= */

            if (activeColumn !== index) {

                activeColumn = index;
                sortState = 1;

            }


            /* ============================= */
            /* SE CLICCO LA STESSA COLONNA */
            /* ============================= */

            else {

                sortState++;

                if (sortState > 2) {
                    sortState = 0;
                }

            }


            /* ============================= */
            /* RIMUOVI FRECCE DA TUTTI */
            /* ============================= */

            headers.forEach(h => {

                h.classList.remove(
                    "sort-active",
                    "sort-asc",
                    "sort-desc"
                );

            });


            /* ============================= */
            /* ORDINE ORIGINALE */
            /* ============================= */

            if (sortState === 0) {

                originalOrder.forEach(row => {

                    body.appendChild(row);

                });

                activeColumn = null;

                return;

            }


            /* ============================= */
            /* AGGIUNGI STATO HEADER */
            /* ============================= */

            header.classList.add("sort-active");


            if (sortState === 1) {

                header.classList.add("sort-asc");

            } else {

                header.classList.add("sort-desc");

            }


            /* ============================= */
            /* PRENDI LE RIGHE */
            /* ============================= */

            const rows = Array.from(
                body.querySelectorAll(":scope > .row")
            );


            /* ============================= */
            /* ORDINA */
            /* ============================= */

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


            /* ============================= */
            /* APPLICA ORDINE */
            /* ============================= */

            rows.forEach(row => {

                body.appendChild(row);

            });

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
/* PAUSA INFO AL CLICK */
/* ============================= */

const infoContent = document.querySelector('.info-content');

if (infoContent) {

    infoContent.addEventListener('click', () => {

        infoContent.classList.toggle('paused');

    });

}

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

        const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
        const y = (rect.top + rect.height / 2) / window.innerHeight * 100;

        if (bg) {
            bg.style.transformOrigin = `${x}% ${y}%`;
            bg.classList.add("zoomed");
        }

        // Aspetta che finisca l'animazione
        setTimeout(function () {
            window.location.href = "galleria.html";
        }, 2000);
    }


    // DESKTOP — doppio click
    door.addEventListener("dblclick", function () {
        openGallery();
    });


    // MOBILE — doppio tap
    door.addEventListener("touchend", function (e) {

        e.preventDefault();

        const now = Date.now();

        if (now - lastTap < 500) {
            openGallery();
            return;
        }

        lastTap = now;

    }, { passive: false });

});
