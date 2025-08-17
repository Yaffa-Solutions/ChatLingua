const connection = require("../../database/connection")


const userLogin =(username , password)=>{
   return connection.query(`select * from users where username=$1 and password=$2`,[username , password]);
}

module.exports=userLogin;