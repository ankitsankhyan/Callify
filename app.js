const express = require('express');
const http = require('http');
const { connect } = require('http2');
const { connected } = require('process');

const PORT = process.env.PORT || 3000;
const app = express();
// http server is created to get more control on http requests
const server = http.createServer(app);
// socket.io is initialized by passing the http server object
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + './public/index.html')
 });
let connectedPeers = [];
 io.on('connection', (socket) => {
  
    // ##################### PRE OFFER ############################
    socket.on('pre-offer', (data) => {
        console.log('pre-offer-came');
      
      const {calltype, calleePersonalCode} = data;
       const connectedPeer = connectedPeers.find((peerSocketId) => {
            return peerSocketId == calleePersonalCode;
         })
        const data2send = {
            calltype,
            callerSocketId: socket.id
        }
      if(connectedPeer && socket.id !== calleePersonalCode){
        io.to(calleePersonalCode).emit('pre-offer', data2send);
            
      }else{
            const data = {
                preOfferAnswer: 'CALLEE_NOT_FOUND',
            }
            io.to(socket.id).emit('pre-offer-answer', data);
      }

    })

    // ##################### PRE OFFER ANSWER ############################
    socket.on('pre-offer-answer', (data) => {
        console.log('pre-offer-answer-came');
        console.log(data);
        const {callerSocketId} = data;
        const connectedPeer = connectedPeers.find(
            (peerSocketId)=> peerSocketId === callerSocketId
        )

        if(connectedPeer){
            io.to(data.callerSocketId).emit('pre-offer-answer', data);
        }
    });
    


    

// ##########################Disconnect ###########################
    console.log(socket.id);
    connectedPeers.push(socket.id);
    socket.on('disconnect', () => {
     const newConnectedPeers = connectedPeers.filter((peer) => {
        return peer !== socket.id;
     })

     connectedPeers = newConnectedPeers;
    console.log('user disconnected');
    })


}
    );

   

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

