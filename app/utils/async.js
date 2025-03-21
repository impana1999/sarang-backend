const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;

// module.exports = (fs)=>{
//   return(req, res, next)=>{
//     fs(req, res, next).then(()=>{}).catch(err=> next(err))
//   }
// }