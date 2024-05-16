import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.satus(500).json({ error: error.message });
    console.log("An error occured in getUserProfile contoller ", error.message);
  }
};


// export const suggestUserProfile = async (req, res) =>{

// }

export const followAndUnfollowUser = async (req, res) =>{
    const {id} = req.params
    try {
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id === currentUser._id.toString()) return res.status(200).json({error: "You can't follow/unfollow yourself"})

            if (!userToModify || !currentUser) return res.status(200).json({error: "User not found"})
        const isFollowing = await currentUser.following.includes(id)

            if(isFollowing){
                // Unfollow user 
                await User.findByIdAndUpdate(id, {$pull : {followers: req.user._id}})
                await User.findByIdAndUpdate(req.user._id, {$pull : {following: id}})

                // response
                res.status(200).json({message: `you unfollowed ${userToModify?.username}`})
            } else{
                // Follow user
                await User.findByIdAndUpdate(id, {$push : {followers: req.user._id}})
                await User.findByIdAndUpdate(req.user._id, {$push : {following: id}})

                // send notification

                // response
                res.status(200).json({message: `Started following ${userToModify?.username}`})
            }
    }  catch (error) {
        res.status(500).json({ error: error.message });
        console.log("An error occured in followAndUnfollow contoller ", error.message);
      }
    };