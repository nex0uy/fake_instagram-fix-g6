const Post = require("../models/Post");
const multer = require("multer");

// Configuración de Multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Subir publicación
const uploadPost = async (req, res) => {
  const { caption } = req.body;
  try {
    const post = new Post({
      user: req.user._id,
      imageUrl: req.file.path,
      caption,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el feed
const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .populate({
        path: "comments",
        select: "content _id createdAt",
        populate: {
          path: "user",
          select: "username _id profilePicture",
        },
      });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verificar si el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Comprobar si el usuario ya ha dado like al post
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Ya has dado like a este post" });
    }

    // Agregar el like al post
    post.likes.push(req.user.id);
    await post.save();

    // Devolver el post actualizado
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const removeLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Comprobar si el usuario ya ha dado like al post
    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      return res.status(400).json({ message: "No has dado like a este post" });
    }

    // Eliminar el like del post
    post.likes.splice(likeIndex, 1);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { uploadPost, getFeed, upload, likePost, removeLike };

