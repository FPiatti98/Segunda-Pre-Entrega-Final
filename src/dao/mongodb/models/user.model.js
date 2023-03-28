import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type: String,
        unique: true
    },
    age:Number,
    role:String,
    password:String 
})

export const userModel = mongoose.model(userCollection, userSchema);