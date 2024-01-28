const mongoose = require("mongoose");
const reviews = require("./reviewData.js");
const Reviews = require("../models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/majorproject";

main() .then(() =>{
    console.log("connection successful");
})
 .catch((err) =>{
    console.log(err);
});


async function main() {
    await mongoose.connect(MONGO_URL);
}

const initdb = async ()=>{
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews.reviewData);
    console.log("reviewsData is initialized");
};
initdb();