let VideoPlayer = document.querySelector("video"); // to add the src of media
let mediaRecorder; // used to add events of start and stop
let RecordedMedia; // final media
let recordbtn = document.querySelector(".record-video");
let capturebtn = document.querySelector(".capture-photo");
let myconstraints = { video: true };
let RecordingState = false;
(async function () {
    let mediaStream = await navigator.mediaDevices.getUserMedia(myconstraints); // gets user media
    VideoPlayer.srcObject = mediaStream; // adds user media to video tag
    mediaRecorder = new MediaRecorder(mediaStream); // API
    console.log(mediaRecorder);
    mediaRecorder.onstop = function (e) { // overrides MediaRecorder ka object
        console.log("inside stop");
        console.log(RecordedMedia);
        downloadVideo();
    }
    mediaRecorder.onstart = function (e) {
        console.log("start");
    }
    mediaRecorder.ondataavailable = function (e) {
        console.log("ondatavailable");
        RecordedMedia = e.data;
    }

    recordbtn.addEventListener("click", function (e) {
        if (!RecordingState) {
            mediaRecorder.start();
            document.querySelector(".record-video-control").classList.add("record-animation");
        } else {
            mediaRecorder.stop();
            document.querySelector(".record-video-control").classList.remove("record-animation");
        }
        RecordingState = !RecordingState;
    })
    capturebtn.addEventListener("click", captureimage)

})();
function downloadVideo() {
    let blob = new Blob([RecordedMedia], { type: "video/mp4" });

    let sv = setInterval(function () {
        if (db) {
            clearInterval(sv);
            SaveMedia(blob, "video");
        }
    }, 100);

}
function captureimage(e) {
    document.querySelector(".capture-photo-control").classList.add("capture-pic");

    // add to indexDb
    setTimeout(() => {
        document.querySelector(".capture-photo-control").classList.remove("capture-pic");
    }, 1000);

    //create a canvas
    let canvas = document.createElement("canvas");
    //set height and width of canvas same as that of our video
    canvas.height = VideoPlayer.videoHeight;
    canvas.width = VideoPlayer.videoWidth;
    //draw image on canvas
    let ctx = canvas.getContext("2d");
    // ctx.filter = 'contrast(1.4) sepia(1)';
    // ctx.filter = 'grayscale(1)';
    // ctx.filter='blur(1px) hue-rotate(50deg) ';
    // ctx.filter='drop-shadow(16px 16px 20px) blur(0px) grayscale(0.5) sepia(0.5) yellow(2px) invert(25%)';
    // ctx.filter= "contrast(1.2) saturate(1.35)";

    // if current zoom is changed then scale the canvas
    if (curzoom != 1) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(curzoom, curzoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    ctx.drawImage(VideoPlayer, 0, 0);

    let imageURL = canvas.toDataURL("image/jpg"); //=> converts canvas to URL

    let sv = setInterval(function () {
        if (db) {
            clearInterval(sv);
            SaveMedia(imageURL, "image");
        }
    }, 100);

}
// ============ zoom functionality ================
//zoom in out
let zooomin = document.querySelector(".scaleup");
let zooomout = document.querySelector(".scaledown");
let invert = document.querySelector(".invert");
let minzoom = 0.8;
let maxzoom = 2;
let curzoom = 1;
zooomin.addEventListener("click", function (e) {
    if (zooomin.getAttribute("inverted") == "true") {
    }
    if (curzoom < maxzoom && curzoom >= 0) { // " >=0 "  to handle the inverted case
        curzoom += 0.1;
        VideoPlayer.style.transform = `scale(${curzoom})`;
    }
})
zooomout.addEventListener("click", function (e) {
    if (curzoom > minzoom && curzoom >= 0) {
        curzoom -= 0.1;
        VideoPlayer.style.transform = `scale(${curzoom})`;
    }
})
invert.addEventListener("click", function (e) {
    curzoom = -(curzoom);
    VideoPlayer.style.transform = `scale(${curzoom})`;

})
document.querySelector(".gallery").addEventListener("click", (e) => {
    window.location.assign("album.html");
})