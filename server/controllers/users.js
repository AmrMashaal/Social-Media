import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    let user = await User.findOne({ _id: id });
    const { password, ...dataWithoutPassword } = user.toObject();
    res.status(200).json(dataWithoutPassword);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formatted = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return { _id, firstName, lastName, location, occupation, picturePath };
      }
    );

    res.status(200).json(formatted);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (user?.friends?.includes(friendId)) {
      user.friends = user.friends.filter((id) => {
        id !== friendId;
      });

      friend.friends = friend.friends.filter((friendFriends) => {
        friendFriends !== id;
      });
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formatted = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return { _id, firstName, lastName, location, occupation, picturePath };
      }
    );

    res.status(200).json(formatted);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
