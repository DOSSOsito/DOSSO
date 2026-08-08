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
            window.location.href = "workinprogress.html";
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

                h.classList.remove("sort-active");

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
/* INTRO SOLO AL PRIMO INGRESSO */
/* ============================= */

const siteIntro = document.getElementById("site-intro");

if (siteIntro && sessionStorage.getItem("dosso-intro") === "true") {

    // Elimina subito il flag:
    // quindi l'animazione non verrà ripetuta
    sessionStorage.removeItem("dosso-intro");


    // Logo + bianco iniziano a dissolversi
    setTimeout(() => {

        siteIntro.classList.add("site-intro-hidden");

    }, 500);


    // La home inizia a comparire quasi
    // alla fine della dissolvenza
    setTimeout(() => {

        document.body.classList.add("home-visible");

    }, 900);

}
else if (siteIntro) {

    // Se si torna alla home normalmente,
    // non mostrare l'intro
    siteIntro.remove();

    document.body.classList.add("home-visible");

}