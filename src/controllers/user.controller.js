import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

import { ApiResponse } from '../utils/ApiResponse.js';
//User is created by mongoose with the help of User we can connect with DB

/* 
for resister user 
step-1 get user details frrom frontend or postmen
step-2 apply validation and check input field are shouldn't empty
step-3 check if user already exist by: username or email
step-4 check for images and check for avatar
step-5 upload them on cloudinary, avatar
step-6 make object of user details for creat entry in DB
step-7 remove password and refresh token field from response
step-8 check for user creation or response didnt come
step-9 return response
*/
const registerUser = asyncHandler(async (req, res) => {

  const {username, fullname, email, password } = req.body;
  console.log(username, fullname);


  //apply validation and check input field are shouldn't empty
  if(
    [username, fullname, email, password].some((field)=>{
      field?.trim()===""
    })
  ) {
    throw new ApiError(400, "All fields is required");
  }

  // yadi DB me username ya email dono me se koi bhi pehele se h to message send karna hai ki already exist 
  // $or: [{ username },{ email }]   iski help se check kar sakte hai


  //check if user already exist by: username or email
  const existedUSer = User.findOne({
    $or: [{ username },{ email }]
  })
  if(existedUSer){
    throw new ApiError(409, "User with username or email already exist");
  }


  //check for images and check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log(req.files); // for learn

  if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar files is required");
  }


  // upload them on cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check avatar is upload on cloudinary or not
  if(!avatar){
    throw new ApiError(400, "Avatar file is required");
  }


  // carete an object of user details for creat entry in DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  //select ke andar ham vo element dete hai jo DB me nahi bhejna
  if(createdUser){
    //galti server ki hai ki server create nahi kar paya user
    throw new ApiError(501, "Somethong went erong while resisterin user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Resistered Successfully")
  )

})

export { registerUser }