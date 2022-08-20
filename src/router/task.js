const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
//add task
router.post('/task',auth,async(req,res)=>{
    try{
        //const task = new Task(req.body);
        const task = new Task({
            ...req.body,
           owner: req.user._id});

        const tsk = await task.save();
        res.status(201).send(tsk);
    }catch(err){
        res.status(400).send(err);
    }
        
})

//list all tasks by logged in user
router.get('/tasks',auth,async(req,res)=>{
    try{
        const tasklist = await Task.find({owner:req.user._id});
        res.send(tasklist);
    }catch(err){
        res.status(400).send(err)
    }
   
})
//task by id and logged in user
router.get('/tasks/:id',auth,async(req,res)=>{
    try{
       // const tsk = await Task.findById(req.params.id);
        const taskId = req.params.id;
        const tsk = await Task.findOne({_id:taskId,owner:req.user._id});
        if(!tsk)
        {
            return res.send("no data found")
        }
        res.status(200).send(tsk)
    }catch(err){
        res.status(500).send(err)
    }
    
})


//update task of logged in user
router.patch('/tasks/:id',auth,async(req,res)=>{
    try{
        const bodyKeys = Object.keys(req.body);
        const reqKeys = ['description','completed'];
        const validKeys = bodyKeys.every((bk)=>reqKeys.includes(bk));
        if(!validKeys)
        {
            return res.status(500).send({error:"Invalid keys"})
        }
        //const tsk = await Task.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true});

        //updating using middleware
        //const tsk = await Task.findById(req.params.id);
        const taskId = req.params.id;
        const tsk = await Task.findOne({_id:taskId,owner:req.user._id});
        //console.log(tsk);

        if(!tsk)
        {
            return res.status(400).send({error:"Data not found"})
        }
        bodyKeys.forEach((bk)=>tsk[bk]=req.body[bk]);
        await tsk.save();
        res.status(201).send(tsk);
    }catch(err)
    {
        res.status(500).send(err)
    }
})

// delete task of logged in user
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        //const tsk = await Task.findByIdAndDelete(req.params.id);
        const taskId = req.params.id;
        const tsk = await Task.findOneAndDelete({_id:taskId,owner:req.user._id});

        if(!tsk){
            return res.status(500).send({error:'No data found'})
        }
        res.status(200).send(tsk);
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports = router