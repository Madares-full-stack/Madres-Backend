const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const connectDB = require("./models/db");

const app = express();
const server = http.createServer(app);

//  SOCKET
const { initSocket } = require("./socket/socket");
initSocket(server);

 //MIDDLEWARE 
app.use(cors());
app.use(express.json());

connectDB();

//routes
app.use("/role", require("./routers/roleRouter"));
app.use("/attendance", require("./routers/attendanceRouter"));
app.use("/class", require("./routers/classRouter"));
app.use("/submission", require("./routers/submissionRouter"));
app.use("/grades", require("./routers/gradesRouter"));
app.use("/auth", require("./routers/auth.routes"));
app.use("/users", require("./routers/user.routes")); 
app.use("/message", require("./routers/messageRouter"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});