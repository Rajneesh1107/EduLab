require("dotenv").config({ silent: true });
const Student = require("../models/student.model");
const Course = require("../models/course.model");
const { http } = require("../lib/helper/const");
const {
  hashedPassword,
  validatePassword,
  generateAccessToken,
  generateRereshToken,
  comparePassword,
} = require("../lib/helper/common");
const redis_client = require("../lib/db/redisdb");
const { sendOtp } = require("../lib/helper/nodemailer");
const cloudinary = require("../lib/helper/cloudinaryConfig");
const upload = require("../middleware/multer.middleware");

//StudentsecretKey for generating access token
const secretAccessKey = process.env.SECRET_ACCESS_KEY_STUDENTS;
const secretRefreshKey = process.env.SECRET_REFRESH_KEY_STUDENT;
//get all students details, only student name, email, courseEnrolled, role ;
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(
      {},
      { address: 0, dateOfBirth: 0, avatar: 0, phoneNumber: 0, password: 0 }
    )
      .populate("coursesEnrolled")
      .exec();
    console.log(students);

    if (!students || students.length === 0) {
      res.status(http.NOT_FOUND).send({
        msg: "No students found",
        totalStudent: students.length,
        students,
      });
      return;
    }

    // Students with populated coursesEnrolled field
    res.status(http.OK).send({
      msg: "Success",
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "Error", error });
  }
};

//register a new student
exports.registerStudent = async (req, res) => {
  let { email, password } = req.body;

  try {
    let isExistStudent = await Student.findOne({ email });

    //check student is already register or not
    if (isExistStudent) {
      res.status(http.CONFLICT).send({
        msg: "error",
        error: `Student with the email ${email} already registered.`,
      });
    }
    // upload avatar to cloudinary

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.avatar = result.secure_url;
    }
    // generate 6 digit otp, save the otp to redis  and send to student email.

    // for the time being isSendOtp is not uses yet...
    // const isSendOtp = await sendOtp(email, req.body.firstName);

    // password validator
    if (!validatePassword(password)) {
      res.status(http.BAD_REQUEST).send({
        msg: "Please create strong password",
        error:
          "Password must contain at least 8 characters, 1 capital letter, 1 number, and 1 special character",
      });
    } else {
      // Student details take it out from req.body
      let studentDetails = { ...req.body };

      //Hashed the student password before saving database
      studentDetails.password = hashedPassword(studentDetails.password);

      //save the student details on mongoDB.
      const createStudent = new Student(studentDetails);
      await createStudent.save();

      res
        .status(http.CREATED)
        .send({ message: "Student registration successful", studentDetails });
    }
  } catch (error) {
    res.status(http.BAD_REQUEST).send({ msg: "error", error });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const studentDetails = await Student.findOne({ email });

    //check user is registered or not
    if (!studentDetails) {
      res
        .status(http.NOT_FOUND)
        .send({ msg: "error", error: "this email is not registered" });
      return;
    }

    //check user enter correct password or not
    if (!comparePassword(password, studentDetails.password)) {
      res
        .status(http.UNAUTHORIZED)
        .send({ msg: "error", error: "Please enter correct password" });
      return;
    }

    const payload = {
      userId: studentDetails._id,
      email: studentDetails.email,
      role: studentDetails.role,
    };

    //generate the access token
    let accessToken = generateAccessToken(payload, secretAccessKey);

    //generate the access token
    let refreshToken = generateRereshToken(payload, secretRefreshKey);

    if (!accessToken) {
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .send({ msg: "error", error: "failed to generate accessToken" });
      return;
    }
    if (!refreshToken) {
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .send({ msg: "error", error: "failed to generate refreshToken" });
      return;
    }
    res
      .status(http.OK)
      .send({ msg: "user has logged in", accessToken, refreshToken });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};
