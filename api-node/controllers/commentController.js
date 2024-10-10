const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        // Verificar si el post existe
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        // Crear el comentario
        const newComment = new Comment({
            user: req.user.id, // ID del usuario autenticado
            post: postId,
            content,
        });

        // Guardar el comentario en la base de datos
        const savedComment = await newComment.save();

        // Agregar el comentario al array de comentarios del post
        post.comments.push(savedComment._id);
        await post.save();

        // Devolver el comentario creado
        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = {
    createComment,
};
