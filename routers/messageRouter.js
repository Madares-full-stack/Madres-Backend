const express =require('express');

const messageRouter = express.Router();
const {sendMessage,getMessage,updateMessage,deleteMessage}=require("../controllers/messageController");

messageRouter.get("/",getMessage);
messageRouter.post("/",sendMessage);
messageRouter.put("/:id",updateMessage);
messageRouter.delete("/:id",deleteMessage)

module.exports = messageRouter