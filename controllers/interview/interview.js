const Interview = require("../../models/interview.model");
const { v4: uuid} = require("uuid")
const {INTERVIEW_TYPE} = require("../../constants/index");
const moment = require("moment");
const {UPCOMING} = INTERVIEW_TYPE;
/* validate params  */
const isValid = (value) => {
  if (!value || value?.length === 0) return false;
  return true;
};

const addInterview = async (req, res) => {
  const {
    companyID,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateExtra,
    interviewerName,
    interviewerEmail,
    interviewerPhone,
    interviewerExtra,
    date,
    response,
  } = req.body;

  if (!isValid(companyID)) {
    return res.status(400).send({
      status: false,
      message: "Company ID is missing",
    });
  }

  if (
    !isValid(candidateName) ||
    !isValid(candidateEmail) ||
    !isValid(candidatePhone) ||
    !isValid(interviewerName) ||
    !isValid(interviewerEmail) ||
    !isValid(interviewerPhone)
  ) {
    return res.status(400).send({
      status: false,
      message: "Mandatory fields are missing",
    });
  }
  const payload = {
    companyID,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateExtra,
    interviewerName,
    interviewerEmail,
    interviewerPhone,
    interviewerExtra,
    date,
    response,
  };
  payload["candidateLink"] = uuid();
  payload["interviewerLink"] = uuid();
  try
  {
    const interview = await new Interview(payload).save();
  
    return res.status(200).send({
      status: true,
      message: "User Created successfully",
      data: interview,
    });
  }
  catch(error)
  {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }

};

const getInteviewCount = async(req,res) => {
  try
  {
    const interviewCount = await Interview.aggregate([{
      $group: {
        _id:'$stage',
        count: { $sum: 1},
      }
    }]);
    return res.status(200).send({
          status: false,
          data: interviewCount,
    });
  }
  catch(error)
  {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }

}

const getAllInterviews = async(req,res) => {
    const { stage = UPCOMING, currentPage = 1, currentLimit = 10 } = req.body;
    try
    {
    const interview = await Interview.find({stage:stage}).skip((currentPage-1)*currentLimit).limit(currentLimit).populate("companyID");
    const count = await Interview.find({stage:stage}).countDocuments();
    const data = {
      data:interview,
      metadata: {
          total: count,
      }
    }
    return res.status(200).send({
      status:false,
      data: data,
      message:"",
    })
  }
  catch(error)
  {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }

}

const getDataByMonth = (user) => {
    console.log("===============user",user);
    const arr = Array.from({length: 12}, (_, i) => ({month:i + 1,count:0}))
    user.forEach( interview => {
      const month = moment(interview.date*1000).month();
      console.log("========month",month);
    })
}
const getMonthlyStats = async(req, res) => {
    const id = req.body.user._id;
    console.log("==========id",id);
    try
    {
      const user = await Interview.findById(id);
      const data = getDataByMonth(user);
      return res.status(200).send({
        status: true,
        data:data,
        message: "Data fetched successfully",
      });
    }
    catch(error)
    {
      console.log("=========err",error)
      return res.status(500).send({
        status: false,
        message: "Some error Occurred",
        error: error,
      });
    }
  


}

module.exports = {
  addInterview,
  getInteviewCount,
  getAllInterviews,
  getMonthlyStats,
};
