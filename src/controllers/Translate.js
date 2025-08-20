const translateMessage = require("../../common/helper")


const getTranslate=(req,res,next)=>{
    const {content, native_language}=req.body
    translateMessage(content,native_language)
    .then(result=> res.status(200).json({data:result}))
    .catch(err=>next(err))
}

module.exports={getTranslate}