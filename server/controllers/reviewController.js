// server/controllers/reviewController.js

const Review = require("../models/Review");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { recipeId, comment } = req.body;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Create new review with the local database user ID
    const newReview = new Review({
      userId: user._id, // Use the MongoDB ObjectId from our database
      recipeId,
      comment,
    });

    // Save review
    const review = await newReview.save();

    // Add review to recipe's reviews array
    recipe.reviews.push(review._id);
    await recipe.save();

    // Populate user data for the response
    const populatedReview = await Review.findById(review._id).populate({
      path: "userId",
      select: "username picture",
    });

    res.json(populatedReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all reviews for a recipe
exports.getReviewsByRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId })
      .sort({ timestamp: -1 })
      .populate({
        path: "userId",
        select: "username picture",
      });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "userId",
      select: "username picture",
    });

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { comment } = req.body;

    // Find review
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Check user owns the review
    if (review.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update review
    review.comment = comment;
    review.timestamp = Date.now();

    await review.save();

    // Populate user data for the response
    const updatedReview = await Review.findById(review._id).populate({
      path: "userId",
      select: "username picture",
    });

    res.json(updatedReview);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Check user owns the review
    if (review.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Remove review reference from recipe
    await Recipe.updateOne(
      { _id: review.recipeId },
      { $pull: { reviews: review._id } }
    );

    // Delete review
    await Review.findByIdAndRemove(req.params.id);

    res.json({ msg: "Review removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Get all reviews by a user
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .populate({
        path: "recipeId",
        select: "recipeName",
      });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
