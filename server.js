const express =require("express")
require("dotenv").config()
const http =require('http');
const app = express();
const server =http.createServer(app)
const {initSocket}=require("./socket/socket")
initSocket(server)
const cors=require("cors")
const db = require("./models/db");
app.use(express.json());
const roleRouter =require("./routers/roleRouter");
app.use("/role",roleRouter)
const attendanceRouter=require("./routers/attendanceRouter");
app.use("/attendance",attendanceRouter)
const classRouter =require("./routers/classRouter");
app.use("/class" ,classRouter)
const submissionRouter =require("./routers/submissionRouter");
app.use("/submission",submissionRouter);
const gradesRouter =require("./routers/gradesRouter");
app.use("/grades",gradesRouter)


const messageRouter = require("./routers/messageRouter");
app.use("/message",messageRouter)


const PORT= process.env.PORT

server.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
});