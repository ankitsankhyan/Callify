import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails;
let peerConection;
let dataChannel;

const defaultConstraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      ui.showVideoButtons();
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
      store.setCallState(constants.callState.CALL_AVAILABLE);
    })
    .catch((err) => {
      console.log("error occured when trying to get an access to camera");
      console.log(err);
    });
};

const createPeerConnection = () => {
  peerConection = new RTCPeerConnection(configuration);
// this is datachannel
  dataChannel = peerConection.createDataChannel("chat");


  peerConection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log("peer connection is ready to receive data channel messages");
    };

    dataChannel.onmessage = (event) => {
      console.log("message came from data channel");
      const message = JSON.parse(event.data);
      console.log(message);
      ui.appendMessage(message);
    };
  };

  peerConection.onicecandidate = (event) => {
    console.log("geeting ice candidates from stun server");
    if (event.candidate) {
      // send our ice candidates to other peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  peerConection.onconnectionstatechange = (event) => {
    if (peerConection.connectionState === "connected") {
      console.log("succesfully connected with other peer");
    }
  };

  // receiving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // add our stream to peer connection

  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;

    for (const track of localStream.getTracks()) {
      peerConection.addTrack(track, localStream);
    }
  }
};

// data channel handling
export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

export const sendPreOffer = (callType, calleePersonalCode) => {
  store.setCallState(constants.callState.CALL_UNAVAILABLE);
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode,
    };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;
  // note it is the data of most recent user who attempted to connect to you
 
   console.log(store.getState().callState, 'inside handle PreOFFer ++++++++++++++++++++++++++++++++++++++++++');
  if(!checkCallPossibility()) {
    console.log("call not possible");
    return sendPreOfferAnswer(constants.preOfferAnswer.CALL_UNAVAILABLE, callerSocketId);
  }else{
    store.setCallState(constants.callState.CALL_UNAVAILABLE);
  }
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  console.log("call accepted");
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  console.log("call rejected");
  sendPreOfferAnswer();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const callingDialogRejectCallHandler = () => {
 
    const data = {
      connectedUserSocketId: connectedUserDetails.socketId,
      callType: connectedUserDetails.callType
    }

    closePeerConnectionAndResetState();
    wss.sendUserHangedUp(data);
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {

  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };
  if(callerSocketId !== null){
    data.callerSocketId = callerSocketId;
  }
  ui.removeAllDialogs();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;
  console.log(data, 'inside handlePreOfferAnswer ++++++++++++++++++++++++++++++++++++++++++');
  ui.removeAllDialogs();

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
   setIncomingCallsAvailable();
    ui.showInfoDialog(preOfferAnswer);
    // show dialog that callee has not been found
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    ui.showInfoDialog(preOfferAnswer);
    setIncomingCallsAvailable();
    // show dialog that callee is not able to connect
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    ui.showInfoDialog(preOfferAnswer);
    setIncomingCallsAvailable();
    // show dialog that call is rejected by the callee
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    ui.showCallElements(connectedUserDetails.callType);
  
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConection.createOffer();
  await peerConection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  await peerConection.setRemoteDescription(data.offer);
  const answer = await peerConection.createAnswer();
  await peerConection.setLocalDescription(answer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  console.log("handling webRTC Answer");
  await peerConection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  console.log("handling incoming webRTC candidates");
  try {
    await peerConection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error(
      "error occured when trying to add received ice candidate",
      err
    );
  }
};

let screenSharingStream;

export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = peerConection.getSenders();

    const sender = senders.find((sender) => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });

    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    // stop screen sharing stream

    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!screenSharingActive);

    ui.updateLocalVideo(localStream);
  } else {
    console.log("switching for screen sharing");
    try {
      // getting access to screen Display Media
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);

      // replace track which sender is sending

      const senders = peerConection.getSenders();
      

      const sender = senders.find((sender) => {
        return (
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
        );
      });

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
  // we have shown that screen sharing is on
      store.setScreenSharingActive(!screenSharingActive);

      ui.updateLocalVideo(screenSharingStream);
    } catch (err) {
      console.error(
        "error occured when trying to get screen sharing stream",
        err
      );
    }
  }
};





export const handleHangUp = () => {
  console.log("finishing the call");
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  }
  wss.sendUserHangedUp(data);

}

export const handleConnectedUserHangedUp = ()=>{
       console.log("handling connected user hanged up");
        closePeerConnectionAndResetState();
       
}

export const closePeerConnectionAndResetState = ()=>{
  
  if(peerConection){
    peerConection.close();
    peerConection = null;
  }

  if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER){
      console.log('running', store.getState().localStream);
      // enabling camera and microphone again
    //  store.getState().localStream.getVidoTracks()[0].enabled = true;
    //   store.getState().localStream.getAudioTracks()[0].enabled = true;
      ui.updateUIAfterHangUp(connectedUserDetails.callType);
      connectedUserDetails = null;

  }

  if(connectedUserDetails.callType === constants.callType.CHAT_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.CHAT_STRANGER){
      ui.updateUIAfterHangUp(connectedUserDetails.callType);
      connectedUserDetails = null;
  }

}

const checkCallPossibility = (calltype)=>{
  const callState = store.getState().callState;
   if(callState === constants.callState.CALL_UNAVAILABLE){
       return false;
   }

   if((calltype === constants.callType.VIDEO_PERSONAL_CODE || calltype === constants.callType.VIDEO_STRANGER) && callState === constants.callState.CALL_AVAILABLE_ONLY_CHAT){
       return false;
   }

   return true;
}

const setIncomingCallsAvailable = ()=>{
 const localStream = store.getState().localStream;
  if(localStream){
    store.setCallState(constants.callState.CALL_AVAILABLE);
  }else{
    store.setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT);
  }
}