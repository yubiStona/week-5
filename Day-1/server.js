require('dotenv').config()
const express = require('express');
const jwt =require('jsonwebtoken');
const app = express();
app.use(express.json());

//middleware to veriy jwt
const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        const error = new Error("Authorization token required");
        error.status=401;
        return next(error)
    }

    const decodedData=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(!decodedData){
        const error = new Error('Token is invalid or expired');
        error.status=403;
        return next(error);
    }
    req.user=decodedData;
    next();  
}

//mock user data for testing purpose
const users=[{
    id:1,
    username:"@yubi",
    password:"password123"
}]

app.get('/profile',authenticateToken,(req,res)=>{
    res.json({
        message:"profile accessed successfully",
        user:{
            id:req.user.id,
            username:req.user.username
        }
    });
});

app.post('/login',(req,res,next)=>{
    //user authentication
    const {username,password} = req.body;

    //check user detail matched or not
    const user=users.find(
        usr=> usr.username===username && usr.password===password
    );

    if(!user){
        const error = new Error("Invalid Credentials")
        error.status=401;
        return next(error);
    }

    const accessToken=jwt.sign(
        {
            id:user.id,
            username:user.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1h'} //token will expire in one hour
    )
    res.json({message:"Login successful",accessToken:accessToken});

})

app.use((err,req,res,next)=>{
    const status=err.status || 500;
    res.status(status).json({
        message:err.message
    })

})

app.listen(3000,()=>console.log('server running on port 3000...'));


