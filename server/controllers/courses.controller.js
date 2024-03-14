const Course = require("../models/course.model");
const Lecture = require("../models/lecture.model");
const instructor = require("../models/instructor.model");
const { http } = require("../lib/helper/const");
exports.getAllCourses = async (req, res) => {
  try {
    let courses = await Course.find({}).populate("lectures").exec();
    if (!courses.length) {
      res
        .status(http.NOT_FOUND)
        .send({ msg: "There is no course present...", courses });
      return;
    }
    res.status(http.OK).send({ msg: "success", courses });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description, userId } = req.body;
  console.log(userId);
  try {
    // Validate title
    if (!title) {
      res
        .status(http.BAD_REQUEST)
        .send({ msg: "error", error: "Title is required" });
      return;
    }

    // Check if course with the same title already exists
    let existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      res.status(http.CONFLICT).send({
        msg: "error",
        error: "A course with the same title already exists",
      });
      return;
    }

    // Create course details object
    let courseDetails = {
      title,
      description: description ? description : "",
      instructor: userId,
    };

    // Create new course
    let newCourse = new Course(courseDetails);
    await newCourse.save();

    // Send success response with detailed course information
    res.status(http.CREATED).send({
      msg: "Success",
      data: {
        courseId: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        instructor: newCourse.instructor,
      },
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating course:", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};
