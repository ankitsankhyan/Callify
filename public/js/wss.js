import * as store from './store.js';
import * as ui from './ui.js';
import * as WebRTCHandler from './webrtchandler.js';
import * as constants from './constants.js';
let socketIO = null;
 
export const registerSocketEvents = (socket) => {
    socket.on('connect', () => {
       socketIO = socket;
        store.setSocketId(socket.id);
        console.log('connected', socket.id);
        ui.updatePersonalCode(socket.id);
     })

     socket.on('pre-offer', (data) => {
        console.log('pre-offer-came');
        console.log(data);
       WebRTCHandler.handlePreOffer(data);
        })

    socket.on('pre-offer-answer', (data) => {
        console.log('pre-offer-answer-came');
        WebRTCHandler.handlePreOfferAnswer(data);
       
    })
// we are receiving webRTC-signaling

    socket.on('webRTC-signaling', (data) => {
        console.log(data, 'inside webRTC signaling')
        switch(data.type){
         case constants.webRTCSignaling.OFFER:
            WebRTCHandler.handleWebRTCOffer(data);
            break;
         case constants.webRTCSignaling.ANSWER:
            console.log(data);
            WebRTCHandler.handleWebRTCAnswer(data);
        default:
            return
        }})
}

export const sendPreOffer = (data) => { 
    socketIO.emit('pre-offer', data);
   
}

export const sendPreOfferAnswer = (data)=>{
    socketIO.emit('pre-offer-answer', data);
}
export const sendDataUsingWebRTCSignaling =async (data) => {
 
    socketIO.emit('webRTC-signaling', data);

        
}
