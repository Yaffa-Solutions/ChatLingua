const { getUserData } = require("../../models/query/profile");
const { createProfile } = require("../../models/query/profile");
const { updateProfile } = require("../../models/query/profile");

const getProfile = (req, res) => {
  getUserData(req.user.id)
    .then((result) => {
      if (result.rows.length === 0) throw new Error("User Profile Not found");
      res.json({ user: result.rows[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

const postProfile = (req, res) => {
  const { native_language, learning_language } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  createProfile(req.user.id, native_language, learning_language, image)
    .then((result) => {
      if (result.rows.length === 0) throw new Error("User Profile Not found");
      res.json({
        message: "Profile created successfully!",
        user: result.rows[0],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

const putProfile = (req, res) => {
  const { native_language, learning_language } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  updateProfile(native_language, learning_language, image, req.user.id)
    .then((result) => {
      if (result.rows.length === 0) throw new Error("User Profile Not found");
      res.json({
        message: "Profile updated successfully!",
        user: result.rows[0],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
module.exports = { getProfile, postProfile, putProfile };
