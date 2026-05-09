const { Socket } = require("socket.io");

let io;

const initSocket =(server)=>{
    const {Server} =require("socket.io");
    io=new Server(server,{
        cors:{origin :"*"}
    })

    io.on('connection',(socket)=>{
        socket.on("register", (userId) => {
    socket.join(userId); 
  });
        socket.on("join_room", (room) => {
      socket.join(room);
        })
    })

   
}
 const getIo=()=>{
        if(!io){
             throw new Error("Socket not initialized");
        }
        else{
            return io
        }
    }
module.exports= {initSocket,getIo}