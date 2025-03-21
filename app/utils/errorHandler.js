module.exports = (err, req, res)=>{
    err.status = false
    err.statusCode = err.status || 500
    return res.status(err.statusCode).send({status:err.status, message:err.message})

}

// module.exports = (err, req, res,next) => {
//     // If status is not already defined in the error object, set it to 500
//     err.status = false
//     err.status = err.status || 500;
//     return res.status(err.status).send({ status: err.status, message: err.message });
// };