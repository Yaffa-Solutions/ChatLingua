const {
  getProfileByUserId,
  createProfile,
  updateProfile,
} = require("../models/query/profile");
const { CustomError } = require("../middleware/error");
const profileSchema = require("../../common/validations/profile");

const getProfile = (req, res, next) => {
  getProfileByUserId(req.user.id)
    .then((result) => {
      if (!result.rowCount)
        throw new CustomError("User Profile Not found", 404);
      res.json({
        data: result.rows[0],
      });
    })
    .catch((err) => {
      next(err);
    });
};

const postProfile = (req, res, next) => {
  const body = { user_id: req.user.id, ...req.body };

  profileSchema
    .validateAsync(req.body)
    .then((result) => {
      return createProfile(body);
    })
    .then((result) => {
      if (!result.rowCount)
        throw new CustomError(
          "Unable to create profile. Please try again.",
          409
        );
      res.status(201).json({
        message: "Profile created successfully!",
        data: body,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const putProfile = (req, res, next) => {
  const body = { user_id: req.user.id, ...req.body };
  profileSchema
    .validateAsync(req.body)
    .then((result) => {
      console.log({ result });
      return updateProfile(body);
    })
    .then((result) => {
      if (!result.rows.length)
        throw new CustomError(
          "Unable to update profile. Please try again.",
          409
        );
      res.status(200).json({
        message: "Profile updated successfully!",
        data: body,
      });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getProfile, postProfile, putProfile };
