BEGIN;
insert into languages (name) values ('Arabic'),('English'),('French'),('Spanish'),('German'),('Turkish'),('Italian');

insert into users(username,password) values('aysha','aysha22'),('nada','nada33');

insert into profiles (user_id,native_language_id,learning_language_id,image) values(1,1,2,null);
insert into profiles (user_id,native_language_id,learning_language_id,image) values(2,2,1,null);
COMMIT;