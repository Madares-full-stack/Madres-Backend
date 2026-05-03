const express = require('express');
const lessonRoutes = require('./Madres-Backend/routers/lessonRoutes');
const ApiError = require('./Madres-Backend/utils/apiError');
const errorMiddleware = require('./Madres-Backend/middlewares/errorMiddleware');

const app = express();
const taskRoutes = require('./Madres-Backend/routers/taskRoutes');
const scheduleRoutes = require('./Madres-Backend/routers/scheduleRoutes');


const express =require("express")
require("dotenv").config()
const app = express();
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


const PORT= process.env.PORT

app.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
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