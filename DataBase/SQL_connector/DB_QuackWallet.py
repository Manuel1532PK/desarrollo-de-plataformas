import mysql.connector
from mysql.connector import Error

try:
    Conexion = mysql.connector.connect(
        host="127.0.0.1",      # Servidor
        port="3306",           # Puerto
        user="root",           # Usuario MySQL
        password=""            # Contraseña
    )

    if Conexion.is_connected():
        cursor = Conexion.cursor()

        # _____________________________ Crear Base de Datos _____________________________
        cursor.execute("CREATE DATABASE IF NOT EXISTS Billetera_virtual")
        print("Base de datos 'Billetera_virtual' creada o ya existe.")
        cursor.execute("USE Billetera_virtual")

        # _____________________________ Tablas _____________________________

        # Tabla Usuarios
        Create_Tabla_Usuarios = """
        CREATE TABLE IF NOT EXISTS Usuarios (
          ID_Usuarios INT AUTO_INCREMENT PRIMARY KEY,
          Nombre_Usuario VARCHAR(100) NOT NULL,
          Correo VARCHAR(150) NOT NULL UNIQUE,
          Telefono VARCHAR(20) NOT NULL,
          Hash_Password VARCHAR(255) NOT NULL,
          Pin_Seguridad VARCHAR(255) NOT NULL,
          Fecha_Registro DATETIME DEFAULT CURRENT_TIMESTAMP,
          Estado VARCHAR(20) DEFAULT 'Activo',
          Verificado BOOLEAN DEFAULT FALSE,
          Otp_Codigo VARCHAR(10) NULL,
          Otp_Expira DATETIME NULL,
          Imagen_Perfil VARCHAR(500) NULL
        )
        """
        cursor.execute(Create_Tabla_Usuarios)

        # Tabla Contratos_Inteligentes
        Create_Tabla_Contratos_Inteligentes ="""
        CREATE TABLE IF NOT EXISTS Contratos_Inteligentes (
          ID_Contratos_Inteligentes INT AUTO_INCREMENT PRIMARY KEY,
          Descripcion VARCHAR(45) NOT NULL,
          Codigo_smart_contract VARCHAR(45) NOT NULL,
          Fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          Estado VARCHAR(45) DEFAULT 'Activo'
        )
        """
        cursor.execute(Create_Tabla_Contratos_Inteligentes)

        # Tabla Notificaciones
        Create_Tabla_Notificaciones= """
        CREATE TABLE IF NOT EXISTS Notificaciones (
          ID_Notificacion INT AUTO_INCREMENT PRIMARY KEY,
          Tipo_Notificacion VARCHAR(45) NOT NULL,
          Mensaje_Notificacion VARCHAR(255) NOT NULL,
          Fecha_Envio DATETIME DEFAULT CURRENT_TIMESTAMP,
          Estado_Notificacion VARCHAR(45) DEFAULT 'Pendiente'
        )
        """
        cursor.execute(Create_Tabla_Notificaciones)

        # Tabla Billeteras
        Create_Tabla_Billeteras= """
        CREATE TABLE IF NOT EXISTS Billeteras (
          ID_Billetera INT AUTO_INCREMENT PRIMARY KEY,
          Moneda CHAR(3) DEFAULT 'COP',
          Saldo FLOAT DEFAULT 0.0,
          Estado VARCHAR(45) DEFAULT 'Activa',
          direccion_blockchain VARCHAR(255) NOT NULL,
          ID_Usuario INT NOT NULL,
          ID_Contrato_Inteligente INT,
          Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuarios),
          FOREIGN KEY (ID_Contrato_Inteligente) REFERENCES Contratos_Inteligentes(ID_Contratos_Inteligentes)
          )
        """
        cursor.execute(Create_Tabla_Billeteras)

        # Tabla Transacciones
        Create_Tabla_Transacciones = """
        CREATE TABLE IF NOT EXISTS Transacciones (
          ID_Transaccion INT AUTO_INCREMENT PRIMARY KEY,
          Tipo_Transaccion VARCHAR(20) NOT NULL,
          Monto_Transaccion FLOAT NOT NULL,
          Fecha_Transaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
          Estado_Transaccion VARCHAR(20) DEFAULT 'Pendiente',
          Hash_Blockchain VARCHAR(255),
          ID_Billetera_Origen INT NOT NULL,
          ID_Billetera_Destino INT,
          ID_Notificacion INT,
          FOREIGN KEY (ID_Billetera_Origen) REFERENCES Billeteras(ID_Billetera),
          FOREIGN KEY (ID_Billetera_Destino) REFERENCES Billeteras(ID_Billetera),
          FOREIGN KEY (ID_Notificacion) REFERENCES Notificaciones(ID_Notificacion)
        )
        """
        cursor.execute(Create_Tabla_Transacciones)

        # Tabla Autenticaciones
        Create_Tabla_Autenticaciones = """
        CREATE TABLE IF NOT EXISTS Autenticaciones (
          ID_Autenticacion INT AUTO_INCREMENT PRIMARY KEY,
          Tipo_Autenticacion VARCHAR(50) NOT NULL,
          Detalle_Autenticacion VARCHAR(45) NOT NULL,
          Fecha_Autenticacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          Resultado_Autenticacion VARCHAR(45) DEFAULT 'Pendiente',
          ID_Usuario INT NOT NULL,
          FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuarios)
        )
        """
        cursor.execute(Create_Tabla_Autenticaciones)


        # Tabla Tarjetas_Registro
        Create_Tabla_Tarjeta_Registro="""
        CREATE TABLE IF NOT EXISTS Tarjetas_Registro (
          ID_Tarjetas INT AUTO_INCREMENT PRIMARY KEY,
          Nombre VARCHAR(100) NOT NULL,
          Tipo_tarjeta VARCHAR(45) NOT NULL,
          Banco VARCHAR(100) NOT NULL,
          Numero VARCHAR(45) NOT NULL UNIQUE,
          Saldo FLOAT DEFAULT 0.0,
          ID_Usuario INT NOT NULL,
          FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuarios)
          )
          """
        cursor.execute(Create_Tabla_Tarjeta_Registro)


        print("Todas las tablas creadas con éxito.")

        # _____________________________ PROCEDIMIENTO ALMACENADO _____________________________

        try:
            cursor.execute("DROP PROCEDURE IF EXISTS CrearUsuarioConBilletera")
            print("Procedimiento anterior eliminado")
        except:
            pass

        # Crear el procedimiento almacenado
        create_procedure = """
        CREATE PROCEDURE CrearUsuarioConBilletera(
            IN p_nombre_usuario VARCHAR(100),
            IN p_correo VARCHAR(150), 
            IN p_telefono VARCHAR(20),
            IN p_hash_password VARCHAR(255),
            IN p_pin_seguridad VARCHAR(255)
        )
        BEGIN
            DECLARE nuevo_usuario_id INT;
            DECLARE nueva_billetera_id INT;
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                RESIGNAL;
            END;

            START TRANSACTION;

            -- Insertar usuario con Hash_Password y Pin_Seguridad
            INSERT INTO Usuarios (Nombre_Usuario, Correo, Telefono, Hash_Password, Pin_Seguridad)
            VALUES (p_nombre_usuario, p_correo, p_telefono, p_hash_password, p_pin_seguridad);
            
            SET nuevo_usuario_id = LAST_INSERT_ID();
            
            -- Insertar billetera automáticamente
            INSERT INTO Billeteras (direccion_blockchain, ID_Usuario)
            VALUES (UUID(), nuevo_usuario_id);
            
            SET nueva_billetera_id = LAST_INSERT_ID();
            
            COMMIT;

            -- Devolver resultados
            SELECT 
                nuevo_usuario_id AS ID_Usuario,
                p_nombre_usuario AS Nombre_Usuario,
                p_correo AS Correo,
                p_telefono AS Telefono,
                nueva_billetera_id AS ID_Billetera,
                'Usuario y billetera creados exitosamente' AS Mensaje;
        END
        """
        
        cursor.execute(create_procedure)

except Error as e:
    print("Error al conectar a MySQL:", e)

finally:
    if Conexion.is_connected():
        cursor.close()
        Conexion.close()
        print("Conexión terminada... la base de datos se ha cerrado.")