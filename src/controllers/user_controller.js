const UserService = require('../services/user_service');
const userService = new UserService();
const upload = require('../middleware/upload_image'); // Ajusta la ruta según tu estructura
const path = require('path');

class UserController {
    // Crear usuario
    async createUser(req, res) {
        try {
            const result = await userService.createUser(req.body);
            res.status(200).json({ message: "Usuario creado", data: result });
        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    //obtener perfil
    async getProfile(req, res) {
        try {
            const users = await userService.getprofile();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    //buscar usuario por id
    async findById(req, res) {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    //actualizar usuario
    async updateuser(req, res) {
        try {
            const updatedUser = await userService.updateuser({
                id: req.params.id, 
                Nombre_Usuario: req.body.Nombre_Usuario, 
                Correo: req.body.Correo
            });
            res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    //actualizar contraseña
    async updatePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            await userService.updatePassword(req.params.id, oldPassword, newPassword);
            res.status(200).json({ message: "Contraseña actualizada" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    //actualizar PIN
    async updatePin(req, res) {
        try {
            const { oldPin, newPin } = req.body;
            await userService.updatePin(req.params.id, oldPin, newPin);
            res.status(200).json({ message: "PIN actualizado" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Obtener perfil completo
    async getCompleteProfile(req, res) {
        try {
            console.log('Solicitando perfil para ID:', req.params.id);
            const user = await userService.getCompleteProfile(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            
            res.status(200).json(user);
        } catch (error) {
            console.error('Error en getCompleteProfile:', error);
            res.status(500).json({ 
                message: "Error del servidor",
                error: error.message 
            });
        }
    }

    // Actualizar perfil completo
    async updateProfile(req, res) {
        try {
            console.log('Datos recibidos para actualizar perfil:', req.body);
            console.log('ID del usuario:', req.params.id);

            const updatedUser = await userService.updateProfile({
                id: req.params.id,
                Nombre_Usuario: req.body.Nombre_Usuario,
                Correo: req.body.Correo,
                Telefono: req.body.Telefono
                // No incluir Imagen_Perfil aquí, se maneja por separado
            });
            
            console.log('Usuario actualizado:', updatedUser);
            
            res.status(200).json({ 
                message: "Perfil actualizado correctamente", 
                user: updatedUser 
            });
        } catch (error) {
            console.error('Error detallado en updateProfile:', error);
            res.status(500).json({ 
                message: "Error del servidor",
                error: error.message 
            });
        }
    }


    // Actualizar solo la imagen de perfil
     async updateProfileImage(req, res) {
        try {
            // Usar multer para manejar la subida del archivo
            upload.single('imagen')(req, res, async function (err) {
                if (err) {
                    console.error('Error en multer:', err);
                    return res.status(400).json({ 
                        message: "Error al subir la imagen",
                        error: err.message 
                    });
                }

                if (!req.file) {
                    return res.status(400).json({ 
                        message: "No se proporcionó ninguna imagen" 
                    });
                }

                console.log('Archivo recibido:', req.file);
                console.log('ID del usuario:', req.params.id);

                // Construir la ruta relativa de la imagen
                const imagePath = `/uploads/profiles/${req.file.filename}`;

                // Actualizar en la base de datos
                const updatedUser = await userService.updateProfileImage(
                    req.params.id, 
                    imagePath
                );

                res.status(200).json({ 
                    message: "Imagen de perfil actualizada correctamente", 
                    user: updatedUser 
                });
            });
        } catch (error) {
            console.error('Error en updateProfileImage:', error);
            res.status(500).json({ 
                message: "Error del servidor",
                error: error.message 
            });
        }
    }
}

module.exports = new UserController();