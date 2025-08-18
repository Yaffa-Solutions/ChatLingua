const { getProfileByUserId } = require("../models/query/profile");
const { createProfile } = require("../models/query/profile");
const { updateProfile } = require("../models/query/profile");
const { CustomError } = require("../middleware/error");

const getProfile = (req, res, next) => {
  getProfileByUserId(req.user.id)
    .then((result) => {
      if (!result.rowCount)
        throw new CustomError("User Profile Not found", 404);
      res.json({
        user: result.rows[0],
      });
    })
    .catch((err) => {
      next(err);
    });
};

const postProfile = (req, res, next) => {
  const body={user_id :req.user.id,...req.body}
  createProfile(body)
    .then((result) => {
      if (!result.rowCount)
        throw new CustomError(
          "Unable to create profile. Please try again.",
          400
        );
      res.status(201).json({
        message: "Profile created successfully!",
        user: body,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const putProfile = (req, res, next) => {
  const body={user_id :req.user.id,...req.body}
  updateProfile(body)
    .then((result) => {
      if (!result.rows.length)
        throw new CustomError(
          "Unable to update profile. Please try again.",
          400
        );
      res.status(200).json({
        message: "Profile updated successfully!",
        user: body,
      });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getProfile, postProfile, putProfile };
