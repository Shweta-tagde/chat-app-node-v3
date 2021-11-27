const socket = io()
const $messageform = document.querySelector('#message-form')
const $messageforminput = $messageform.querySelector('input')
const $messageformbutton = document.querySelector('button')
const $sendlocation = document.querySelector('#send-location')
const $messages = document.querySelector("#messages")


//templates
 
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessagetemplate = document.querySelector("#location-message-template").innerHTML
const  sidebartemplate = document.querySelector('#sidebar-template').innerHTML

//option for parsing query string
const{username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true}) 

const autoscroll = ()=>{
    //new nessage
    const $newmessage = $messages.lastElementChild
    //height of the new msg
    const newMessageStyles  = getComputedStyle($newmessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const  newMessageHeight =$newmessage.offsetHeight+newMessageMargin
    // console.log(newMessageMargin)


    //visible height
    const visibleHeight= $messages.offsetHeight

    //height of container
    const containerHeight = $messages.scrollHeight

    //how ffar we scroll
    const scrolloffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <=scrolloffset){
        $messages.scrollTop = $messages.scrollHeight

    }

}

socket.on('message',(message)=>{
    // console.log( message)
    
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt : moment(message.creatAt).format('h:mm:a')


        //or short hand syntax message 
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})
socket.on("locationmessage",(locationmessage)=>{
    console.log(locationmessage)
    const html = Mustache.render(locationMessagetemplate,{
        username:locationmessage.username,
        url: locationmessage.url,
        date:moment(locationmessage.creatAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})
socket.on('roomdata',({room,users})=>{
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html

})


$messageform.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageformbutton.setAttribute('disabled','disabled')
    const message= e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log('the message was delivered')

    })

})
$sendlocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geo location is not supported by your brower')

    }
    $sendlocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        socket.emit('sendlocation',{

            latitude:position.coords.latitude,
            longitude:position.coords.longitude


        },()=>{
            $sendlocation.removeAttribute('disabled')

            console.log('Location share')
        })


    })
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert (error)
        location.href= '/'
    }

})