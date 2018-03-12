var express = require("express");
var bodyParser = require("body-parser");
const markFile = require('./mark');
const timeTablesFile = require('./tkb');
const toeicFile = require('./toeic');
const infoUserFile = require('./infor');
var app = express();
app.listen(3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post("/getMarks",urlencodedParser,function(req, res) {
	 let mark = markFile.getMarks(req.body.username,req.body.password);
	 mark.then(function(result) {
  res.send(result);
})
});

app.post("/Timetables",urlencodedParser,function(req, res) {
	 let Timetables = timeTablesFile.getTimeTables(req.body.studentCode);
	 Timetables.then(function(result) {
  res.send(result);
})
});

app.post("/getToeic",urlencodedParser,function(req, res) {
	 let toeicMarks = toeicFile.getToeic(req.body.username,req.body.password,req.body.studentCode);
	 toeicMarks.then(function(result) {
  res.send(result);
})
});

app.post("/getInfo",urlencodedParser,function(req, res) {
	 let infoUser = infoUserFile.getInfomation(req.body.username,req.body.password);
	 infoUser.then(function(result) {
  res.send(result);
})
});