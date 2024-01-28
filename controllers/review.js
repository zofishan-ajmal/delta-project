const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let review = new Reviews(req.body.review);
    review.author = req.user._id;
    console.log(review.author);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "your review has added");
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.reviewDelete = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review has deleted");
    res.redirect(`/listings/${id}`);
  };