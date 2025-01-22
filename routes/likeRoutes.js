const express = require("express");
const router = express.Router();
const post = require("../models/Post");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");



router.post("/:id/like", authMiddleware, async (req, res) => {

    //qurry perams
    const postId = req.params.id;
    console.log("req.params._id in the like (post route)", postId);
    console.log(req.user);

    const currentUser = String(req.user.userId);
    const currentUserDetails = await User.findById(currentUser)
    console.log("user who liked", currentUserDetails);

    try{

        const userPost = await post.findById(req.params.id);
        console.log("post found in like", userPost);
        if(userPost){

            console.log(userPost.like.includes(currentUser));

            //remove the like
            if(userPost.like.includes(currentUser)){
              
                userPost.like.pull(currentUser);
                await userPost.save();
                console.log("user pulled", userPost);
                console.log(`${currentUserDetails.username} removed his like`);
                return res.status(200).json({ message: "Post unliked", likes: userPost.like.length });

            }else{

                userPost.like.push(currentUser);
                await userPost.save();
                console.log("user pushed", userPost);
                console.log(`${currentUserDetails.username} liked ${userPost.title}`);
                return res.status(200).json({ message: "Post liked", likes: userPost.like.length });
            }
        } 
    }catch(error){
        res.status(500).json( error.message );
    }
})

module.exports = router;