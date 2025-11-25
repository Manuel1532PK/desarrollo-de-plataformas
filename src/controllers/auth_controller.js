const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../config/db_config');
const { sendVerificationEmail } = require('../utils/emailservice');

class AuthController {
    async login(req, res) {
        try {
            const { correo, password } = req.body;

            const [users] = await connection.execute(
                'SELECT * FROM Usuarios WHERE Correo = ?',
                [correo]
            );

            if (!users[0]) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }

            const user = users[0];

            // Verificar si el usuario ha verificado su correo
            if (!user.Verificado) {
                return res.status(400).json({ message: "Por favor verifica tu correo antes de iniciar sesión" });
            }

            // validar contraseñas
            const isPasswordValid = await bcrypt.compare(password, user.Hash_Password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
            
            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.ID_Usuarios, 
                    correo: user.Correo,
                    nombre: user.Nombre_Usuario
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({
                message: "Login exitoso",
                token,
                user: {
                    id: user.ID_Usuarios,
                    nombre: user.Nombre_Usuario,
                    correo: user.Correo,
                    telefono: user.Telefono,
                    verificado: user.Verificado
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    async register(req, res) {
        try {
            const { Nombre_Usuario, correo, Telefono, Hash_Password, Pin_Seguridad } = req.body;

            // Validar campos requeridos
            if (!Nombre_Usuario || !correo || !Telefono || !Hash_Password || !Pin_Seguridad) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            // Hashear contraseña y PIN
            const hash_password = await bcrypt.hash(Hash_Password, 10);
            const pin_seguridad = await bcrypt.hash(Pin_Seguridad, 10);

            // Llamar al procedimiento almacenado
            const [result] = await connection.execute(
                'CALL CrearUsuarioConBilletera(?, ?, ?, ?, ?)',
                [Nombre_Usuario, correo, Telefono, hash_password, pin_seguridad]
            );

            const newUser = result[0][0];

            // Generar token de verificación
            const verifyToken = jwt.sign(
                { correo },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            try {
                // Enviar correo de verificación
                await sendVerificationEmail(correo, verifyToken);
            } catch (emailError) {
                console.error('Error enviando correo:', emailError);
                // No fallar el registro si el correo falla, solo loggear el error
            }

            res.status(201).json({
                message: "Usuario registrado exitosamente. Por favor verifica tu correo.",
                user: {
                    id: newUser.ID_Usuarios,
                    nombre: Nombre_Usuario,
                    correo: correo,
                    telefono: Telefono
                }
            });

        } catch (error) {
            console.error('Error en register controller:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "El correo ya está registrado" });
            }
            res.status(500).json({ message: "Error del servidor al registrar usuario" });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { token } = req.query;
            
            console.log('Token recibido:', token); // ← AGREGAR ESTO
            console.log('Query completo:', req.query); // ← AGREGAR ESTO
            
            if (!token) {
            console.log('No se recibió token');
            return res.status(400).json({ message: "Token no proporcionado" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', decoded); // ← AGREGAR ESTO

            const [users] = await connection.execute(
            'SELECT * FROM Usuarios WHERE Correo = ?',
            [decoded.correo]
            );

            if (!users[0]) {
            return res.status(400).json({ message: "Usuario no encontrado" });
            }

            // Marcar usuario como verificado
            await connection.execute(
            'UPDATE Usuarios SET Verificado = 1 WHERE Correo = ?',
            [decoded.correo]
            );

            console.log('Usuario verificado exitosamente:', decoded.correo); // ← AGREGAR ESTO
            res.status(200).json({ message: "Correo verificado correctamente" });

        } catch (error) {
            console.error("Error en verifyEmail:", error);
            
            // Mensaje de error más específico
            if (error.name === 'TokenExpiredError') {
            res.status(400).json({ message: "El token ha expirado" });
            } else if (error.name === 'JsonWebTokenError') {
            res.status(400).json({ message: "Token inválido" });
            } else {
            res.status(400).json({ message: "Error al verificar el correo" });
            }
        }
        }

    // AGREGAR ESTA FUNCIÓN FALTANTE
    async resendVerificationEmail(req, res) {
        try {
            const { correo } = req.body;

            const [users] = await connection.execute(
                'SELECT * FROM Usuarios WHERE Correo = ?',
                [correo]
            );

            if (!users[0]) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }

            const user = users[0];

            if (user.Verificado) {
                return res.status(400).json({ message: "El correo ya está verificado" });
            }

            // Generar nuevo token de verificación
            const verifyToken = jwt.sign(
                { correo },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Enviar correo de verificación
            await sendVerificationEmail(correo, verifyToken);

            res.status(200).json({ message: "Correo de verificación reenviado" });

        } catch (error) {
            console.error("Error en resendVerificationEmail:", error);
            res.status(500).json({ message: "Error al reenviar correo de verificación" });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { correo } = req.body;

            const [users] = await connection.execute(
                'SELECT * FROM Usuarios WHERE Correo = ?',
                [correo]
            );
            
            if (!users[0]) {
                return res.status(400).json({ message: "Usuario no registrado" });
            }

            const userId = users[0].ID_Usuarios;
            const otpCodigo = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiracion = new Date(Date.now() + 10 * 60 * 1000);

            await connection.execute(
                'UPDATE Usuarios SET Otp_Codigo = ?, Otp_Expira = ? WHERE ID_Usuarios = ?',
                [otpCodigo, otpExpiracion, userId]
            );

            res.status(200).json({ 
                message: "OTP enviado",
                otp: otpCodigo
            });

        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    async resetPassword(req, res) {
        try {
            const { correo, otpCodigo, nuevaPassword } = req.body;

            const [users] = await connection.execute(
                'SELECT ID_Usuarios, Otp_Codigo, Otp_Expira FROM Usuarios WHERE Correo = ?',
                [correo]
            );

            if (!users[0]) {
                return res.status(400).json({ message: "Correo no encontrado" });
            }

            const user = users[0];

            if (!user.Otp_Codigo || user.Otp_Codigo !== otpCodigo) {
                return res.status(400).json({ message: "OTP incorrecto" });
            }

            if (new Date(user.Otp_Expira) < new Date()) {
                return res.status(400).json({ message: "OTP expirado" });
            }

            const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
            await connection.execute(
                'UPDATE Usuarios SET Hash_Password = ?, Otp_Codigo = NULL, Otp_Expira = NULL WHERE ID_Usuarios = ?',
                [hashedPassword, user.ID_Usuarios]
            );

            res.status(200).json({ message: "Contraseña actualizada" });

        } catch (error) {
            res.status(500).json({ message: "Error del servidor" });
        }
    }
}

module.exports = new AuthController();