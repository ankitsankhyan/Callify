import * as store from './store.js';
let mediaRecorder;
var recordedChunks = [];
const vp9Codec = 'video/webm; codecs=vp=9';
const vp9Option = { mimeType: vp9Codec };


export const startRecording = () => {
    console.log('start recording');
    const remoteStream = store.getState().remoteStream;
   
    if(MediaRecorder.isTypeSupported(vp9Codec)){
        mediaRecorder = new MediaRecorder(remoteStream, vp9Option);

    }else{
        mediaRecorder = new MediaRecorder(remoteStream);
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

}

const handleDataAvailable = (e) => {
    if(e.data.size > 0){
        recordedChunks.push(e.data);
        downloadRecordedVideo();
    }
}

export const pauseRecording = () => {
    mediaRecorder.pause();
}

export const resumeRecording = () => {
    mediaRecorder.resume();
}
const downloadRecordedVideo = async() => {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });


    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webcam';
    a.click();
    // this removes the url given to that recording
   
    recordedChunks = [];
}

export const stopRecording = () => {
    console.log('stop recording');
    mediaRecorder.stop();
    downloadRecordedVideo();
}