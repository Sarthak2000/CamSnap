let db;

let dbReq = indexedDB.open("Gallery"); // gets me the db request
dbReq.onsuccess = function (e) {
    db = e.target.result;
}

dbReq.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("Media", { keyPath: "mid" });
}
