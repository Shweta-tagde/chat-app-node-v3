const users = []
//adduser ,removeuser, getuser, getuserinroom

const addUser =({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //value the data
    if(!username|| !room){
    return{
        error: 'username and room are required'

    }
}

    // check fro existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })


    //validate username
    if(existingUser){
        return{
            error:'Username is in user'
        }

    }

    // store user
    const user = { id,username, room}
    users.push(user)

    return{user}
    
}
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}


const getUser = (id)=>{
    return users.find((user)=>{
        return user.id === id
    })
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>{
    
     return( user.room=== room)
    
     
        
    })
}
 addUser({
      id: 33,
      username: 'andrew',
      room:'south'

 })


   addUser({
     id:42,
     username:"reo",
     room:"cityhall"

 })

   addUser({
     id:84,
     username:"andrew",
     room:"cityhall"

 })

//  const useR = removeUser(33)
// console.log(useR)


const userList = getUsersInRoom('cityhall')
console.log(userList)

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}