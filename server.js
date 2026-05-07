require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./models/db");
const { initSocket } = require("./socket/socket");

// error handling
const ApiError = require("./utils/ApiError");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const server = http.createServer(app);

// SOCKET
initSocket(server);

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// ROUTES
app.use("/api/roles", require("./routers/roleRouter"));
app.use("/api/attendance", require("./routers/attendanceRouter"));
app.use("/api/classes", require("./routers/classRouter"));
app.use("/api/submissions", require("./routers/submissionRouter"));
app.use("/api/subject" ,require("./routers/subjectRoutes"))
app.use("/api/grades", require("./routers/gradesRouter"));
app.use("/api/auth", require("./routers/auth.routes"));
app.use("/api/users", require("./routers/user.routes"));
app.use("/api/messages", require("./routers/messageRouter"));

app.use("/api/lessons", require("./routers/lessonRoutes"));
app.use("/api/tasks", require("./routers/taskRoutes"));
app.use("/api/schedules", require("./routers/scheduleRoutes"));
app.use("/chatbot", require("./routers/chatBotRouter"));

// 404
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// ERROR HANDLER
app.use(errorMiddleware);

// SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});