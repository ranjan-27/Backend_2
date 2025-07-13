// in this project we are not using hardcoded url 
//we are using dotenv
const dotenv = require('dotenv');dotenv.config(); 
const express = require('express');
const app = express();
const User = require('./models/users'); 
const mongoose = require('mongoose');
const validator = require('validator');

const authRoutes=require('./routes/auth');
const auth=require('./middleware/auth');

const PORT = process.env.PORT || 7896;

// MongoDB connection
mongoose.connect(process.env.DB_URI, {
   useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
//middlewear
app.use(express.json());
app.use('/api/auth',authRoutes);
// POST /u – Create a user
app.post('/u', auth,async (req, res) => {
  const { name, email, age } = req.body;
  if (!name) return res.status(400).send({ error: "Name is required" });
  if (!email || !validator.isEmail(email)) return res.status(400).send({ error: "Valid email is required" });
  if (!age) return res.status(400).send({ error: "Age is required" });

  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch(error) {
  console.error("Error found:", error);
  if (error.code === 11000) {
    return res.status(400).json({ error: "Email already exists" });
  }
  return res.status(500).json({ error: "Internal Server Error", details: error.message });
}
    
});
//read user

app.get('/users/:id',auth,async (req,res)=>{
    const {id} = req.params;
    try{
      const user= await User.findById(id);  
       if (!user) return res.status(404).json({ error: "User not found" });
        return res.status(200).json(user);
    }catch(error){
      console.error("error found",error);
       return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})
//update user
app.put('/up/:id',auth,async (req,res)=>{
    const { id }=req.params;
     const { name, email, age } = req.body;
    const user=await User.findById(id);
     if (!user) return res.status(404).json({ error: "User not found" });
     if(!email && validator.isEmail(email)){
            return res.status(400).json({ error: "Invalid email format" });
     }
      if (age != null && age < 0) {
      return res.status(400).json({ error: "Age must be non-negative" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, age },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);

  }   
)
//delete user

app.delete('/del/:id',auth,async (req,res)=>{
  const { id }=req.params;
  const user=await User.findById(id);
  if(!user){
    return res.status(404).json({error: "user not found "})
  }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
})


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
