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
/* ORDINAMENTO TABELLA */
/* ============================= */


const headers =
    document.querySelectorAll(".jobs-header div");


const body =
    document.querySelector(".jobs-body");



if (headers.length && body) {


    const originalOrder =
        Array.from(body.querySelectorAll(".row"));



    let sortState =
        Array(headers.length).fill(0);



    headers.forEach((header, index) => {


        header.style.cursor = "pointer";



        header.addEventListener("mouseenter", () => {

            header.classList.add("hover-sort");

        });



        header.addEventListener("mouseleave", () => {

            header.classList.remove("hover-sort");

        });





        header.addEventListener("click", () => {



            // reset underline altri

            headers.forEach(h => {

                h.classList.remove("sort-active", "sort-asc", "sort-desc");

            });



            sortState[index]++;



            if (sortState[index] > 2) {

                sortState[index] = 0;

            }





            // RESET

            if (sortState[index] === 0) {


                originalOrder.forEach(row => {

                    body.appendChild(row);

                });


                return;

            }

            /* ============================= */
    /* INDICATORE */
    /* ============================= */

    if (sortState[index] === 1) {
        header.classList.add("sort-asc");
    }

    if (sortState[index] === 2) {
        header.classList.add("sort-desc");
    }


    header.classList.add("sort-active");






            header.classList.add("sort-active");





            const rows =
                Array.from(body.querySelectorAll(".row"));



            rows.sort((a,b) => {


                const A =
                    a.children[index]
                    .textContent
                    .trim()
                    .toLowerCase();



                const B =
                    b.children[index]
                    .textContent
                    .trim()
                    .toLowerCase();




                return sortState[index] === 1

                    ? A.localeCompare(B)

                    : B.localeCompare(A);



            });





            rows.forEach(row => {

                body.appendChild(row);

            });




        });


    });


}

/* ============================= */
/* DRAG COLOR INVERSION */
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
    /* MOUSE DOWN */
    /* ============================= */

    document.addEventListener("mousedown", function (event) {

        /* solo tasto sinistro */
        if (event.button !== 0) return;

        selecting = true;

        startX = event.clientX;
        startY = event.clientY;

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

    });


    /* ============================= */
    /* MOUSE MOVE */
    /* ============================= */

    document.addEventListener("mousemove", function (event) {

        if (!selecting) return;

        const currentX = event.clientX;
        const currentY = event.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);

        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);


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

    });


    /* ============================= */
    /* MOUSE UP */
    /* ============================= */

    document.addEventListener("mouseup", function () {

        if (!selecting) return;

        selecting = false;

        selection.style.display = "none";
        invert.style.display = "none";

    });


    /* ============================= */
    /* ESC */
    /* ============================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            selecting = false;

            selection.style.display = "none";
            invert.style.display = "none";

        }

    });

})();

