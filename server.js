const express = require("express");
require("dotenv").config();
const http = require("http");
const app = express();
const server = http.createServer(app);
const { initSocket } = require("./socket/socket");
initSocket(server);
const cors = require("cors");
const connectDB = require("./models/db");

// routes
app.use(express.json());
const roleRouter = require("./routers/roleRouter");
app.use("/role", roleRouter);
const attendanceRouter = require("./routers/attendanceRouter");
app.use("/attendance", attendanceRouter);
const classRouter = require("./routers/classRouter");
app.use("/class", classRouter);
const submissionRouter = require("./routers/submissionRouter");
app.use("/submission", submissionRouter);
const gradesRouter = require("./routers/gradesRouter");
app.use("/grades", gradesRouter);
const authRouter = require("./routers/auth.routes");
const userRouter = require("./routers/user.routes");

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/role", roleRouter);
app.use("/attendance", attendanceRouter);
const messageRouter = require("./routers/messageRouter");
app.use("/message", messageRouter);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
});
