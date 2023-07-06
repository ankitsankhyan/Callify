import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
export const sendPreOffer = (calltype, calleePersonalCode)=>{
   const data = {
        calltype,
        calleePersonalCode
   }


    wss.sendPreOffer(data);
}

export const handlePreOffer = (data) => {
   const {calltype, callerSocketId} = data;
   
   
   if(calltype === constants.callType.CHAT_PERSONAL_CODE || calltype === constants.callType.VIDEO_PERSONAL_CODE){
      // show modal
      ui.showIncomingCallDialog(calltype, acceptCallHandler, rejectCallHandler);
   }
    
   }


const acceptCallHandler = () => {
     console.log('call accepted');
     // hide modal
     // sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
     // make rtc connection
     }
const rejectCallHandler = () => {
     console.log('call rejected');
     // hide modal
     // sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
     // make rtc connection
     }