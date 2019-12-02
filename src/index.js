
const path = require("path")
const http = require('http');
const express  = require("express");
const socketio = require('socket.io')


const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {getUser , addUser , removeUser, getUsersInRoom} = require('./utils/users')
const app = express();
const server =http.createServer(app);
const io = socketio(server);

const publicDir = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
app.use(express.static(publicDir));


// let count = 0;


io.on('connection', (socket)=>{
    console.log("New webconnect ")


   
    socket.on('join', ({username , room }, callback)=>{

        const {error , user } = addUser({id: socket.id , username, room})

        

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit("welcome", generateMessage('Admin','Welcome !'))

        // send to everyone except new user
        socket.broadcast.to(user.room).emit("welcome", generateMessage('Admin',user.username+" has joined our chat room!!!"))
    
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


        callback()
        // socket.emit  io.emit everyone socket.broadcast.emit 

        // io.to.emit --> specific room , socket.broadcast.to.emit specific room except sender


    })


    socket.on("submit",(message,callback)=>{

        const user = getUser(socket.id);
        
        io.to(user.room).emit("welcome",generateMessage(user.username,message))
        callback('deliveredddd');
    })


    socket.on('sendLocation', (coord,callback) => {

        const user = getUser(socket.id);
        console.log(coord + "coord from user")
        const url = "https://google.com/maps/?q="+coord.latitude+','+coord.longitude;
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url ))
        callback();
    })


    socket.on('disconnect',() => {

        const user = removeUser(socket.id)

        if(user)
        {
            io.to(user.room).emit("welcome", generateMessage('Admin',user.username+' has disconnected'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
            
                
    
        })
    // send event 
    // socket.emit("countUpdated",count)

    // socket.on('inc',()=>{
    //     count++;
    //     // send to every connect
    //     io.emit('countUpdated',count)
    // })
    
})


server.listen(port,(err,res)=>{

    console.log("connect to 3000")
}
)