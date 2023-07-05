let state = {
    socketId:null,
    // gets access to microphone and camera
    localStream:null,
    // gets access to remote stream i.e stream of other user
    remoteStream:null,
    screenSharingStream:null,
    allowConnectionsFromStrangers:false,
    screenSharingActive:false,
  

}

export const setSocketId = (socketId) => {

    state={
        ...state,
        socketId
    };

}

export const setLocalStream = (stream) => {
    state = {
        ...state,
        localStream:stream
    };
}


export const setAllowConnectionsFromStrangers = (allowConnectionsFromStrangers) => {
    state = {
        ...state,
        allowConnectionsFromStrangers
    };
}

export const setScreenSharingActive = (screenSharingActive)=>{
    state = {
        ...state,
        screenSharingActive
    }
}

export const setScreenSharingStream = (stream)=>{
    state={
        ...state,
        stream
    }
}

export const getState= ()=>{
    return state;
}