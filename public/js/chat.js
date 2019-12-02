



const socket = io();


const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');


const $messages = document.querySelector('#messages')

// templates 
const messageTemplate = document.querySelector('#message-template').innerHTML
const LocationMessageTemplate = document.querySelector("#location-message-template").innerHTML


const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML


// option query string

const {username , room}=Qs.parse(location.search, {ignoreQueryPrefix: true})


const autoscroll = ()=>{


    // mew message element

    const $newMessage = $messages.lastElementChild

    // find height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    

    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessagesHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;

    const scrollOffSet = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessagesHeight <= scrollOffSet ){
        
        $messages.scrollTop = $messages.scrollHeight;
    }
    console.log(newMessageStyles, newMessagesHeight, newMessageMargin)

}




socket.on("welcome",(messageObject)=>{
    console.log(messageObject);
    // use mustache lib to render the message template
    const html = Mustache.render(messageTemplate ,{
        username: messageObject.username,
        message : messageObject.text,
        createdAt: moment(messageObject.createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend',html)

    autoscroll();


})


socket.on('locationMessage',(locationObject)=>{


    console.log(locationObject)
    const html = Mustache.render( LocationMessageTemplate, {
        username: locationObject.username,
        url: locationObject.url,
        createdAt: moment(locationObject.createdAt).format('h:mm a')
    })


    $messages.insertAdjacentHTML('beforeend', html
    )

})



$messageForm.addEventListener('submit',(e)=>{

    // prevent page form refreshing
    e.preventDefault();

    // diable button
    $messageFormButton.setAttribute('disabled','disabled')

    const msg = e.target.elements.message.value;
    socket.emit("submit",msg, (message)=>{

        
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value=''
        $messageFormInput.focus()
        // enable
        console.log("received", message)
    });
})


$sendLocationButton.addEventListener('click', () =>{ 

        if ("geolocation" in navigator )
        {

            $sendLocationButton.setAttribute('disabled' , 'disabled')
            navigator.geolocation.getCurrentPosition( position =>{
            console.log(position);
    
                // disable send location
                socket.emit('sendLocation', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }, ()=>{
    
                    $sendLocationButton.removeAttribute('disabled')
                    console.log("location shared")
                }
    
                )
            })
            
        }
        else
        {
            console.log('cannot find the location')
        }


     
      

})


socket.emit('join', {username,room} ,()=>{

})



socket.on('roomData', ({room , users})=>{
    
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html;

})



// socket.on('countUpdated',(count)=>{
//     console.log("the count updated", count)
// })

// document.querySelector('#inc').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('inc');
// })