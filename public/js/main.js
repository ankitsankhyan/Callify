import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webrtchandler.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as recordingUtils from "./recordingUtils.js";

// initialization of socketIO connection
const socket = io("/");
wss.registerSocketEvents(socket);

webRTCHandler.getLocalPreview();

//register event listener for personal code copy button
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

// register event listeners for connection buttons

const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);

const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

personalCodeChatButton.addEventListener("click", () => {
  console.log("chat button clicked");

  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

personalCodeVideoButton.addEventListener("click", () => {
  console.log("video button clicked");

  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

// event listeners for mic buttons

const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  // this is done to enable the audio
  console.log(micButton, '++++++++++++++++++++++');
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  ui.updateMicButton(!micEnabled);
});

// event for video button
const cameraButton = document.getElementById("camera_button");

cameraButton.addEventListener("click", async() => {
  console.log("camera button clicked");

  const localStream = store.getState().localStream;
  
  var cameraEnabled = localStream.getVideoTracks()[0].enabled;
  

  localStream.getVideoTracks()[0].enabled =  !cameraEnabled;
 
  ui.updateCameraButton(!cameraEnabled);
});


const switchForScreenSharingButton = document.getElementById(
  "screen_sharing_button"
);
switchForScreenSharingButton.addEventListener("click", () => {
  const screenSharingActive = store.getState().screenSharingActive;
  // webRTC handles the screen sharing
  webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
});

// messenger

const newMessageInput = document.getElementById("new_message_input");
newMessageInput.addEventListener("keydown", (event) => {
  console.log("change occured");
  const key = event.key;

  if (key === "Enter") {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    ui.appendMessage(event.target.value, true);
    newMessageInput.value = "";
  }
});

const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", () => {
  const message = newMessageInput.value;
  webRTCHandler.sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  newMessageInput.value = "";
});





// recording

const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  console.log("start recording clicked");
  recordingUtils.startRecording();
  ui.showRecordingPanel();

});

const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", () => {
  console.log("stop recording clicked");
   recordingUtils.stopRecording();
    ui.resetRecordingButtons();
});

const pauseRecordingButton = document.getElementById("pause_recording_button");
pauseRecordingButton.addEventListener("click", () => {
  console.log("pause recording clicked");
  recordingUtils.pauseRecording();
  ui.switchRecordingButton(true);
});

const resumeRecordingButton = document.getElementById('resume_recording_button');
resumeRecordingButton.addEventListener('click', () => {
  console.log('resume recording clicked');
  recordingUtils.resumeRecording();
  ui.switchRecordingButton(false);
});


const hangUpVideoButton = document.getElementById('hang_up_button');
console.log(hangUpVideoButton, '++++++++++++++++++++++');
hangUpVideoButton.addEventListener('click', () => {
 
  webRTCHandler.handleHangUp();
  // webRTCHandler.closePeerConnectionAndResetState();
  webRTCHandler.closePeerConnectionAndResetState();
});

const hangUpChatButton = document.getElementById('finish_chat_call_button');
hangUpChatButton.addEventListener('click', () => {
 
  webRTCHandler.handleHangUp();
  webRTCHandler.closePeerConnectionAndResetState();
});
