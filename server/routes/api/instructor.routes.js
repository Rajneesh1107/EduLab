const {
  getAllInstructors,
  registerInstructor,
  loginInstructor,
} = require("../../controllers/intructor.controller");

module.exports = (app) => {
  app.get("/instructors", getAllInstructors);
  app.post("/instructor/register", registerInstructor);
  app.post("/instructor/login", loginInstructor);
};
