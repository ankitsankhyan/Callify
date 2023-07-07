import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';
let connectedUserDetails;
let peerConnection;
// contains the details of the user to whom the request is sent and id is received from input field of the client
const defaultConstrains = {
       audio:true,
         video:true
}

const configuration = {
         iceServers: [
            {
               urls: 'stun:stun.l.google.com:13902'
            }
         ]
}
export const getLocalPreview = () => {
       navigator.mediaDevices.getUserMedia(defaultConstrains)
         .then((stream)=>{ 
               ui.updateLocalVideo(stream);
               store.setLocalStream(stream);
          }).catch((err)=>{
               console.log('error occured when trying to get an access to get local stream');
               console.log(err);
            });
         }

const createPeerConnection = ()=>{
   peerConnection = new RTCPeerConnection(configuration);
   peerConnection.onicecandidate = (event)=>{
      console.log('getting ice candidates from stun server');
      if(event.candidate){
         // send our ice candidate to other peer
      }}

      peerConnection.onconnectionstatechange = (event)=>{
         if(peerConnection.connectionState === 'connected'){
            console.log('succesfully connected with other peer');

         }
      }

      // receiving tracks 
      const remoteStream = new MediaStream();
      store.setRemoteStream(remoteStream);
      ui.updateRemoteVideo(remoteStream);
      peerConnection.ontrack = (event)=>{
         console.log('new track added');
         remoteStream.addTrack(event.track);
      }


      // add our tracks to peer connection
      if(connectedUserDetails.calltype === constants.callType.VIDEO_PERSONAL_CODE){
         const localStream = store.getState().localStream;
         for(const track of localStream.getTracks()){
            peerConnection.addTrack(track, localStream);
         }
      }
}

export const sendPreOffer = (calltype, calleePersonalCode)=>{
     connectedUserDetails = {
          calltype,
          socketId:calleePersonalCode
   }
   
   

   if(calltype === constants.callType.CHAT_PERSONAL_CODE || calltype === constants.callType.VIDEO_PERSONAL_CODE){
     const data = {
          calltype,
          calleePersonalCode
     }
  
      ui.showCallingDialog(callingDialogRejectCallHandler);
      wss.sendPreOffer(data);
   }
 
}
// handle when request comes
export const handlePreOffer = (data) => {
    
   const {calltype, callerSocketId} = data;
   
  connectedUserDetails = {
    socketId: callerSocketId,
    calltype,
  };

   if(calltype === constants.callType.CHAT_PERSONAL_CODE || calltype === constants.callType.VIDEO_PERSONAL_CODE){
      // show modal
      ui.showIncomingCallDialog(calltype, acceptCallHandler, rejectCallHandler);
   }
    
   }

// handle case when call is accepted i.e sends a request to the callee
const acceptCallHandler = () => {
     console.log('call accepted');
   //   if user is accepting the call then we need to create a peer connection
     createPeerConnection();
     sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
     // hide modal
     // sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
     // make rtc connection
     }
// handle case when call is rejected i.e sends a request to the callee
const rejectCallHandler = () => {
     console.log('call rejected');
     sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
     // hide modal
     // sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
     // make rtc connection
     }

const callingDialogRejectCallHandler = () => {
    
  console.log('rejecting the call');


}

// this is function takes input of the type of action of the user and sends to callee via websocket server
const sendPreOfferAnswer = (preOfferAnswer) => {
    
   const data = {
     callerSocketId: connectedUserDetails.socketId,
     preOfferAnswer:preOfferAnswer
   }
   ui.removeAllDialogs();
   if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED){
      ui.showCallElements(connectedUserDetails.calltype);
   }
   wss.sendPreOfferAnswer(data);
}

// receive the answer from the callee and handle it and show in ui
export const handlePreOfferAnswer = (data) => {
   const {preOfferAnswer} = data;
   ui.removeAllDialogs();
   console.log('pre offer answer came');
   if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
      ui.showInfoDialog(preOfferAnswer);
   }

   if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
      ui.showInfoDialog(preOfferAnswer);
   }

   if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
      ui.showInfoDialog(preOfferAnswer);
   }
   if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED){
     ui.showCallElements(connectedUserDetails.calltype);
   //   if we got message that connection is established then it means connection is established
     createPeerConnection();
     sendWebRTCOffer();
   }


 }

 const sendWebRTCOffer = async () => {
    // sharing SDP information with other peer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

   //  here we are sending data to the socket.emit('webRTCSignaling', data) in wss.js
    wss.sendDataUsingWebRTCSignaling({
         connectedUserSocketId: connectedUserDetails.socketId,
         type: constants.webRTCSignaling.OFFER,
         offer: offer
      })

 }

 export const handleWebRTCOffer = async (data) => {
   
   await peerConnection.setRemoteDescription(data.offer);
   const answer = await peerConnection.createAnswer();
   await peerConnection.setLocalDescription(answer);
   wss.sendDataUsingWebRTCSignaling({
      connectedUserSocketId: connectedUserDetails.socketId,
      type:constants.webRTCSignaling.ANSWER,
      answer:answer
   });



 }

 export const handleWebRTCAnswer = async (data) => {
     console.log(data, 'inside handleWebRTCAnswer');
   
   await peerConnection.setRemoteDescription(data.answer);
 }