import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user)

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    console.log("This is the "+id)
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    console.log("Im outside if")
    if (user.friends.includes(friendId)) {
      if(id === friendId){
        user.friends = user.friends.filter((id) => id !== friendId);
        await user.save();
      }
      else{
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
      await user.save();
      await friend.save();
      }
    } else {
      console.log("Im else here")
      user.friends.push(friendId);
      friend.friends.push(id);
      await user.save();
      await friend.save();
    }
    console.log("before save")
    console.log("after save")
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    console.log("Im here after map fn")
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.log("They are the same bro for ")
    res.status(404).json({ message:"hello bro error sry" });
  }
};
