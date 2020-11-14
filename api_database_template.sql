create schema if not exists db_me_my_app;
use db_me_my_app;

drop table if exists me_locations;
create table me_locations(id int unsigned auto_increment primary key,
uuid varchar(100) not null, name varchar(30) not null, address varchar(255) not null,
last_login_date datetime default null, last_modified_date datetime default null,
is_locked boolean default false, is_active boolean default true, is_deleted boolean default false);
create index i1_me_locations on me_locations(uuid);
create index i2_me_locations on me_locations(name);
create index i3_me_locations on me_locations(location);

drop table if exists auth_token;
create table auth_token(id int unsigned auto_increment primary key,
location_id varchar(100),token varchar(255));
create index i1_auth_token on auth_token(location_id);
create index i2_auth_token on auth_token(token);

drop table if exists user_auth;
create table user_auth(id int unsigned auto_increment primary key,
uuid varchar(100),location_id varchar(100) default null, username varchar(30), password varchar(255),
last_login_date datetime default null, last_modified_date datetime default null,
is_locked boolean default false, is_active boolean default true, is_deleted boolean default false);
create index i1_user_auth on user_auth(uuid);
create index i2_user_auth on user_auth(location_id);
create index i3_user_auth on user_auth(username);
create index i4_user_auth on user_auth(is_locked);
create index i5_user_auth on user_auth(is_active);

drop table if exists user_details;
create table user_details(id int unsigned auto_increment primary key,
uuid varchar(100), name varchar(80), email varchar(100),phone varchar(100));
create index i1_user_details on user_details(uuid);

/* do not forget privileges */
create user if not exists 'me_my_app'@'localhost' identified by 'Agd9Y#7Rm!z';
grant all privileges on db_me_my_app.* to me_my_app@localhost;
