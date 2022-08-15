const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/taskapp_1').catch((err)=>{
    console.log(err)
});


// learning.save().then(()=>console.log(learning))
// .catch((err)=>console.log(err));