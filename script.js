let VideoPlayer=document.querySelector("video"); // to add the src of media
let mediaRecorder; // used to add events of start and stop
let RecordedMedia; // final media
let recordbtn=document.querySelector(".record-video");
let capturebtn=document.querySelector(".capture-photo");
let myconstraints={video:true};
let RecordingState=false;
(async function(){
    let mediaStream=await navigator.mediaDevices.getUserMedia(myconstraints); // gets user media
    VideoPlayer.srcObject=mediaStream; // adds user media to video tag
    mediaRecorder=new MediaRecorder(mediaStream); // API
    console.log(mediaRecorder);
    mediaRecorder.onstop=function(e){ // overrides MediaRecorder ka object
        console.log("inside stop");
        console.log(RecordedMedia);
        downloadVideo();
    }
    mediaRecorder.onstart=function(e){
        console.log("start");
    }
    mediaRecorder.ondataavailable=function(e){
        console.log("ondatavailable");
        RecordedMedia=e.data;
    }

    recordbtn.addEventListener("click",function(e){
        if(!RecordingState){
            mediaRecorder.start();
            recordbtn.innerHTML="recording";
        }else{
            mediaRecorder.stop();
            recordbtn.innerHTML="record";
        }
        RecordingState=!RecordingState;
    })
    capturebtn.addEventListener("click",captureimage)

})()
function downloadVideo(){
    let vidurl=URL.createObjectURL(RecordedMedia); //converts blob object to URL
    console.log("downloading");
    console.log(vidurl);
    let a=document.createElement("a");      // can only download on a tags therefore create an a tag
    a.href=vidurl;          // add url to its href
    a.download="video.mp4"; // set name of file

    a.click();      // should get clicked to download
  //  a.remove();     // remove after download => it will automatically remove after function terminates
}
function captureimage(e){
    //create a canvas
    let canvas=document.createElement("canvas");
    //set height and width of canvas same as that of our video
    canvas.height=VideoPlayer.videoHeight;
    canvas.width=VideoPlayer.videoWidth;
    //draw image on canvas
    let ctx=canvas.getContext("2d");
    ctx.drawImage(VideoPlayer,0,0);

    //download image using dynamic url
    let imageURL=canvas.toDataURL("image/jpg"); //=> converts canvas to URL

    let atag=document.createElement("a");
    atag.href=imageURL;
    atag.download="image.jpg";

    atag.click();
}