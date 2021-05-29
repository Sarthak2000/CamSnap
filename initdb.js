let db;

let dbReq = indexedDB.open("Gallery"); // gets me the db request
dbReq.onsuccess = function (e) {
    db = e.target.result;
}

dbReq.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("Media", { keyPath: "mid" });
}


function SaveMedia(MediaSrc, MediaType) {
    let txn = db.transaction("Media", "readwrite"); //=> "Media" is table name!

    // get the media transaction object onto which values wd be added
    let mediaStore = txn.objectStore("Media");

    let MediaFile = {
        mid: Date.now(),
        MediaSrc,
        MediaType
    }
    mediaStore.add(MediaFile);
}