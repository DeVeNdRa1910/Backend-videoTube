import mongoose , { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email : {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname : {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // we will use cloudinary
      required: true,
    },
    coverImage: {
      type: String, // we will use cloudinary
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String, // after decrypt
      requiredL: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  } 
);

//Pre middleware functions are executed one after another, when each middleware calls next. 
// Learn -> https://mongoosejs.com/docs/middleware.html#pre
// operation(save, remove, validate, updateOne, deleteOne) se pehle kuchh karna ho like password ko incrypt karna.... then we use pre()
userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function (password){
  await bcrypt.compare(password, this.password)
}

// this is fast so no need to use async await
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
};

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
};


export const User = mongoose.model("User", userSchema);