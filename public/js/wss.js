import * as store from './store.js';
import * as ui from './ui.js';
import * as WebRTCHandler from './webrtchandler.js';
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
}

export const sendPreOffer = (data) => {
    console.log('emitting to server pre offer server');
    socketIO.emit('pre-offer', data);
   
}

