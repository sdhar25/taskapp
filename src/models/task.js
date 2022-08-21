const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
},{ timestamps: true});
const Task = mongoose.model('Task',taskSchema);

//here ref is for reference with other model and 'User' is same which
// we have given in mongoose.model('User',userSchema)
module.exports = Task;