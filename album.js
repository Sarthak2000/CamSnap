
// display media on load

function ShowMedia() {
    // Create a transaction=>  open a readonly transaction
    let txn = db.transaction("Media", "readonly");

    // get the media transaction object onto which values wd be added
    let mediaStore = txn.objectStore("Media");

    let cursorObject = mediaStore.openCursor(); // get cursor pointer object

    cursorObject.onsuccess = function (e) {
        let cursor = cursorObject.result;

        if (cursor) {
            appendToUI(cursor.value);
            cursor.continue(); // moves to next element in cursorobject
        }
    }


}
let iv = setInterval(() => {
    if (db) {
        ShowMedia();
        clearInterval(iv);
    }
}, 100);

function createtemplate() {
    let div = document.createElement("div");
    div.classList.add("album");
    div.innerHTML = `
        <div class="media"></div>
        <div class="function">
        <div class="download fx"><i class="fas fa-download"></i></div>
        <div class="delete fx"><i class="fas fa-user-slash"></i></div>
        </div>`;
    return div;
}
function appendToUI(mediaobject) {
    // MediaSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoA
    // MediaType: "image"
    // mid: 1622305032793
    // __proto__: Object
    // console.log(mediaobject);

    let div = createtemplate();
    if (mediaobject.MediaType == "image") {

        let img = document.createElement("img");
        img.src = mediaobject.MediaSrc;

        div.setAttribute("id", mediaobject.mid);
        div.querySelector(".media").append(img);
        document.querySelector(".album-items").append(div);
    } else {
        let blob = new Blob([mediaobject.MediaSrc], { type: "video/mp4" });
        let videoUrl = URL.createObjectURL(blob);
        let video = document.createElement("video");
        video.src = videoUrl;

        div.setAttribute("id", mediaobject.mid);
        div.querySelector(".media").append(video);
        document.querySelector(".album-items").append(div);

        video.autoplay = "true";
        video.loop = "true";
        video.controls = "true";
    }
    div.querySelector(".download").addEventListener("click", (e) => {
        if (mediaobject.MediaType == "image") {
            let atag = document.createElement("a");
            atag.href = mediaobject.MediaSrc;
            atag.download = "image.jpg";
            atag.click();
            atag.remove();
        } else {
            let a = document.createElement("a");      // can only download on a tags therefore create an a tag
            a.href = mediaobject.MediaSrc;          // add url to its href
            a.download = "video.mp4"; // set name of file

            a.click();      // should get clicked to download
            a.remove();     // remove after download => it will automatically remove after function terminates
        }
    })
    div.querySelector(".delete").addEventListener("click", (e) => {

        // delete from UI
        div.remove();
        // document.querySelector(`div[mid="${mediaobject.mid}"]`).remove();

        // delete from DB
        let mid = mediaobject.mid;
        let txn = db.transaction("Media", "readwrite");
        let mediaStore = txn.objectStore("Media");
        mediaStore.delete(mid); // delete key

    })
}
