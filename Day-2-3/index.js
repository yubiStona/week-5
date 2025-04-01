    require('dotenv').config();
    const express = require('express');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const mongoose = require('mongoose');
    const User=require('./models/User');
    const helmet = require('helmet');
    const rateLimit=require('express-rate-limit');
    const csrf=require('csurf');
    const cookieParser = require('cookie-parser');
    const app =  express();     

    // Apply Helmet for security headers
    app.use(helmet());

    //applying rate limiter
    let limiter=rateLimit({
        max:100,
        windowMs:2*60*1000,
        message:'Too many request please try again after 2 minutes'
    })
    app.use(limiter);   
    app.use(express.json());
    app.use(cookieParser());//this add the cookie parser

    //CSRF protection
    const csrfProtection=csrf({
        cookie:true,
        ignoreMethods:['GET','HEAD','OPTIONS']
    });



    //middleware to authenticate token
    const authenticateToken=(req,res,next)=>{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        
        try {
            const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedData;
            next();
        } catch (err) {
            // Handle specific JWT errors
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Please provide a valid token.' });
            } else {
                return res.status(401).json({ message: 'Authentication failed.' });
            }
        }
    }

    const authorizedRole=(role)=>(req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).json({message:'access denied,you are unauthorized!'})
        }
        next();
    }

    //route to get csrf token
    app.get('/csrf-token',csrfProtection,(req,res)=>{
        res.json({csrfToken:req.csrfToken()});
    })

    //applying csrf protection i    n register route
    app.post('/register',csrfProtection,async (req,res)=>{
        try{
            const {username,password,role}=req.body;
            const user= new User({username,password,role});
            await user.save();
            res.status(201).json({message:'user registered successfully'});
        }catch(error){
            res.status(500).json({message:'failed to register user',error});
        }
    });


    //login route
    app.post('/login',async (req,res)=>{
        const {username,password}=req.body;
        const user= await User.findOne({username});
        if(!user){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'invalid credentials'});
        }

        const accessToken=jwt.sign(
            {
                id:user.id,
                username:user.username,
                role:user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'1h'}
        )

        res.json({message:'login successful',token:accessToken});
    })

    app.get('/admin',authenticateToken,authorizedRole('admin'),csrfProtection,(req,res)=>{
        res.json({message:'welcome to admin profile'});
    })
    app.get('/profile',authenticateToken,(req,res)=>{
        res.json({message:'welcome to user profile'});
    })

    app.post('/update-profile',authenticateToken,csrfProtection,(req,res)=>{
        res.json({message:'profile updated successfully'});
    })

    // Error handler for CSRF errors
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            return res.status(403).json({ message: 'CSRF token validation failed' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    });


    app.listen(3000,()=>console.log('Server running on port 3000'));
    //connect to database
    mongoose.connect('mongodb://loca    lhost:27017/userDB')
    .then(()=>console.log('database connected'))
    .catch(()=>console.log('Error connecting database'))


