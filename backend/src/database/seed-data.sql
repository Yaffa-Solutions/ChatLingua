BEGIN;
insert into languages (name) values ('Arabic'),('English'),('French'),('Spanish'),('German'),('Turkish'),('Italian')
on conflict (name) do nothing;

COMMIT;