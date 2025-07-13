const mongoose = require('mongoose');
// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  age: {
    type: Number,
    required: true,
    min: 0 
  }
});
// Model
const User = mongoose.model('User', userSchema);
module.exports = User;
