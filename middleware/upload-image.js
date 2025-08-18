const multer = require("multer");
const path = require("path");

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
    
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
  }
};

const upload=multer({storage,fileFilter})

module.exports=upload