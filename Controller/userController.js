
const User = require('../Models/UserModel');
const validate = require('../Validators/user_validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


exports.Create_User = async (req, res) => {

  // Check This User is already create ? ---->>
  const existUser = await User.findOne({ User_email: req.body.User_email })
  if (existUser) {
    return res.status(400).json({ 'User_email': `(${req.body.User_email})  already exist` })
  }
  // Check This User is already create ? <<----

  // Check All Input value are valid     ---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  // Check All Input value are valid   <<----

  // Generate Hash Password >>---->
  const hashedPassword = await bcrypt.hash(req.body.User_password, 5);
  // Generate Hash Password  <-----<<


  // Destructure Data From Request.body >>---->
  const userData = {
    User_name: req.body.User_name,
    User_phone: req.body.User_phone,
    User_email: req.body.User_email,
    User_password: hashedPassword,
    User_role: 'user',
    User_company_id: null,
    User_status: 'Active'
  }
  // Destructure Data From Request.body <-----<<

  try {
    // Save this User to database      ---->>
    const user = await User.create(userData)
    res.send(user)
    // Save this User to database     <<-----
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};

//Get All users >>---->
exports.All_user = async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};
//Get All users <-----<<


//Update user >>---->
exports.Update_User = async (req, res) => {
  const filter = {
    _id: req.body._id
  }

  // Generate Hash Password >>---->
  const hashedPassword = await bcrypt.hash(req.body.User_password, 5);
  // Generate Hash Password  <-----<<

  // Destructure Data From Request.body >>---->
  const update = {
    User_name: req.body.User_name,
    User_phone: req.body.User_phone,
    User_email: req.body.User_email,
    User_role: req.body.User_role,
    User_company_id: req.body.User_company_id,
    User_status: req.body.User_status,
    User_password: hashedPassword
  }
  // Destructure Data From Request.body <-----<<

  // Save Updated Data >>---->
  try {
    let user = await User.findOneAndUpdate(filter, update, { new: true });
    res.send(user)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};
//Update user <-----<<


// Delete User By Id >>---->
exports.Delete_User = async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(user);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};
// Delete User By Id <-----<<



exports.User_login = async (req, res) => {
  console.log(req.body);
  const pass = req.body.User_password
  const User_email = req.body.User_email
  const user = await User.findOne({ User_email })

  if (user) {
    const isValid = await bcrypt.compare(pass, user.User_password)
    if (isValid) {
      const user_data = {
        User_name: user.User_name,
        User_id: user._id,
        User_role: user.User_role,
        User_company_id: user.User_company_id
      }


      // Generate Token  >>------>
      const access_token = jwt.sign({
        User_name: user.User_name,
        User_id: user._id,
        User_role: user.User_role,
        User_company_id: user.User_company_id
      }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      return res
        .cookie("access_token", access_token, {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .send({ user_data, access_token })

    } else {
      res.status(403).json('Authentication Failed1')
    }
  } else {
    res.status(403).json('Authentication Failed')
  }
}


exports.User_logout = async (req, res) => {
  res.clearCookie("access_token");
  res.end()
}
exports.User_Check_log = async (req, res) => {
  res.status(200)
    .json(req.token);

}