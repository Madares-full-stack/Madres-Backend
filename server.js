const express =require("express")
const app = express();

const db = require("./models/db");
app.use(express.json());
const roleRouter =require("./routers/roleRouter");
app.use("/role",roleRouter)
const attendanceRouter=require("./routers/attendanceRoute");
app.use("/attendance",attendanceRouter)




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
});