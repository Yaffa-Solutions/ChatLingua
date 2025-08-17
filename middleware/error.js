const errorHandler =(err , req , res , next)=>{
    res.status(err.status||500).json({message:err.message , success:false});
}

module.exports = errorHandler;