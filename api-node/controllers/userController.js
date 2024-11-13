const User = require("../models/User");
const Post = require("../models/Post");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("friends", "username profilePicture description");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const posts = await Post.find({ user: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios sin mostrar las contraseñas
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Este usuario ya es tu amigo" });
    }

    user.friends.push(friend._id);
    await user.save();

    friend.friends.push(user._id);
    await friend.save();

    res.status(200).json({ message: "Amigo agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Este usuario no es tu amigo" });
    }

    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== friend._id.toString()
    );
    await user.save();

    friend.friends = friend.friends.filter(
      (friendId) => friendId.toString() !== user._id.toString()
    );
    await friend.save();

    res.status(200).json({ message: "Amigo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.description) {
      user.description = req.body.description;
    }

    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    await user.save();

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: {
        username: user.username,
        profilePicture: user.profilePicture,
        description: user.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers,
  addFriend,
  updateUserProfile,
  removeFriend,
};

