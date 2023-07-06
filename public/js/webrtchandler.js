import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';
let connectedUserDetails;

// whom i am calling callee
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


const acceptCallHandler = () => {
     console.log('call accepted');
   
     sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
     // hide modal
     // sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
     // make rtc connection
     }
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

const sendPreOfferAnswer = (preOfferAnswer) => {
    
   const data = {
     callerSocketId: connectedUserDetails.socketId,
     preOfferAnswer:preOfferAnswer
   }
   ui.removeAllDialogs();
   wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
   const {preOfferAnswer} = data;
   console.log(data);
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
   ui.showInfoDialog(connectedUserDetails.calltype);      
   }


 }