const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/reg-login");
const multer = require("multer");
const upload = multer();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const salt = 10;

//TESTING ROUTE
router.get("/api/signup", (req, res) => {
    return res.status(200).send("register route Working!!");
})

//ADDING NEW USER
router.post("/signup",
    upload.none(),
    //VALIDATION 
    body("username").not().isEmpty().trim().escape(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }).withMessage("min length of password should be 5")
    , async (req, res) => {
        try {
            //INVOKING EXPRESS-VALIDATOR
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //IF ALREADY IN DB
            const { username, email, password } = req.body;
            const isUserExist = await User.findOne({ email });
            if (isUserExist) {
                return res.status(400).json({
                    message: "user already exist"
                })
            }
            //HASHING PASSWORD
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        mesaage: err.message
                    })
                }
                //INSERTING NEW USER
                const userData = await User.create({
                    username,
                    email,
                    password: hash
                })
                return res.status(200).json({
                    message: "sucess",
                    userData
                })

            });
        } catch (e) {
            return res.status(500).json({
                mesaage: "failed"
            })
        }
    })



module.exports = router;