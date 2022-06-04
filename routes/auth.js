const express = require('express')
const User = require('../models/User.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchuser');

const router = express.Router()

const JWT_SECRET = 'an$ab_fahad_a$fand_ba$it_skinnoir_final_project'
const SALT_NUMBER = 10

// Route 1: register with a POST api

router.post('/register', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 6 characters').isLength({ min: 6 })
], async (req, res) => {  
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()})

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(409).json({ error: "Sorry a user with this email already exists" })

        const salt = await bcrypt.genSalt(SALT_NUMBER);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        return res.status(201).json({ authToken })
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
})


router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(200).json({ authToken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});


router.post('/getuser', fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})




module.exports = router, JWT_SECRET