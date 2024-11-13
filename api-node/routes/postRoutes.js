const express = require("express");
const {
  uploadPost,
  getFeed,
  upload,
  likePost,
  removeLike,
} = require("../controllers/postController");
const {
  createComment,
  removeComment,
  getComment,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos inválidos o falta la imagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado, token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/upload", protect, upload.single("image"), uploadPost);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario de un post
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentario eliminado correctamente"
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Post o comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:postId/comments/:commentId", protect, removeComment);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/feed", protect, getFeed);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Crear un comentario en un post
 *     tags: [Comentarios]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 634f1b5c8f25c32a5cd55f9b
 *                 user:
 *                   type: string
 *                   example: 634f1b2c8f25c32a5cd55f9a
 *                 post:
 *                   type: string
 *                   example: 634f1b5c8f25c32a5cd55f9c
 *                 content:
 *                   type: string
 *                   example: "Este es un comentario de ejemplo"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-05T15:21:34.788Z"
 *       400:
 *         description: Error en los datos proporcionados o solicitud mal formada
 *       401:
 *         description: Acceso denegado, no autorizado (falta de token JWT)
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error del servidor
 */

router.post("/:postId/comments", protect, createComment);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Dar like a un post
 *     tags: [Posts]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 634f1b5c8f25c32a5cd55f9b
 *                 user:
 *                   type: string
 *                   example: 634f1b2c8f25c32a5cd55f9a
 *                 content:
 *                   type: string
 *                   example: "Este es un post de ejemplo"
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: 634f1b2c8f25c32a5cd55f9a
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-05T15:21:34.788Z"
 *       400:
 *         description: El usuario ya ha dado like a este post
 *       401:
 *         description: Acceso denegado, no autorizado (falta de token JWT)
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error del servidor
 */

router.post("/:postId/like", protect, likePost);

/**
 * @swagger
 * /api/posts/comments/{commentId}:
 *   get:
 *     summary: Obtener un comentario específico
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario que se quiere obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 634f1b5c8f25c32a5cd55f9b
 *                 user:
 *                   type: string
 *                   example: 634f1b2c8f25c32a5cd55f9a
 *                 post:
 *                   type: string
 *                   example: 634f1b5c8f25c32a5cd55f9c
 *                 content:
 *                   type: string
 *                   example: "Este es un comentario de ejemplo"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-05T15:21:34.788Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-05T15:21:34.788Z"
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/comments/:commentId", protect, getComment);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   delete:
 *     summary: Quitar el like de un post
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post del que se va a quitar el like
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like eliminado exitosamente"
 *       400:
 *         description: El usuario no ha dado like a este post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No has dado like a este post"
 *       401:
 *         description: No autorizado, token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:postId/like", protect, removeLike);

module.exports = router;

