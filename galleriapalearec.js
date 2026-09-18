const galleryFolder = "img/galleria/palearec/";

const galleryImages = [
    "PR01.webp",
    "PR02.webp",
    "PR03.webp",
    "PR04.webp",
    "PR05.webp",
    "PR06.webp",
    "PR07.webp",
    "PR08.webp",
    "PR09.webp",
    "PR10.webp",
    "PR11.webp",
    "PR12.webp",
    "PR13.webp",
    "PR14.webp",
    "PR15.webp",
    "PR16.webp",
    "PR17.webp",
    "PR18.webp"
];

let currentImage = 0;

const imageElement = document.querySelector(".gallery-image");
const prevButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");
const imageArea = document.querySelector(".gallery-image-area");

let referenceRatio = null;


/* ================================================= */
/* TROVA LA PRIMA FOTO ORIZZONTALE */
/* ================================================= */

function findReferenceImage() {

    for (let i = 0; i < galleryImages.length; i++) {

        const testImage = new Image();

        testImage.onload = function () {

            if (
                testImage.naturalWidth >=
                testImage.naturalHeight
            ) {

                referenceRatio =
                    testImage.naturalWidth /
                    testImage.naturalHeight;

                resizePortrait();

                return;
            }
        };

        testImage.src =
            galleryFolder + galleryImages[i];
    }
}


/* ================================================= */
/* CALCOLA DIMENSIONE DELLE VERTICALI */
/* ================================================= */

function resizePortrait() {

    if (!imageElement.dataset.portrait) {
        return;
    }

    if (referenceRatio === null) {
        return;
    }

    const availableWidth =
        imageArea.clientWidth;

    const availableHeight =
        imageArea.clientHeight;

    let referenceHeight =
        availableWidth / referenceRatio;

    referenceHeight =
        Math.min(
            referenceHeight,
            availableHeight
        );

    imageElement.style.width = "auto";

    imageElement.style.height =
        referenceHeight + "px";

    imageElement.style.maxWidth = "100%";

    imageElement.style.maxHeight = "none";
}


/* ================================================= */
/* MOSTRA IMMAGINE */
/* ================================================= */

function showImage(index) {

    if (index < 0) {
        index = galleryImages.length - 1;
    }

    if (index >= galleryImages.length) {
        index = 0;
    }

    currentImage = index;

    const src =
        galleryFolder + galleryImages[currentImage];

    const tempImage = new Image();

    tempImage.onload = function () {

        const isPortrait =
            tempImage.naturalHeight >
            tempImage.naturalWidth;


        /* ========================================= */
        /* VERTICALE */
        /* ========================================= */

        if (isPortrait) {

            imageElement.dataset.portrait = "true";

            imageElement.src = src;

            requestAnimationFrame(function () {
                resizePortrait();
            });
        }


        /* ========================================= */
        /* ORIZZONTALE */
        /* ========================================= */

        else {

            delete imageElement.dataset.portrait;

            imageElement.style.width = "auto";
            imageElement.style.height = "auto";

            imageElement.style.maxWidth = "100%";
            imageElement.style.maxHeight = "100%";

            imageElement.src = src;
        }
    };

    tempImage.src = src;
}


/* ================================================= */
/* FOTO PRECEDENTE */
/* ================================================= */

prevButton.addEventListener("click", function () {

    showImage(currentImage - 1);

});


/* ================================================= */
/* FOTO SUCCESSIVA */
/* ================================================= */

nextButton.addEventListener("click", function () {

    showImage(currentImage + 1);

});


/* ================================================= */
/* RESPONSIVE */
/* ================================================= */

window.addEventListener("resize", function () {

    resizePortrait();

});


/* ================================================= */
/* AVVIO */
/* ================================================= */

findReferenceImage();

showImage(0);


/* ================================================= */
/* SCROLL ORIZZONTALE DESKTOP */
/* UNA FOTO ALLA VOLTA */
/* ================================================= */

const galleryOverlay = document.querySelector(
    ".overlay-central.desktop-only"
);

let horizontalScrollLocked = false;


if (galleryOverlay) {

    galleryOverlay.addEventListener(
        "wheel",
        function (e) {

            /* ========================================= */
            /* SOLO DESKTOP */
            /* ========================================= */

            if (window.innerWidth < 769) {
                return;
            }


            /* ========================================= */
            /* SOLO SCROLL ORIZZONTALE */
            /* ========================================= */

            if (
                Math.abs(e.deltaX) <=
                Math.abs(e.deltaY)
            ) {
                return;
            }


            e.preventDefault();


            /* ========================================= */
            /* BLOCCA EVENTI RIPETUTI */
            /* ========================================= */

            if (horizontalScrollLocked) {
                return;
            }

            horizontalScrollLocked = true;


            /* ========================================= */
            /* CAMBIO FOTO */
            /* ========================================= */

            if (e.deltaX > 0) {

                // Destra → foto successiva
                showImage(currentImage + 1);

            } else {

                // Sinistra → foto precedente
                showImage(currentImage - 1);

            }


            /* ========================================= */
            /* SBLOCCA DOPO 600ms */
            /* ========================================= */

            setTimeout(function () {

                horizontalScrollLocked = false;

            }, 600);

        },
        { passive: false }
    );

}

/* ================================================= */
/* FRECCE TASTIERA DESKTOP */
/* ================================================= */

document.addEventListener("keydown", function (e) {

    // Solo desktop
    if (window.innerWidth < 769) {
        return;
    }

    // Freccia sinistra → foto precedente
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        showImage(currentImage - 1);
    }

    // Freccia destra → foto successiva
    if (e.key === "ArrowRight") {
        e.preventDefault();
        showImage(currentImage + 1);
    }

});