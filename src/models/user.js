const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//const User = mongoose.model('collection',schema) 
/**
 * we need to do operation on schema orignally mongoose handled itself 
 * that's why we didnot do the work new mongoose.Schema()
 * but for hashing password we need to do it
 */

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        unique:true,
        validator(value){
            if(!validator.isEmail(value)) //this is validator
            {
                throw new Error('Invalid email type')
            }
        }
    },
    age:{
        type:Number,
        default: 0,
        validate(value) //this is mongoose function
        {
            if(value < 0)
            {
                throw new Error('Age is negative');
            }
        }
    },
    password:{
        required: true,
        type:String,
        trim:true,
        validate(value){
            if(value.length < 6)
            {
                throw new Error('Password should be more than 6 characters')
            }
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password should not contain password text')
            }
        }
    },
    tokens:[
        {
            tokens:{
                type:String,
                required:true
            }
        }
    ]
})

//getPublicProfile as toJSON //help to hide private data
userSchema.methods.toJSON = function(){
    const ourUser = this;
    //now we will convert it to object
    const userObject = ourUser.toObject();
     //delete the private data
     delete userObject.password
     delete userObject.tokens;
     return userObject;
}

//virtual reference link with task
userSchema.virtual('userTask',{
    ref:'Task', //the Task collection
    localField: '_id',
    foreignField: 'owner'
})
//creating method on instance
userSchema.methods.generateAuthToken = async function()
{
    const reqUser = this;
    const token =  jwt.sign({_id:reqUser._id.toString()},'This is a testing secret'); //second prameter lwys need to be string
    //save the token in database, 1st append then save
    reqUser.tokens = reqUser.tokens.concat({tokens:token});
    await reqUser.save();
    return token;


}
//login feature check attaching static function
userSchema.statics.findByCredentials = async(email,password)=>{
    
   
        const enter_user = await User.findOne({email});
    
        if(!enter_user)
        {
            //console.log("email error");
            throw new Error("Unable to login- email");
    
        }
        const isMatchCredential = await bcrypt.compare(password,enter_user.password);
        if(!isMatchCredential){
            //console.log("password error");
            throw new Error("Unable to login- password");
        }
        //console.log(enter_user);
        return enter_user;
    
   
}
//creating method to hide private data
userSchema.methods.getPublicProfile = function(){
    const ourUser = this;
    //now we will convert it to object
    const userObject = ourUser.toObject();
     //delete the private data
     delete userObject.password
     delete userObject.tokens;
     return userObject;
}




//this pre need to execute before save i.e insert and update of user
userSchema.pre('save', async function(next){ //we need to bind so no arrow operator
    const cur_user =this;
    //console.log('before saving')
    if(cur_user.isModified('password')) //password is modifying or not means in body password is present or not
    {
        //console.log('password hash');
        cur_user.password =  await bcrypt.hash(cur_user.password,8)
    }    
    next();
})

//when user deletd themself, their task should also get deleted
userSchema.pre('remove',async function(next){
    const cur_user = this;
    const a = await Task.deleteMany({owner:cur_user._id});
    //console.log(a);
    next();

})
const User = mongoose.model('User',userSchema)



module.exports = User;