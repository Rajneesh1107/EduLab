const { http } = require("../lib/helper/const");

// accessCheck function will create a closure
const accessCheck = (roleArr) => {
  //it is checking if user is "Instructor then he can access"
  return (req, res, next) => {
    try {
      if (roleArr.includes(req.body.role)) {
        next();
      } else {
        // If user role is not match, send an unauthorized error message
        res.status(http.UNAUTHORIZED).send({
          msg: "error",
          error: "you are unauthorised to access this route",
        });
      }
    } catch (error) {
      res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
    }
  };
};

module.exports = accessCheck;
