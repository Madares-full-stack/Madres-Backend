const submissionsModel = require("../models/submissionsSchema")
const submissionRouter = require("../routers/submissionRouter")

const serverError=(req,res)=>{
  res.status(500).json({
    success:false,
    message:"server error"
  })

}

const getSubmission=async(req,res)=>{
    try{
     const result =await submissionsModel.find({})
     if(result.length === 0 ){
    return res.status(404).json({
        success:false,
        message:"submission not found "
    })
     }else{
        res.status(200).json({
            success:true,
        submission:result
        })
     }

    }catch(err)
    {
      return  serverError(req,res)
    }
}


const createSubmission=async(req,res)=>{
  try{
    const {task,student,answer}=req.body;
    const newSubmission =new submissionsModel({
      task,
      student,
      answer
    })

    await newSubmission.save();
    res.status(201).json({
      success:false,
      message:"Submission cerated successfully",
      submission:newSubmission
    })
  }catch(err){
   return  serverError(req,res)
  }

}
const updateSubmission=async(req,res)=>{
  try{
    const {id}=req.params;
    const update=req.body;
    const result = await  submissionsModel.findByIdAndUpdate(id ,update,{new:true});
    if(!result ){
      res.status(404).json({
        success:false,
        message:"Submission not found "
      })
    }else{
      res.status(200).json({
        success:true,
        submission:result
      })
    }

  }catch(err){
    return serverError(req,res)

  }

}
const deleteSubmission =async(req,res)=>{
try{
  const {id} =req.params;
  const result =await submissionsModel.findByIdAndDelete(id);
  if(!result ){
    return res.status(404).json({
      success:false,
      message:"Submission not found"
    })
  }else{
    res.status(200).json({
      success:true,
      message:"Submission deleted successfully"
    })
  }

}catch(err){
  return  serverError(req,res);

}
}

module.exports ={getSubmission ,updateSubmission,createSubmission,deleteSubmission}