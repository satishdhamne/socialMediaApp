const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        try {
            let username = user.username 

            if(username == undefined){
              console.log("username is undefined");
            }

            res.status(200).json({
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followers: user.followers.length,
                following: user.following.length
            });
            
        } catch (error) {
            console.error(error);
        }
       

        // res.render('profile', { user });

        console.log("user in the /profile", user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.patch('/profile',authMiddleware,  async (req, res) => {
    const { bio, profilePicture } = req.body;
    const u = req.user
    console.log("userid: ", u.id);
    console.log('Request body:', req.body);

    try {
        const user = await User.findById(req.user.id);
        console.log('Request user ID:', req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }

    console.log('PATCH /profile route hit');
    res.send('Testing route');
});


router.post("/:usersid/follow", authMiddleware, async (req, res) => {
    
    try {

        const user = req.params.usersid;
    const currentUser = req.user.userId;
    const current = await User.findById(currentUser);
    console.log("current user : ", current.username);
    
    //require the usermodel 
    const userToFollow = await User.findById(user);
    console.log("user to follow",userToFollow.username);
    
    //add or remove the current users id into the ideal user 
    if(userToFollow && current){

        if(userToFollow.followers.includes(currentUser)){

            userToFollow.followers.pull(currentUser); //unfollowing
            await userToFollow.save();

            current.following.pull(user);
            await current.save();

            console.log("after unfollowing: ", userToFollow);
            console.log("after unfollowing: ", current);
            return res.status(200).json({ message: `${current.username} unfollowed ${userToFollow.username} `, followers: userToFollow.followers.length, following: userToFollow.following.length});
        }else{

            userToFollow.followers.push(currentUser);
            await userToFollow.save();

            current.following.push(user)
            await current.save();

            console.log("after following users follow status: ", userToFollow);
            console.log("after following currenntusers follow status: ", current);
            return res.status(200).json({message: `${current.username} followed ${userToFollow.username}`, followers: userToFollow.followers.length, following: userToFollow.following.length})
        }
    }
        
    } catch (error) {
        res.send(error.message);
    }
    

})

module.exports = router;


