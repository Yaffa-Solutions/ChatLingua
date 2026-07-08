BEGIN;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_profiles;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL
);

CREATE TABLE languages(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,  
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    native_language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE, 
    learning_language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE, 
    image TEXT
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY, 
    name TEXT
);

CREATE TABLE chat_profiles(
    id SERIAL PRIMARY KEY,  
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE, 
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    deleted_by boolean DEFAULT false,
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT uq_profile_chat UNIQUE(profile_id,chat_id)
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,  
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE, 
    content TEXT, 
    sender_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE, 
    receiver_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_for integer[] default '{}'
);

COMMIT;
