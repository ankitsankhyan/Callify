import * as store from './store.js'

// we are passing the url of the server to the io function 
// since it is same directory then we can use / only
const socket = io('localhost:3000')

socket.on('connect', () => {
  
   store.setSocketId(socket.id);
   console.log(store.getState());
})
