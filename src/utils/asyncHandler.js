const asyncHandler = (requestrHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestrHandler(req, res, next))
      .catch((err) => next(err));
  }
}

export {asyncHandler}


// OR

//Hiigher order function can accept function as parameter and can return function

// const asyncHandler = (fn) => { () => {} }
// const asyncHandler = (fn) => () => {}


/* const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message
    })
  }
} 

export {asyncHandler} */ 
