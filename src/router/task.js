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

// eg GET {{url}}/tasks?completed=true&limit=2&skip=0&sortBy=createdAt:desc
// or ?sortBy=completed:asc
//list all tasks by logged in user
//filteration
/*If "req.query.completed" is "true" ( string not boolean) , then the comparison query i.e "===" will be executed first and will return a 
boolean value true to the property "completed" which then will be added to match object.*/ 
//limit and skip can comes in option properties
router.get('/tasks',auth,async(req,res)=>{
    //fetch true tasks when ?completed=true 
    //need match object
    const match={};
    const sort={};
    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]]= parts[1] === 'desc' ? -1 : 1
    }
    try{
        // const tasklist = await Task.find({owner:req.user._id,
        // completed:true});
        // sortBy= createdAt_desc //it's depend upon you , we can have createdAt_asc

        await req.user.populate({
            path:'userTask',
            match, //here match:match but it was same so shortcut used,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                // sort:{
                //     createdAt:-1
                // }
                sort
                
            },
            
        });

        // res.send(tasklist);
        res.send(req.user.userTask)
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