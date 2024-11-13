// controllers/commentController.js

const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Verificar si el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Crear el comentario
    const newComment = new Comment({
      user: req.user._id, // ID del usuario autenticado
      post: postId,
      content,
    });

    // Guardar el comentario en la base de datos
    const savedComment = await newComment.save();

    // Agregar el comentario al array de comentarios del post
    post.comments.push(savedComment._id);
    await post.save();

    // Devolver el comentario creado
    res.status(201).json(
      {
        _id: savedComment._id,
        content: savedComment.content,
        createdAt: savedComment.createdAt,
        updatedAt: savedComment.updatedAt,
        user: {
          _id: savedComment.user._id,
          username: req.user.username,
          profilePicture: req.user.profilePicture,
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate(
      "user",
      "username email profilePicture"
    );

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.status(200).json({
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        _id: comment.user._id,
        username: comment.user.username,
        profilePicture: comment.user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este comentario" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();

    res.status(200).json(deletedComment); // Retorna el comentario eliminado directamente
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  createComment,
  removeComment,
  getComment,
};

