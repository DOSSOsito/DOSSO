const galleryFolder = "img/galleria/origini/";

const galleryImages = [
"GL01.webp",
"GL02.webp",
"GL03.webp",
"GL04.webp",
"GL05.webp",
"GL06.webp",
"GL07.webp",
"GL08.webp",
"GL09.webp",
"GL10.webp",
"GL11.webp",
"GL12.webp",
"GL13.webp",
"GL14.webp",
"GL15.webp",
"GL16.webp",
];

let currentImage = 0;

const imageElement = document.querySelector(".gallery-image");
const prevButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");
const imageArea = document.querySelector(".gallery-image-area");

let referenceRatio = null;

/* ================================================= /
/ TROVA LA PRIMA FOTO ORIZZONTALE /
/ ================================================= */

function findReferenceImage() {

for (let i = 0; i < galleryImages.length; i++) {

    const testImage = new Image();

    testImage.onload = function () {

        /*
         * Se è orizzontale o quadrata,
         * la usiamo come riferimento.
         */

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

/* ================================================= /
/ CALCOLA DIMENSIONE DELLE VERTICALI /
/ ================================================= */

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


/*
 * Calcoliamo l'altezza che avrebbe
 * la foto orizzontale di riferimento.
 */

let referenceHeight =
    availableWidth / referenceRatio;


/*
 * Non permettiamo alla foto di superare
 * l'altezza disponibile.
 */

referenceHeight =
    Math.min(
        referenceHeight,
        availableHeight
    );


/*
 * La verticale avrà esattamente
 * questa altezza.
 */

imageElement.style.width = "auto";

imageElement.style.height =
    referenceHeight + "px";

imageElement.style.maxWidth = "100%";

imageElement.style.maxHeight = "none";


}

/* ================================================= /
/ MOSTRA IMMAGINE /
/ ================================================= */

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

        /*
         * Reset completo.
         */

        imageElement.style.width = "auto";
        imageElement.style.height = "auto";

        imageElement.style.maxWidth = "100%";
        imageElement.style.maxHeight = "100%";

        imageElement.src = src;
    }
};

tempImage.src = src;


}

/* ================================================= /
/ FOTO PRECEDENTE /
/ ================================================= */

prevButton.addEventListener("click", function () {
showImage(currentImage - 1);
});

/* ================================================= /
/ FOTO SUCCESSIVA /
/ ================================================= */

nextButton.addEventListener("click", function () {
showImage(currentImage + 1);
});

/* ================================================= /
/ RESPONSIVE /
/ ================================================= */

window.addEventListener("resize", function () {

/*
 * Il rapporto della foto di riferimento
 * non cambia, ma la larghezza disponibile sì.
 *
 * Quindi ricalcoliamo la dimensione.
 */

resizePortrait();


});

/* ================================================= /
/ AVVIO /
/ ================================================= */

findReferenceImage();

showImage(0);

/* ================================================= /
/ SCROLL ORIZZONTALE DESKTOP - UNA FOTO ALLA VOLTA /
/ ================================================= */

const galleryOverlay = document.querySelector(
".overlay-central.desktop-only"
);

let horizontalScrollLocked = false;

galleryOverlay.addEventListener("wheel", function (e) {

// Solo desktop
if (window.innerWidth < 769) {
    return;
}

// Considera solo lo scroll orizzontale
if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
    return;
}

e.preventDefault();

// Blocca gli eventi successivi dello stesso gesto
if (horizontalScrollLocked) {
    return;
}

horizontalScrollLocked = true;

if (e.deltaX > 0) {
    // Scroll → destra = foto successiva
    showImage(currentImage + 1);
} else {
    // Scroll → sinistra = foto precedente
    showImage(currentImage - 1);
}

// Dopo questo tempo puoi passare alla foto successiva
setTimeout(() => {
    horizontalScrollLocked = false;
}, 600);


}, { passive: false });

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