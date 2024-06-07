// require('dotenv').config({path: './env'})
//OR
import dotenv from 'dotenv';

//dotenv is use to As early possible in your application, import and configure dotenv.

dotenv.config({
  path: './env'
});

//There two to connect backend with MongoDB
//m-1
import connectDB from "./db/index.js";
import {app} from './app.js'
connectDB()
  .then(()=>{
    app.on("ERROR", (error)=>{
      console.log("ERROR: ", error);
      throw error;
    })
    app.listen(process.env.PORT || 8000, ()=> {
      console.log(`server is running at port : ${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });






//m-2

/* 
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express();
( async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error" , (error)=>{
      console.error("Error: ", error);
      throw error;
    })

    app.listen(process.env.PORT , ()=>{
      console.log(`App running on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})() */