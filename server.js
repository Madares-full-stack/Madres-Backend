const express =require("express")
require("dotenv").config()
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/lessons', lessonRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedules', scheduleRoutes);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});