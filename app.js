const express = require("express");
const cors = require('cors');
const protect = require("./middleware/protect");
const {createCodeFile, getJobStatus} = require("./controllers/codeEditor/compiler");
const { superUserSignup, superUserLogin, superUserEdit, getSuperAdminData } = require("./controllers/superUser/superUser");
const { clientUserSignup, clientUserLogin, AddCompany, getAllClients, clientUserEdit, getClientData } = require("./controllers/clientUser/clientUser");
const { addQuestion, getAllQuestions } = require("./controllers/questionBank/questionBank");
const { addInterview, getAllInterviews, getInteviewCount, getMonthlyStats } = require("./controllers/interview/interview");
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Super User */
app.post("/api/super/login",superUserLogin)
app.post("/api/super/signup",superUserSignup)
app.get("/api/super",protect,getSuperAdminData)
app.post("/api/super/edit",protect,superUserEdit)

/* Org Creation */
app.post("/api/org/add",protect,AddCompany)

/* Client User */
app.post("/api/client/login",clientUserLogin)
app.post("/api/client/signup",clientUserSignup)
app.post("/api/client/all",protect,getAllClients)
app.get("/api/client",protect,getClientData);
app.post("/api/client/edit",protect,clientUserEdit)

/* Interviews */
app.post("/api/interview/add",protect,addInterview)
app.get("/api/interivew/stats",getInteviewCount)
app.post("/api/interview/all",protect,getAllInterviews)
app.get("/api/interview/monthly-data",protect,getMonthlyStats)

/* Question */
app.post("/api/question/add",protect,addQuestion)
app.post("/api/question/all",protect,getAllQuestions)

/* Code Editor */
app.post("/api/run",protect,createCodeFile)
app.get("/api/status",protect,getJobStatus)

/* Handling route  not found - 404 */
app.use(function(req, res) {
   return res.status(404).send({
            status:false,
            message:'Page not found'
    });
});

module.exports = app;