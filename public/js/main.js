import * as store from './store.js'
import * as ui from './ui.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webrtchandler.js'
import * as constants from './constants.js'
// we are passing the url of the server to the io function 
// since it is same directory then we can use / only

const socket = io('localhost:3000');

wss.registerSocketEvents(socket);
webRTCHandler.getLocalPreview();
const personalCodeCopyButton = document.getElementById('personal_code_copy_button');
console.log(personalCodeCopyButton);
personalCodeCopyButton.addEventListener('click', () => {
      const personalCodeParagraph = document.getElementById('personal_code_paragraph');
     
      const personalCode = personalCodeParagraph.innerHTML;
      navigator.clipboard.writeText(personalCode);
   } )

// register event listner for the connection buttons

const personalCodeChatButton = document.getElementById('personal_code_chat_button');

const personalCodeVideoButton = document.getElementById('personal_code_video_button');

const calleePersonalCode = document.getElementById('personal_code_input');


personalCodeChatButton.addEventListener('click', () => {
  console.log('clicked chat button');
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  
  webRTCHandler.sendPreOffer(callType, calleePersonalCode.value);
} )

personalCodeVideoButton.addEventListener('click', () => {
   
   const callType = constants.callType.VIDEO_PERSONAL_CODE;
   webRTCHandler.sendPreOffer(callType, calleePersonalCode.value);
   }
)

