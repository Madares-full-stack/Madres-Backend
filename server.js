require("dotenv").config();
const express= require("express");
const app = express();

const db = require("./models/db");

app.use(express.json());

// Routes
const authRouter = require("./routers/auth.routes");
const userRouter = require("./routers/user.routes");
const roleRouter = require("./routers/roleRouter");
const attendanceRouter = require("./routers/attendanceRoute");

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/role", roleRouter);
app.use("/attendance", attendanceRouter);

const PORT =  5000;

connectDB().then(() => {
 app.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
  });
});
