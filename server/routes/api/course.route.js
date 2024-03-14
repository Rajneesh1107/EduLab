const {
  getAllCourses,
  createCourse,
} = require("../../controllers/courses.controller");
const auth = require("../../middleware/auth.middleware");
const accessCheck = require("../../middleware/authorize.middleware");

module.exports = (app) => {
  //this route return all the courses;
  app.get("/courses", auth, getAllCourses);

  // creating for new course
  app.post("/course/add", auth, accessCheck(["instructor"]), createCourse);
};
