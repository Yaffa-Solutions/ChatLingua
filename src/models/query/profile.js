const pool = require("../../database/connection");
const { CustomError } = require("../../middleware/error");

const getProfileByUserId = (user_id) => {
  return pool.query(
    `SELECT 
    username,
    image,
    native_lang.name as native,
    learning_lang.name as learning
    FROM profiles 
    INNER JOIN users ON profiles.user_id=users.id 
    INNER JOIN languages AS native_lang ON native_lang.id = profiles.native_language_id 
    INNER JOIN languages AS learning_lang ON learning_lang.id = profiles.learning_language_id  
    WHERE user_id=$1`,
    [user_id]
  );
};


const checkIfExistProfile = (user_id) => {
  return pool.query(
    `SELECT EXISTS (
      SELECT 1
      FROM profiles
      WHERE user_id=$1
    )`,
    [user_id]
  );
};

const createProfile = ({
  user_id,
  native_language_id,
  learning_language_id,
  image,
}) => {
  return checkIfExistProfile(user_id)
  .then((result) => {
    if (result.rows[0].exists) {
      throw new CustomError("you have already profile",400);
    }
    return pool.query(
    "INSERT INTO profiles (user_id,native_language_id,learning_language_id,image) values($1,$2,$3,$4) RETURNING user_id",
    [user_id, native_language_id, learning_language_id, image]
  );
  });
};

const updateProfile = ({
  native_language_id,
  learning_language_id,
  image,
  user_id,
}) => {
  return pool.query(
    "UPDATE profiles SET native_language_id=$1,learning_language_id=$2,image=COALESCE($3, image) WHERE user_id=$4 RETURNING user_id",
    [native_language_id, learning_language_id, image, user_id]
  );
};

module.exports = { getProfileByUserId, createProfile, updateProfile };
