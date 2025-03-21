const userSchema=require('../models/usermaster')
const adminmodel=require('../models/admin')

const validUserMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;
  try {
    user = await userSchema.findById(req.user.id) 
    if (!user ) {
      return res.status(400).send({ Status: false, message:  'Session expired! Please log in to continue'})
    }
    
    return next();
  } catch (error) {
    return res.status(400).send({ Status: false, message:  'Internal Server Error'})
  }
};
const validadminMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;
  try {
    user = await adminmodel.findById(req.user.id) 

console.log(user)
    if (!user ) {
      return res.status(400).send({ Status: false, message:  'Session expired! Please log in to continue'})
    }
    
    return next();
  } catch (error) {
    return res.status(400).send({ Status: false, message:  'Internal Server Error'})
  }
};

const validTempUserMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;

  if (reqMethod !== 'GET') {
    try {
      user = await userSchema.findById(req.user.id);
      
      if (user && user.isSuspended) {
        return res.status(400).send({ Status: false, message:  'Your account is suspended!'})
      }
      return next();
    } catch (error) {
      return res.status(400).send({ Status: false, message:  'Internal Server Error'})
    }
  }
  
  return next();
};

module.exports = {
  validUserMiddleware,
  validTempUserMiddleware,
  validadminMiddleware,
};
