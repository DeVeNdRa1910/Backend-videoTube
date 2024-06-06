import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

app.use(express.json({limit: "16kb"})); // accept json data come from DB

app.use(express.urlencoded({extended: true, limit: "16kb"})); //read data from url

app.use(express.static("public")); // store general things(photo , video) in public folder

app.use(cookieParser()); // give a cookie to user Browser

export { app }