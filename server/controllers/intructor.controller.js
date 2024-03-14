require("dotenv").config({ silent: true });
const {
  hashedPassword,
  validatePassword,
  comparePassword,
  generateAccessToken,
  generateRereshToken,
} = require("../lib/helper/common");
const { http } = require("../lib/helper/const");
const Instructor = require("../models/instructor.model");
const Course = require("../models/course.model");

//StudentsecretKey for generating access token
const secretAccessKey = process.env.SECRET_ACCESS_KEY_INTRUCTOR;
const secretRefreshKey = process.env.SECRET_REFRESH_KEY_INSTRUCTOR;

// getAll instructors detail
exports.getAllInstructors = async (req, res) => {
  try {
    // instructor with populated coursesEnrolled field
    // get all instructor details, avoid to send password;
    const instructor = await Instructor.find({}, { password: 0 })
      .populate("coursesTaught")
      .exec();
    // if there is no instructor
    if (!instructor || instructor.length === 0) {
      res.status(http.NOT_FOUND).send({
        msg: "No instructor found",
        totalInstructor: instructor.length,
        instructor,
      });
      return;
    }

    // all intructor details
    res.status(http.OK).send({
      msg: "Success",
      totalInstructor: instructor.length,
      instructor,
    });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "Error", error });
  }
};

//register a new instructor
exports.registerInstructor = async (req, res) => {
  const { email, password } = req.body;

  try {
    let isExistInstructor = await Instructor.findOne({ email }, {});

    //check instructor is already register or not
    if (isExistInstructor) {
      res.status(http.CONFLICT).send({
        msg: "error",
        error: `instructor with the email ${email} already registered.`,
      });
      return;
    }

    // password validator
    let isPasswordValidate = validatePassword(password);

    //if password is not strong throw the error
    if (!isPasswordValidate) {
      res.status(http.BAD_REQUEST).send({
        msg: "Please create strong password",
        error:
          "Password must contain at least 8 characters, 1 capital letter, 1 number, and 1 special character",
      });
    } else {
      // instructor details take it out from req.body
      let instructorDetails = { ...req.body };

      //Hashed the student password before saving database
      instructorDetails.password = hashedPassword(instructorDetails.password);

      //save the instructor details on mongoDB.
      const createIntructor = new Instructor(instructorDetails);
      await createIntructor.save();

      res.status(http.CREATED).send({
        message: "instructor registration successful",
        instructorDetails,
      });
    }
  } catch (error) {
    res.status(http.BAD_REQUEST).send({ msg: "error", error });
  }
};

exports.loginInstructor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const instructorDetails = await Instructor.findOne({ email });

    //check user is registered or not
    if (!instructorDetails) {
      res
        .status(http.NOT_FOUND)
        .send({ msg: "error", error: "this email is not registered" });
      return;
    }

    //check user enter correct password or not
    let isPasswordMatched = comparePassword(
      password,
      instructorDetails.password
    );

    if (!isPasswordMatched) {
      res
        .status(http.UNAUTHORIZED)
        .send({ msg: "error", error: "Please enter correct password" });
      return;
    }
    const payload = {
      userId: instructorDetails.id,
      email: instructorDetails.email,
      role: instructorDetails.role,
    };

    //generate the access token
    let accessToken = generateAccessToken(payload, secretAccessKey);

    // if accessToken is not generated throw a error message.
    if (!accessToken) {
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .send({ msg: "error", error: "failed to generate accessToken" });
      return;
    }

    //generate the refresh token
    let refreshToken = generateRereshToken(payload, secretRefreshKey);

    // if refreshToken is not generated throw a error message.
    if (!refreshToken) {
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .send({ msg: "error", error: "failed to generate refreshToken" });
      return;
    }
    // send access and refresh token to client
    res
      .status(http.OK)
      .send({ msg: "user has logged in", accessToken, refreshToken });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};
