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