import * as constants from './constants.js';
import * as elements from './elements.js';
import { startRecording } from './recordingUtils.js';
export const updatePersonalCode = (personalCode)=>{
    const personalCodeParagraph = document.getElementById('personal_code_paragraph');
   console.log(personalCodeParagraph);
    personalCodeParagraph.innerHTML = personalCode;
}

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById('local_video');
  
  localVideo.srcObject = stream;
 
  localVideo.addEventListener('loadedmetadata', ()=>{
        localVideo.play();
    });
}

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    
    const callTypeInfo = (callType === constants.callType.CHAT_PERSONAL_CODE) ? 'Chat' : 'Video';

     const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler);

     

     const dialog = document.getElementById('dialog');
     dialog.querySelectorAll('*').forEach(n => n.remove());
     dialog.appendChild(incomingCallDialog);
}

export const showCallingDialog = (rejectCallHandler) => {
    const callingDialog = elements.getCallingDialog(rejectCallHandler);

    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach(n => n.remove());
    dialog.appendChild(callingDialog);
}

export const removeAllDialogs = ()=>{
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach(n => n.remove());
}

export const showInfoDialog = (preOfferAnswer) => {
    let infoDialog = null;
    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        infoDialog = elements.getInfoDialog('Call rejected', 'Callee rejected your call');
    }
    if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
        infoDialog = elements.getInfoDialog('Callee not found', 'Please check personal code');
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
        infoDialog = elements.getInfoDialog('Callee is busy', 'Please try again later');
    }

    if(infoDialog){
        const dialog = document.getElementById('dialog');
        dialog.appendChild(infoDialog);
        setTimeout(()=>{
            removeAllDialogs();
        }, [3000]);

    }
   
}
export const showCallElements = (callType) => {
    if(callType === constants.callType.CHAT_PERSONAL_CODE){
        showChatCallElements();
    }
    if(callType === constants.callType.VIDEO_PERSONAL_CODE){
        showVideoCallElements();
    }
}

export const hideCallElements = ()=>{

}

// show chat elements in the ui
const showChatCallElements = () => {
    const finishConnectionChatButtonContainer = document.getElementById('finish_chat_button_container');
    showElement(finishConnectionChatButtonContainer);
    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    // block panel
    disableDashboard();
}

const hideChatCallElements = ()=>{
    const finishConnectionChatButtonContainer = document.getElementById('finish_chat_button_container');
    hideElement(finishConnectionChatButtonContainer);
    const newMessageInput = document.getElementById('new_message');
    hideElement(newMessageInput);

    enableDashboard();
}

// show video elements in the ui
const showVideoCallElements = () => {
    const callButtons = document.getElementById('call_buttons');
    // show call elements
    showElement(callButtons);
    const placeholder = document.getElementById('video_placeholder');
    hideElement(placeholder);
    const remoteVideo = document.getElementById('remote_video');
    showElement(remoteVideo);

    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    clearMessenger();
    // block panel

    disableDashboard();
}

const hideVideoCallElements = () => {
    const callButtons = document.getElementById('call_buttons');
    // show call elements
    hideElement(callButtons);
    const placeholder = document.getElementById('video_placeholder');
    showElement(placeholder);
    const remoteVideo = document.getElementById('remote_video');
    hideElement(remoteVideo);

    const newMessageInput = document.getElementById('new_message');
    hideElement(newMessageInput);
    // block panel
    enableDashboard();
    clearMessenger();
}
//   ui call button
export const appendMessage = (message, right = false) => {
    const messagesContainer = document.getElementById('messages_container');
    const messageElement = right ? elements.getRightMessage(message) : elements.getLeftMessage(message);
    messagesContainer.appendChild(messageElement);

}

export const clearMessenger = () => {
    const messagesContainer = document.getElementById('messages_container');
    messagesContainer.querySelectorAll("*").forEach((n)=> n.remove());

}
// source of images
const micOnImgSrc = '../utils/images/mic.png';
const micOffImgSrc = '../utils/images/micOff.png';


export const updateMicButton = (micActive) => {
  const micButtonImage = document.getElementById("mic_button_image");
    micButtonImage.src = micActive ? micOnImgSrc : micOffImgSrc;


}

// camera images
const cameraOffImgSrc = '../utils/images/cameraOff.png';
const cameraOnImgSrc = '../utils/images/camera.png';

// update images
export const updateCameraButton = (cameraActive) => {
    const cameraButtonImage = document.getElementById("camera_button_image");
    console.log(cameraActive, 'camera active');
    cameraButtonImage.src = cameraActive ? cameraOnImgSrc : cameraOffImgSrc;
}
// recording buttons
export const showRecordingPanel = () => {
    const recordingButtons = document.getElementById('video_recording_buttons');
    showElement(recordingButtons);
    const startRecordingButton = document.getElementById('start_recording_button');
    console.log(startRecordingButton, recordingButtons);
    hideElement(startRecordingButton);
}

export const resetRecordingButtons = () => {
    const startRecordingButton = document.getElementById('start_recording_button');
    
    const recordingButtons = document.getElementById('video_recording_buttons');
    console.log(startRecording, recordingButtons);
    showElement(startRecordingButton);
    hideElement(recordingButtons);

}

export const switchRecordingButton = (switchForResumeButton)=>{
    const resumeButton = document.getElementById('resume_recording_button');
    const pauseButton = document.getElementById('pause_recording_button');

    if(switchForResumeButton){
        hideElement(pauseButton);
        showElement(resumeButton);
    }else{
        hideElement(resumeButton);
        showElement(pauseButton);
    }
}
// ui after hanged up
export const updateUIAfterHangUp = (callType) => {
    console.log('update ui after hang up');
  enableDashboard();
  if(callType === constants.callType.CHAT_PERSONAL_CODE ||
     callType === constants.callType.CHAT_STRANGER){
         hideChatCallElements();

    }else{
        // const chatCallButtons = document.getElementById('finish_chat_button_container');
        // hideElement(chatCallButtons);
        hideVideoCallElements();
    }

    // const newMessageInput = document.getElementById('new_message');
    clearMessenger();
    // hideElement(newMessageInput);
    // updateMicButton(false);
    // updateCameraButton(false);

    // // hide remote video and show placeholder
    // const placeholder = document.getElementById('video_placeholder');
    // showElement(placeholder);
    // const remoteVideo = document.getElementById('remote_video');
    // hideElement(remoteVideo);

    // removeAllDialogs();


}

// ui helper functions
const enableDashboard = () => {
   const dashboardBlocker = document.getElementById('dashboard_blur');
    if(!dashboardBlocker.classList.contains('display_none')){
        dashboardBlocker.classList.add('display_none');
    }

}

const disableDashboard = () => {
    const dashboardBlocker = document.getElementById('dashboard_blur');
    if(dashboardBlocker.classList.contains('display_none')){
        dashboardBlocker.classList.remove('display_none');
    }
}

const hideElement = (element)=>{
    if(!element.classList.contains('display_none')){
        element.classList.add('display_none');
    }
}

const showElement = (element)=>{
    if(element.classList.contains('display_none')){
        element.classList.remove('display_none');
    }
}

export const updateRemoteVideo = (stream) => {
    const remoteVideo = document.getElementById("remote_video");
    remoteVideo.srcObject = stream;
  };



