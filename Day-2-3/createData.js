const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['user','admin'],
        default:'user',
        required:true,
    }
},{timestamps:true});

const User=mongoose.model('User',userSchema);

const mockUsers = [
    { username: 'adminUser', password: 'securePass123', role: 'admin' },
    { username: 'regularUser1', password: 'userPass123', role: 'user' },
    { username: 'regularUser2', password: 'userPass456', role: 'user' }
];

//function to insert data 
async function insertData(){
    try{
        await mongoose.connect('mongodb://localhost:27017/userDB');
        console.log("MongoDB connected.....");

        await User.insertMany(mockUsers);
        console.log('mock users inserted sucessfully');
    }catch(err){
        console.log('Error inserting data',err);
    }finally{
        mongoose.connection.close();
    }
}

insertData();