const userLogin=require('../../models/query/user');
const jwt =require('jsonwebtoken');
const {app} = require('../../config');

const loginController=({body:{username,password}}, res, next)=>{

    console.log(username,password);
    userLogin(username , password).then(({rows , rowCount}) => {
        if(!rowCount){
            throw new Error(res.status(401).json({message:'unauthorized --> invalid username or password' , success:false , status:401}));
        }
        const user=rows[0];
        console.log('rowwwwwwwws',user);
        const { password , ...rest}=user;
        console.log('resttttt',rest);

        console.log(app.jwtSecret);
        const jwtToken=jwt.sign( { id: user.id, username: user.username }, app.jwtSecret,{expiresIn:'1h'});
        
        res.status(200).json({message:"Login success",success:true , status:200 , data:{user:rest , token:jwtToken}});
    }).catch((err) => {
        next(err);
    });   
}

module.exports =loginController;