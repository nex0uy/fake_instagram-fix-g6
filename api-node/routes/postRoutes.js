const express = require('express');
const { uploadPost, getFeed, likePost } = require('../controllers/postController');
const { createComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();

// Configuración de Multer para almacenar el archivo en memoria
const storage = multer.memoryStorage(); // Almacena el archivo en la memoria en lugar del sistema de archivos
const upload = multer({ storage });

/**
 * @swagger
 * /api/posts/upload:
 *   post:
 *     summary: Subir una nueva publicación
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Datos inválidos o falta la imagen
 *       401:
 *         description: No autorizado, token inválido o ausente
 *       500:
 *         description: Error del servidor
 */
router.post('/upload', protect, upload.single('image'), uploadPost);

/**
 * @swagger
 * /api/posts/feed:
 *   get:
 *     summary: Obtener el feed de publicaciones
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: No autorizado, token inválido o ausente
 *       500:
 *         description: Error del servidor
 */
router.get('/feed', protect, getFeed);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Dar like a un post
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al que se le va a dar like
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like agregado exitosamente
 *       400:
 *         description: El usuario ya ha dado like a este post
 *       401:
 *         description: No autorizado, token inválido o ausente
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/:postId/like', protect, likePost);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Crear un comentario en un post
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post en el que se está comentando
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Este es un comentario"
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados o solicitud mal formada
 *       401:
 *         description: Acceso denegado, no autorizado (falta de token JWT)
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/:postId/comments', protect, createComment);

module.exports = router;
