

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