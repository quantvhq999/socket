const io = require('socket.io')(8600,{
    cors:{
        origin:"http://localhost:3000"
    }
})

let users =[]
const addUser = (userId, socketId) =>{
    !users.some((user) => user.userId === userId) && users.push({userId, socketId})
}

const removeUser = (socketId) =>{
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) =>{
    console.log(users)
    return users.find(user => user.userId === userId)
}
io.on('connection',(socket) =>{
    console.log('user connected')
    socket.on("addUser", userId =>{
        addUser(userId, socket.id)
        io.emit("getUser",users)
    })
    
    /// send and get message
    socket.on("sendMessage",async ({senderId, receiverId, text}) =>{
        const user = await getUser(receiverId)
        console.log({senderId, receiverId, text})
        io.to(user.socketId).emit('getMessage',{senderId, text})
    })

    socket.on('disconnect',() =>{
        removeUser(socket.id)
        io.emit("getUser",users)
    })

})