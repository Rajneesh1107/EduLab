require("dotenv").config({ silent: true });
const { verifyAccessToken } = require("../lib/helper/common");
const { http } = require("../lib/helper/const");
const Instructor = require("../models/instructor.model");
const Student = require("../models/student.model");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(http.BAD_REQUEST).send({
        msg: "error",
        error: "Please send access token",
      });
    }

    const instructorSecretKey = process.env.SECRET_ACCESS_KEY_INTRUCTOR;
    const studentSecretKey = process.env.SECRET_ACCESS_KEY_STUDENTS;
    if (!instructorSecretKey && !studentSecretKey) {
      return res.status(http.BAD_REQUEST).send({
        msg: "error",
        error: "Please check your secret key configuration",
      });
    }

    // Verify the token with instructor secret key first
    let decoded;
    decoded = verifyAccessToken(token, instructorSecretKey);

    // If not decoded, try with student secret key
    if (!decoded) {
      decoded = verifyAccessToken(token, studentSecretKey);
    }

    if (!decoded) {
      return res.status(http.UNAUTHORIZED).send({
        msg: "error",
        error: "Token is invalid, please login again!",
      });
    }

    // Check if the user exists in Student collection first
    let user = await Student.findOne(decoded._id);

    // If not found in Student collection, check Instructor collection
    if (!user) {
      user = await Instructor.findOne(decoded._id);
    }

    // If user not found in both collections, throw an error
    if (!user) {
      return res.status(http.UNAUTHORIZED).send({
        msg: "error",
        error: "User is not authorized to access this route",
      });
    }

    // If the user exists, attach user details to the request object

    req.body.userId = decoded.userId;
    console.log(req.body.userId);
    req.body.email = decoded.email;
    req.body.role = decoded.role;

    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};

module.exports = auth;
