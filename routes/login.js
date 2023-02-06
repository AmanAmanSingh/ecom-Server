const express = require("express");
const router = express.Router();
const User = require("../models/reg-login")
const multer = require("multer");
const upload = multer();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const salt = 10;
//TESTING ROUTE
router.get("/api/login", (req, res) => {
    return res.send("LOGIN Route working!!")
})

router.post("/login", upload.none(), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                message: "User Not Exist"
            })
        }
        let Token;
        bcrypt.compare(password, userData.password, async function (err, result) {
            if (err) {
                return res.status(400).json({
                    message: " incorrect password"
                })
            }
            if (result) {
                Token = await jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: userData.id
                }, process.env.SECRET_KEY);
                return res.status(200).json({
                    message: "Login Successfully",
                    userData,
                    Token
                })
            } else {
                return res.status(400).json({
                    message: "failed"
                })
            }

        });
    } catch (e) {
        return res.status(400).json({
            message: "failed"
        })
    }

})

//FIND ALL USERS
router.get("/users/data", async (req, res) => {
    const userData = await User.find();
    return res.status(200).json({
        userData
    })
})
//UPDATE EXISTING USER
router.put("/update", upload.none(), async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userData = await User.find();
        if (!userData) {
            return res.status(400).json({
                message: "user not exist"
            })
        }

        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) {
                return res.status(400).json({
                    mesaage: err.message
                })
            }
            //UPDATING USER CREDENTIALS
            const updateUser = await User.updateOne({ email }, { username: req.body.username, password: hash })
            return res.status(200).json({
                message: "sucess",
            })
        })

    } catch (e) {
        return res.status(500).json({
            mesaage: "failed"
        })
    }

})

//DELETING EXISTING USER
router.delete("/delete", upload.none(), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                message: "user not exist"
            })
        }
        const deletedUser = await User.deleteOne({ email });
        return res.status(200).json({
            message: "sucess",
            deletedUser
        })
    } catch (e) {
        return res.status(500).json({
            mesaage: "failed"
        })
    }
})



module.exports = router; 