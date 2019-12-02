

const users =[]

// addUser


const addUser = ({id, username, room})=>{

    // cleam the data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();
    // validate

    if(!username || !room)
    {
        return {
            error: 'Username and room are required!'
        }
    }


    // check dup

    const dup = users.find(user=>{
        return user.room === room && user.username === username
    })

    // validate username 
    if(dup)
    {
        return {
            error: 'Username is taken!!'
        }
    }


    const user = { id , username , room}
    users.push(user)
    return {user}
}


const removeUser = (id)=>{

    const index = users.findIndex(user =>{
        return user.id === id;
    })
    if(index !== -1)
    {
        return users.splice(index,1)[0];
    }
  
}
// get user by ID

const getUser = (id)=>{

    const index = users.findIndex(user=> user.id === id)

    if(index!==-1)
    {
        return users[index];
    }
}

// get all users in the room 

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();

    return users.filter(user=>user.room === room);
    
}

// addUser({
//     id: 1,
//     username: 'eric',
//     room: 'center'
// })

// addUser({
//     id: 2,
//     username: 'erisssc',
//     room: 'center'
// })

// addUser({
//     id: 2,
//     username: 'erisseeesc',
//     room: 'center'
// })

// const user = removeUser(1)

// const u1 = getUser(2)


// const room1 = getUsersInRoom('center')
// console.log(room1)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}

// removeUser




// getUser




// getUser in the roo