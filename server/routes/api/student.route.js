const {
  getAllStudents,
  registerStudent,
  loginStudent,
} = require("../../controllers/student.controller");

module.exports = (app) => {
  app.get("/students", getAllStudents);
  app.post("/student/register", registerStudent);
  app.post("/student/login", loginStudent);
};
