require("dotenv").config({ silent: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//hashedPassword function is used to hashed the
const saltRounds = process.env.SALT_ROUND;
exports.hashedPassword = (myPlaintextPassword, saltRound = saltRounds) => {
  console.log();
  const hash = bcrypt.hashSync(myPlaintextPassword, +saltRound);
  return hash;
};

//compare function is for comparing for hashed password;
exports.comparePassword = (myPlaintextPassword, hashedPassword) => {
  const isCorrect = bcrypt.compareSync(myPlaintextPassword, hashedPassword);
  return isCorrect;
};

//password validation fucntion
exports.validatePassword = (password) => {
  if (password.trim().length < 8) {
    return false;
  }

  //check Password has contain upperCase character;

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  //check Password has contain lowerCase character;
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // check Password has contain numerial character;
  if (!/[0-9]/.test(password)) {
    return false;
  }

  //check password has contain special character
  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  `if password length is greater than or equal to 8 and 
   password contain upperCase,lowerCase, numeric and special characters then  
   return true;
  `;
  return true;
};

// generate token if user has successfully logged in;
const secretKey = process.env.SECRETKEY;
exports.generateToken = (payload, secret = secretKey) => {
  // Options for the token
  const options = {
    expiresIn: "1d", // Token will expire in 2 hours
  };

  // Generate the token
  const token = jwt.sign(payload, secret, options);

  return token;
};

//verify access token
exports.verifyToken = (token, secretKey) => {
  try {
    let decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return error;
  }
};
