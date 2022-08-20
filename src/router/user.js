const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth'); //auth middleware


//add user
router.post('/users',async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    }
    catch(err)
    {
        res.status(400).send(err)
    }
    
});

//login
router.post('/users/login',async(req,res)=>{
    try
    {
        //check email present or not
        // const em = req.body.email;
        // const pwd = req.body.password;
        const lg_user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await lg_user.generateAuthToken(); 
        /*
        generateAuthToken is also a method like findByCredentials but it is created on instance i.e document
        unlike findByCredentials was on model
 
        */
            // res.send({lg_user:lg_user.getPublicProfile(),token});
            //or we can simply send the variable without calling method, but in model we used toJSON
            //without calling toJSON it is working
            res.send({lg_user,token}); 
            // res.send(lg_user);
        
       
    }
    catch(err){
        //console.log(err);
        res.status(400).send({error:err.message})
    }    
})

//logout
router.post('/users/logout',auth, async(req,res)=>{
    try{
        const the_token_toDelete = req.req_token; //which we saved in auth.js
        req.user.tokens = req.user.tokens.filter((obj)=>{
            return obj.tokens !== the_token_toDelete //obj.tokens the 'tokens' here obj tokens inside array tokens in db
        }) //req.user from auth.js
        await req.user.save();
        res.send()

    }catch(err)
    {
        res.status(500).send(err.message)
    }
})

//logout all
router.post('/users/logout_all',auth, async(req,res)=>{
    try{
        req.user.tokens = []; //make empty
        await req.user.save();
        res.send();
    }catch(err)
    {
        res.status(500).send(err.message)
    }
})

//get all users // we will not list all user for security purpose
// router.get('/users',auth,async(req,res)=>{
//     try{
//         const userlist = await User.find({})
//         res.send(userlist)
//     }
//     catch(err)
//     {
//         res.status(500).send(err)
//     }
// })

//get the logged in user , let's say my profile
router.get('/users/me',auth,async(req,res)=>{
    try{
       
        res.send(req.user); //which we get from authjs
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})

//get user on the basis of only id
/*since our project work on basis of user and task and no admin 
so user with respect to id not required */
// router.get('/users/:id',async(req,res)=>{
//     try{
//         const us = await User.findById(req.params.id);
//         if(!us)
//         {
//             return res.status(404).send("No user found")
//         }
//         res.send(us);
//     }catch(err)
//     {
//         res.status(500).send(err)
//     }
   
// })
//update user
//cannot allow any user to update other user
// router.patch('/users/:id',async(req,res)=>{
//     try{
//         const bodyKeys =Object.keys(req.body);
//         const allowedKeys = ['name','age','password','email'];
//         const isValidOp = bodyKeys.every((bk)=>allowedKeys.includes(bk)) //to check the field are allowed or not
//         //also it is giving true if it is in one line
//         if(!isValidOp)
//         {
//             return res.status(400).send({error:'invalid keys'})
//         }
//         //const usup = await User.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true});
//         // above line can be used but for using middleware pre save feature we need to break it like below

//         // we will find by id update one by one then save
//         const usup = await User.findById(req.params.id);
//         bodyKeys.forEach((bk)=>usup[bk]=req.body[bk]);
//         await usup.save();
//         //here new:true means the updated data will be returned in variable usup
//         if(!usup)
//         {
//             return res.status(400).send({error:"no user found"}); //no user found
//         }
//         res.send(usup);
//     }catch(err)
//     {
//         res.status(500).send(err)
//     }
// })

//update me
router.patch('/users/me',auth,async(req,res)=>{
    try{
        const bodyKeys =Object.keys(req.body);
        const allowedKeys = ['name','age','password','email'];
        const isValidOp = bodyKeys.every((bk)=>allowedKeys.includes(bk)) //to check the field are allowed or not
        //also it is giving true if it is in one line
        if(!isValidOp)
        {
            return res.status(400).send({error:'invalid keys'})
        }
        //const usup = await User.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true});
        // above line can be used but for using middleware pre save feature we need to break it like below

        // we will find by id update one by one then save
        const usup = await User.findById(req.user._id); //req.user is from auth
        bodyKeys.forEach((bk)=>usup[bk]=req.body[bk]);
        await usup.save();
        //here new:true means the updated data will be returned in variable usup
        if(!usup)
        {
            return res.status(400).send({error:"no user found"}); //no user found
        }
        res.send(usup);
    }catch(err)
    {
        res.status(500).send(err)
    }
})
// delete user
//not allow to delete any one
// router.delete('/users/:id',async(req,res)=>{
//     try{
//         const usr = await User.findByIdAndDelete(req.params.id);
//         if(!usr){
//             return res.status(500).send({error:'No user found'})
//         }
//         res.status(200).send(usr);
//     }catch(err){
//         res.status(400).send(err)
//     }
// })

//delete me
router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const usr = await User.findByIdAndDelete(req.user._id);
        // if(!usr){
        //     return res.status(500).send({error:'No user found'})
        // }
        // res.status(200).send(usr);
        await req.user.remove()
        res.send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports =router;
