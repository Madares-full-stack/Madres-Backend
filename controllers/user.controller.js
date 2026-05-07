const User = require("../models/user.model");
const Role = require("../models/roleSchema");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role","name").select("-password");
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required.",
      });
    }

    const validRoles = ["admin", "teacher", "student", "parent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({ name, email, password, role:roleId });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getChatUsers = async (req, res) => {
  try {
  
    const currentUser = await User.findById(req.user._id).populate("role");
    const roleName = currentUser.role?.name;

    let query = {};
    switch (roleName) {
      case "admin":

        query = { _id: { $ne: currentUser._id } };
        break;

      case "teacher":
        const teacherAndParentRoles = await Role.find({ 
          name: { $in: ["student", "parent", "teacher"] } 
        });
        const roleIds = teacherAndParentRoles.map(r => r._id);
        query = { 
          role: { $in: roleIds },
          _id: { $ne: currentUser._id } 
        };
        break;

      case "parent":
        const teacherRoleForParent = await Role.findOne({ name: "teacher" });
        query = {
          $or: [
            { _id: { $in: currentUser.children } },
            { role: teacherRoleForParent._id }
          ]
        };
        break;

      case "student":
        const staffRoles = await Role.find({ name: { $in: ["teacher", "admin"] } });
        query = { role: { $in: staffRoles.map(r => r._id) } };
        break;

      default:
        return res.status(200).json({ success: true, users: [] });
    }

    const users = await User.find(query)
      .select("name email role")
      .populate("role", "name");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching chat users: " + err.message,
    });
  }
};

const addChild=async(req,res)=>{
  try{
    const {parentId,childId}=req.body;
    const child =await User.findById(childId).populate("role")
    if(!child){
      return res.status(404).json({
        success:false,
        message:"Child not found"
      })
    } else if(child.role.name !== "student"){
      return res.status(400).json({
        success:false,
        message:"Child must have student"
      });

    }
        const parent =await User.findByIdAndUpdate(
            parentId,
            { $addToSet: { children: childId } },
            { new: true }
        )
        if(!parent){
            return res.status(404).json({
                success:false,
                message:"Parent not found"
            })
        } else{
            return res.status(200).json({
                success:true,
                message:"Child added to parent successfully",
                parent
            })
        }


  }catch(err){
      return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAllUsers, createUser,getChatUsers, addChild };