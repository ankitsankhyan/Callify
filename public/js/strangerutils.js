import * as wss from './wss.js';
export const changeStrangerConnectionStatus = (status) => {
    console.log("emmiting to server change stranger connection status event");
  const data = {status: status};
  wss.changeStrangerConnectionStatus(data);

}