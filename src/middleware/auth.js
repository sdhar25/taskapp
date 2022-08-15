const User = require('../models/user');
const jwt = require('jsonwebtoken');

//checking bearer token
const auth=async(req,res,next)=>{
    // console.log('in auth');
    // next();
    try{
        // const token = req.header('Authorization');  //header with authorization Bearer the code ; it will come with Bearer
        // console.log(token);
        const only_token = req.header('Authorization').replace('Bearer ','');
        //console.log(typeof(only_token));
        const decode = jwt.verify(only_token,'This is a testing secret');
        //console.log(decode);
        const req_user = await User.findOne({_id:decode._id,'tokens.tokens':only_token});
        if(!req_user)
        {
            throw new Error();
        }
        req.req_token = only_token; //we can access it to logout
        req.user = req_user; //here in request's user we set the logged in user
        next();
    }catch(err)
    {
        res.status(400).send({error:"Required Authentication"})
    }
};

module.exports =auth;