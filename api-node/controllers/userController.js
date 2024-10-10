const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Excluir la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asegurarse de que el usuario autenticado es el mismo que el que se está actualizando
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado para editar este perfil' });
        }

        // Actualizar los campos editables
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Si se subió una nueva imagen de perfil, convertimos a base64 y actualizamos el campo profilePicture
        if (req.file) {
            user.profilePicture = req.file.buffer.toString('base64'); // Convertir a base64
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture, // Incluir la imagen base64 en la respuesta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
