const messageModel =require("../models/messageSchema")
const {getIo}=require("../socket/socket")
const serverError=(req,res)=>{
    return res.status(500).json({
        success:false,
        message:"Server error"
    })
}

const sendMessage=async(req,res)=>{
try{
    const {receiver,content ,room} =req.body;
    const message =new messageModel({
        sender:req.user._id,
        receiver,
        content,
        room
    })
    const saved= await message.save();
    const io =getIo();
    io.to(room).emit('receive_message',saved)
    res.status(201).json({
        success:true,
        message:saved
    })

}catch(err){
  return  serverError(req,res)
}
}


const getMessage=async(req,res)=>{
    try{
        const {room} =req.query;
        if(!room){
            return res.status(404).json(
               {
                success:false,
                message:"Room not found"
               }
            )
        }
        const result =await messageModel.find({room}).populate("sender","name").populate("receiver","name").sort({createdAt :1})

        return res.status(200).json({
            success:true,
            messages:result
        })

    }catch(err){
      return  serverError(req,res)
    }
}

const updateMessage=async(req,res)=>{
    try{

        const {id} =req.params;
        const {content}=req.body


        const result =await messageModel.findByIdAndUpdate(id,content,{new:true})
   
        if(!result){
            return res.status(404).json({
                success:false,
                message:"message not found "
            })
        }
        else{
            return res.status(201).json({
                success:true,
                message:result
            })
        }

    }catch(err){
       return serverError(req,res)
    }
}

const deleteMessage=async(req,res)=>{
    try{
        const {id}=req.params;
        const result =await messageModel.findByIdAndDelete(id)

        if(!result){
            return res.status(404).json({
                success:false,
                message:"message not found "
            })
        }else{
            return res.status(200).json({
                success:true,
                message:"message deleted successfully"
            })
        }

    }catch(err){
       return serverError(req,res)
    }
}

module.exports ={sendMessage,getMessage,updateMessage,deleteMessage}