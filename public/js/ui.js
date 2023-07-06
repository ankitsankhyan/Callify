import * as constants from './constants.js';
import * as elements from './elements.js';
export const updatePersonalCode = (personalCode)=>{
    const personalCodeParagraph = document.getElementById('personal_code_paragraph');
   
    personalCodeParagraph.innerHTML = personalCode;
}

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    
    const callTypeInfo = (callType === constants.callType.CHAT_PERSONAL_CODE) ? 'Chat' : 'Video';

    console.log('call type info', callTypeInfo);
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


const showChatCallElements = () => {
    const finishConnectionChatButtonContainer = document.getElementById('finish_chat_button_container');
    showElement(finishConnectionChatButtonContainer);
    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    // block panel
    disableDashboard();
}
const showVideoCallElements = () => {
    const callButtons = document.getElementById('call_buttons');
    // show call elements
    showElement(callButtons);
    const remoteVideo = document.getElementById('remote_video');
    showElement(remoteVideo);

    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    // block panel
    disableDashboard();
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

