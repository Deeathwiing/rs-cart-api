create extension if not exists "uuid-ossp"

create database andrei_karotkin

create table if not exists carts (
id uuid primary key not null default uuid_generate_V4(),
created_at date not null default CURRENT_DATE,
updated_at date not null
)

create table if not exists cart_items (
cart_id uuid not null,
foreign key ("cart_id") references "carts" ("id"),
product_id uuid not null,
title text not null,
description text not null,
price integer not null,
count integer not null
)


insert into carts (updated_at) values (CURRENT_DATE)