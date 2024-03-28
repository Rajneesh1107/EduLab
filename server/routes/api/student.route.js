const {
  getAllStudents,
  registerStudent,
  loginStudent,
} = require("../../controllers/student.controller");
const upload = require("../../middleware/multer.middleware");

module.exports = (app) => {
  app.get("/students", getAllStudents);
  app.post("/student/register", upload.single("avatar"), registerStudent);
  app.post("/student/login", loginStudent);
};
