const express =require('express');

const messageRouter = express.Router();
const {sendMessage,getMessage,updateMessage,deleteMessage}=require("../controllers/messageController");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");


messageRouter.get("/", verifyToken, getMessage);
messageRouter.post("/", verifyToken, sendMessage);
messageRouter.put("/:id", verifyToken, updateMessage);
messageRouter.delete("/:id", verifyToken, deleteMessage);

module.exports = messageRouter