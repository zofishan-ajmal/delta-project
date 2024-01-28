if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require ("path");
const mehtodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routs/listing.js");
const reviewRouter = require("./routs/review.js");
const userRouter = require("./routs/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(mehtodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbURL = process.env.ATLASDB_URL;
main() .then(() =>{
    console.log("connection successful");
})
 .catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbURL);
}

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24 * 3600,
});
store.on("err", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized :true,
    cookie:{
     expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
     maxAge : 7 * 24 * 60 * 60 * 1000,
     httpOnly : true,
    } ,
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currentUser =req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// --------- middle ware rout on all pages that not exists in database--------
app.all("*",(req,res,next) =>{
    next(new expressError(404,"Page not Found!"));
});
// ----------- error handling middlewares-----------
app.use((err,req,res,next) =>{
    let {statusCode= 500 ,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});
// localhost server rout
app.listen(8080 , () =>{
    console.log("port 8080 is listening")
});



















