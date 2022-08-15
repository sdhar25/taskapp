const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
// without middleware => new request ->run route handler
// with middleware => new request -> do something -> run route handler

//registering our middleware
// app.use((req,res,next)=>{
//     console.log(req.method,req.url);
//     next();
// })

// task -  setup middleware for maintenance
//if we register here it will run for all route we want authentication in selected routes
// app.use((req,res,next)=>{
   
//         res.status(503).send('Maintenance mode');
    
// })

//our own middleware should be in first
app.use(express.json());
app.use(userRouter); //register
app.use(taskRouter);//register
const port = process.env.PORT || 3000;




app.listen(port,()=>{
    console.log('listening at- '+port);
})
//playing with bcrypt
// const bcrypt = require('bcrypt')
// const myFunct = async ()=>{
//     const pass = "123456";
//     const cp = await bcrypt.hash(pass,8);
//     console.log(cp);
//     console.log(pass)

//     const isMatch = await bcrypt.compare('123456789',cp);
//     console.log(isMatch);
// }
// myFunct()

//playing with jwt
// const jwt = require('jsonwebtoken');
// const tokencheckFunc =()=>{
//    //const the_secretVal = jwt.sign({_id:'abc123'},'This is a testing secret');
//    //with expiration
//    const the_secretVal = jwt.sign({_id:'abc123'},'This is a testing secret',{expiresIn:'7 days'});
//    console.log(typeof(the_secretVal));

//    const realVal = jwt.verify(the_secretVal,'This is a testing secret')
//    console.log(realVal);
// }

// tokencheckFunc()

//playing with toJSON
// const pet={
//     name:'Berry'
// }
// console.log(pet);
// console.log('before toJSON- ',JSON.stringify(pet));  //when we do res.send then express stringify it and give us result
// pet.toJSON = function(){
//         // console.log(this);
//         // return this;
//         //returning empty data , so none of the dta get expose
//         return {}
// }
// console.log('after toJSON- ',JSON.stringify(pet)); //so though express stringify it still we can remove those private items

//playing with user and task relation
//in task collection we have user id but what we want to print user name 
// we can again execute the query, but that will be mannual process so we can use 
//process execute method

// const tskdata = async(req,res)=>{
//     const t = await Task.findById('62f916b9432b3e116e235d77');
//     //user id of the task
//     console.log(t.owner);
//     //user name and everything
//     await t.populate('owner')
//     console.log(t.owner);
// }

// tskdata();

//playing - with respect to user id find tasks

// const taskOfUser = async(req,res)=>{
//     const u = await User.findById('62f9169f432b3e116e235d72');
//     /*in user model we will also create reference
//     but since here task info is not stores in user collection so we will create virtual link - check to user model

//     */

//     await u.populate('userTask');
//     console.log(u.userTask);
// }

// taskOfUser();
