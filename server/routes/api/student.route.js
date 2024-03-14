const {
  getAllStudents,
  registerStudent,
} = require("../../controllers/student.controller");

module.exports = (app) => {
  app.get("/students", getAllStudents);
  app.post("/students/register", registerStudent);
};
