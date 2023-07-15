import * as wss from './wss.js';
import * as webRTChandler from './webrtchandler.js';
import * as ui from './ui.js';
let strangerCallType;
export const changeStrangerConnectionStatus = (status) => {
    console.log("emmiting to server change stranger connection status event");
  const data = {status: status};
  wss.changeStrangerConnectionStatus(data);

}

export const getStrangerSocketIdAndConnect = (callType)=>{
    strangerCallType = callType;
    wss.getStrangerSocketId();
}

export const connectWithStranger = (data) => {
    console.log("emmiting to server connect with stranger event");
    console.log(data);
    if(data.randomStrangerSocketId){
        webRTChandler.sendPreOffer(strangerCallType, data.randomStrangerSocketId);
    }else{
        console.log('no stranger found');
        ui.showNoStrangerAvailableDialog();
    }


    
}

