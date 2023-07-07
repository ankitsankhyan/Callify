import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';
let connectedUserDetails;
// contains the details of the user to whom the request is sent and id is received from input field of the client
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
   }


 }