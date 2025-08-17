const {userLoginSchema} = require('../../common/validations/userLogin');
const {getUser} = require('../models/query/user');
const { comparePassword } = require('../../common/compare/comparePassword');
const { createToken } = require('../../common/jwt/sign');



/*
get the response , 
validate response 
get the user by username 
compare the password , 
generate the token 
return response 
error handling 
*/
////front , back , database 

// try {
// const value = await schema.validateAsync( {username: 'abc',
// birth_year: 1994 });

// }catch (err) {}

  


const Login =(req, res , next)=>{
    const {body} = req;
    userLoginSchema.validateAsync(body).then(({username})=>{
        console.log('username',username);
      return  getUser(username);
    }).then((user)=>{
        console.log(user);
        return comparePassword(req.body.password,user.password);
    }).then((result)=>{
        if(!result){
            throw new Error('incorrect password ');
        } 

        console.log('result --------------------');
        console.log(req.body);
        return createToken(req.body);
    }).then((token)=>{
        res.status(200).json({message:'user logged in successfully ' , data:req.body , token});
    }).catch(err=>{next(err)});

}

module.exports ={Login};