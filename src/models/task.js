const mongoose = require('mongoose');

const Task = mongoose.model('Task',{
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
});

//here ref is for reference with other model and 'User' is same which
// we have given in mongoose.model('User',userSchema)
module.exports = Task;