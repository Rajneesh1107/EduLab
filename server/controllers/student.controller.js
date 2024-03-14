const Student = require("../models/student.model");
const { http } = require("../lib/helper/const");
const {
  hashedPassword,
  validatePassword,
  generateToken,
} = require("../lib/helper/common");

//get all students data, only student name and
exports.getAllStudents = async (req, res) => {
  try {
    let students = await Student.find(
      {},
      { firstName: 1, lastName: 1, coursesEnrolled: 1 }
    );

    res
      .status(http.OK)
      .send({ msg: "Success", totalStudents: students.length, students });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "Error", error });
  }
};

//register a new student
exports.registerStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    let isExistStudent = await Student.findOne({ email });

    //check student is already register or not
    if (isExistStudent) {
      res.status(http.CONFLICT).send({
        msg: "error",
        error: `Student with the email ${email} already registered.`,
      });
    }
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
      console.log(studentDetails);
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
    if (!studentDetails) {
      res
        .status(http.NOT_FOUND)
        .send({ msg: "error", error: "this email is not registered" });
    }
    const { _id, firstName, lastName, role } = studentDetails;
    const payload = {
      userId: _id,
      username: `${firstName} ${lastName}`,
      role: role,
    };

    let token = generateToken(payload);
  } catch (error) {}
};
