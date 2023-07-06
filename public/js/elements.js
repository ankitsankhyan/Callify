export const getIncomingCallDialog = (callTypeInfo,
    acceptCallHandler,
    rejectCallHandler) => {
      console.log("getIncomingCallDialog is executing");
        const dialog = document.createElement('div');
        dialog.classList.add('dialog_wrapper');
        const dialogContent = document.createElement('div');
        dialogContent.classList.add('dialog_content');
      
        const title = document.createElement('p');
        title.classList.add('dialog_title');
      
      
        title.innerHTML = `Incoming ${callTypeInfo} call`;
      
      
    //   ############################# Image Container #############################
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('dialog_image_container');
        const image = document.createElement('img');
        const avatarImagePath = './utils/images/dialogAvatar.png';
        image.src = avatarImagePath;
        imageContainer.appendChild(image);

    //  ############################# Buttons Container #############################
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('dialog_button_container');

    // #############################Accept Call Button ###################################
   
    const acceptCallButton = document.createElement('button');
    acceptCallButton.classList.add('dialog_accept_call_button');
    const acceptCallButtonImage = document.createElement('img');
    acceptCallButtonImage.src = './utils/images/acceptCall.png';
    acceptCallButtonImage.classList.add('dialog_button_image');
    acceptCallButton.appendChild(acceptCallButtonImage);
    acceptCallButton.addEventListener('click', acceptCallHandler);
   

    // #############################Reject Call Button ###################################
    const rejectCallButton = document.createElement('button');
    rejectCallButton.classList.add('dialog_reject_call_button');
    const rejectCallButtonImage = document.createElement('img');
    rejectCallButtonImage.src = './utils/images/rejectCall.png';
    rejectCallButtonImage.classList.add('dialog_button_image');
    rejectCallButton.appendChild(rejectCallButtonImage);
    rejectCallButton.addEventListener('click', rejectCallHandler);

    buttonContainer.appendChild(acceptCallButton);
    buttonContainer.appendChild(rejectCallButton);
        dialog.appendChild(dialogContent);
        dialogContent.appendChild(title);
        dialogContent.appendChild(imageContainer);
        dialogContent.appendChild(buttonContainer);
      
        return dialog

}

export const getCallingDialog = (rejectCallHandler) => {
        console.log('ruturning calling dialog for rejecting');
  
        const dialog = document.createElement('div');
        dialog.classList.add('dialog_wrapper');
        const dialogContent = document.createElement('div');
        dialogContent.classList.add('dialog_content');
      
        const title = document.createElement('p');
        title.classList.add('dialog_title');
      
      
        title.innerHTML = ` calling `;
      
      
    //   ############################# Image Container #############################
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('dialog_image_container');
        const image = document.createElement('img');
        const avatarImagePath = './utils/images/dialogAvatar.png';
        image.src = avatarImagePath;
        imageContainer.appendChild(image);

    //  ############################# Buttons Container #############################
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('dialog_button_container');


    // #############################Reject Call Button ###################################
    const rejectCallButton = document.createElement('button');
    rejectCallButton.classList.add('dialog_reject_call_button');
    const rejectCallButtonImage = document.createElement('img');
    rejectCallButtonImage.src = './utils/images/rejectCall.png';
    rejectCallButtonImage.classList.add('dialog_button_image');
    rejectCallButton.appendChild(rejectCallButtonImage);
    rejectCallButton.addEventListener('click', rejectCallHandler);
  
    buttonContainer.appendChild(rejectCallButton);
        dialog.appendChild(dialogContent);
        dialogContent.appendChild(title);
        dialogContent.appendChild(imageContainer);
        dialogContent.appendChild(buttonContainer);
      
        return dialog
}

export const getInfoDialog = (dialogTitle,dialog_description) => {
        const dialog = document.createElement('div');
        dialog.classList.add('dialog_wrapper');
        const dialogContent = document.createElement('div');
        dialogContent.classList.add('dialog_content');
     


        const title = document.createElement('p');
        title.classList.add('dialog_title');
        title.innerHTML = dialogTitle;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('dialog_image_container');
        const image = document.createElement('img');
        const avatarImagePath = './utils/images/dialogAvatar.png';
        image.src = avatarImagePath;
        imageContainer.appendChild(image);

        const descriptionText = document.createElement('p');
        descriptionText.classList.add('dialog_description');
        descriptionText.innerHTML = dialog_description;
       
        dialog.appendChild(dialogContent);
        dialogContent.appendChild(title);
        dialogContent.appendChild(imageContainer);
        dialogContent.appendChild(descriptionText);
        return dialog


}