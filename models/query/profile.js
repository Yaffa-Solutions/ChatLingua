const pool = require("../../database/connection");

const getUserData = (user_id) => {
  return pool.query(
    "SELECT username,image,native_lang.name as native,learning_lang.name as learning FROM profiles INNER JOIN users ON profiles.user_id=users.id INNER JOIN languages AS native_lang ON native_lang.id = profiles.native_language_id INNER JOIN languages AS learning_lang ON learning_lang.id = profiles.learning_language_id  WHERE user_id=$1",
    [user_id]
  );
};

const getLanguageId = (language) => {
  return pool.query("SELECT id FROM languages WHERE name=$1", [language]);
};

const createProfile = (user_id, native_language, learning_language, image) => {
  let learn_langauge_id = 0;
  let native_language_id = 0;
  return getLanguageId(learning_language)
    .then((result) => {
      learn_langauge_id = result.rows[0].id;
      return getLanguageId(native_language);
    })
    .then((result) => {
      native_language_id = result.rows[0].id;
      return pool.query(
        "INSERT INTO profiles (user_id,native_language_id,learning_language_id,image) values($1,$2,$3,$4) RETURNING user_id",
        [user_id, native_language_id, learn_langauge_id, image]
      );
    });
};

const updateProfile = (native_language, learning_language, image,user_id) => {
  let learn_langauge_id = 0;
  let native_language_id = 0;
  return getLanguageId(learning_language)
    .then((result) => {
      learn_langauge_id = result.rows[0].id;
      return getLanguageId(native_language);
    })
    .then((result) => {
      native_language_id = result.rows[0].id;
      return pool.query(
        "UPDATE profiles SET native_language_id=$1,learning_language_id=$2,image=COALESCE($3, image) WHERE user_id=$4 RETURNING user_id",
        [native_language_id, learn_langauge_id, image,user_id]
      );
    });
};

module.exports = { getUserData, createProfile,updateProfile };
