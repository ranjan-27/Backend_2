// this is route for the login credentials.
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const AuthUser=require('../models/authUser');
const jwt=require('jsonwebtoken');

//we send data to server to check valid or not so we use post method

//register (FIRST THE USER REGISTER) 
router.post('/register',async (req,res)=>{
    const {email,password,role}=req.body;

    if(!email || !password) return res.status(400).json({msg:'enter email and password'});
    // we re not taking role here bcz in schema already defines role is either user and admin  
    try{
    const existing=await AuthUser.findOne({email})
    if(existing) return res.status(400).json({msg:'user already exists'});

     const hashed = await bcrypt.hash(password, 10);

    const newUser=new AuthUser({email,password:hashed,role});
    await newUser.save();
        return res.status(201).json({msg:'user registered successfully'});
    }catch(e){
        return res.status(500).json({msg: 'Server error', error: e.message})
    }
})
//Use JWT to create and verify tokens
//login (User have their email and password login store in database just match and move forward)


 router.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    const user=await AuthUser.findOne({email});
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    //whether password is not match 
    const match=await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({ msg: 'Invalid credentials' });
    //whether password is  match then backend genrates a token using jwt
    const token=jwt.sign(  // it creates a token
        // now i will give him a pass 
        {id:user._id,email:user.email,role:user.role}, //payload
        process.env.JWT_SECRET, //secret key (From .env file)
        {expiresIn:'1h'} //options
    );
    res.json({token}); 
 })
 module.exports=router;