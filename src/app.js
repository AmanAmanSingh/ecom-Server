const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");
const cors = require("cors")
//ALL ROUTES
const registerRoute = require("../routes/register");
const LoginRoute = require("../routes/login")

//MONGOOSE CONNECTION
mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.DATABASE_URI}`, () => {
    console.log("mongo connected sucessfully")
}, (err) => {
    console.log(err.message)
})

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//AUTHENTICATION
app.use(async (req, res, next) => {
    if (req.url == "/login" || req.url == "/signup") {
        next();
    } else {
        const Token = req.headers.authorization;
        await jwt.verify(Token, process.env.SECRET_KEY, async (err, decode) => {
            if (err) {
                return res.status(400).json({
                    message: "Token expired"
                })
            }
            req.user = decode.data;
            next();
        })
    }
})

//TESTING ROUTE
app.get("/", (req, res) => {
    res.send("APP ROUTE WORKING!!!")
})


app.use("/", registerRoute);
app.use("/", LoginRoute)
app.listen(process.env.PORT, () => { console.log(`server started at ${process.env.PORT}`) })