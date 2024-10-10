const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuración de Multer para la subida de imágenes
const storage = multer.memoryStorage(); // Almacenamiento en memoria para procesar la imagen directamente
const upload = multer({ storage });

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     summary: Obtener el perfil de un usuario dado su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 5f8d04a1b54764421b7156de
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 profileImage:
 *                   type: string
 *                   example: "https://example.com/profile/john_doe.jpg"
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/user/profile/{id}:
 *   put:
 *     summary: Editar el perfil de un usuario dado su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil del usuario actualizado correctamente
 *       401:
 *         description: No autorizado para actualizar el perfil
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id', protect, upload.single('profilePicture'), updateUserProfile);

module.exports = router;
