const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../../middleware/auth");
const upload = require("../../middleware/upload-image");
const { getProfile } = require("../controllers/user");
const { postProfile } = require("../controllers/user");
const { putProfile } = require("../controllers/user");

router.get("/profile",authenticateToken ,getProfile);
router.post("/profile",authenticateToken,upload.single('image'),postProfile);
router.put("/profile",authenticateToken,upload.single('image'),putProfile)
module.exports = router;
