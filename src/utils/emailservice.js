const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const verificationUrl = `http://localhost:5173/verify?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu cuenta - QuackWallet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bienvenido a QuackWallet</h2>
          <p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: black; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar Cuenta
          </a>
          <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
          <p>${verificationUrl}</p>
          <p><strong>Este enlace expira en 7 dias.</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado a:', email);
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };