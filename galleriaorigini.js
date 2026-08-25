const galleryImages = [
    "GL01.JPG",
    "GL02.JPG",
    "GL03.JPG",
    "GL04.JPG",
    "GL05.JPG",
    "GL06.JPG",
    "GL07.JPG",
    "GL08.JPG",
    "GL09.JPG",
    "GL10.JPG",
    "GL11.JPG",
    "GL12.JPG",
    "GL13.JPG",
    "GL14.JPG",
    "GL15.JPG",
    "GL16.JPG",
];

let currentImage = 0;

const imageElement = document.querySelector(".gallery-image");
const prevButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");

function showImage(index) {

    if (index < 0) {
        index = galleryImages.length - 1;
    }

    if (index >= galleryImages.length) {
        index = 0;
    }

    currentImage = index;

    imageElement.src = "img/galleria/" + galleryImages[currentImage];
}

prevButton.addEventListener("click", function () {
    showImage(currentImage - 1);
});

nextButton.addEventListener("click", function () {
    showImage(currentImage + 1);
});