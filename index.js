const express = require("express")
const mysql = require("mysql")
const app = express()
const cors = require("cors")
const port = 4000
const fs = require('fs');
const multer = require('multer');
const path = require('path')
const secretKey = require('./secretKey')
const crypto = require('crypto')




app.use('/public', express.static('public'))
app.use(cors())
app.use(express.json());



// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname, './public/uploads')); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilizar el nombre original del archivo
}
});

const upload = multer({ storage: storage });



// FUNCIONES DE SEGURIDAD

// Función para encriptar un texto usando un algoritmo y una clave específica
function encrypt(text, secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Función para desencriptar un texto usando un algoritmo y una clave específica
function decrypt(encryptedText, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}





app.listen(port, () => {
    console.log("Servidor de AlquileGente Conectado")
})

app.get("/", (req, res) => {
    res.send("Servidor en linea ")
})



// PARTE 1 CRUD DE RESEÑAS



// GENERAR CONECCION

const connection = mysql.createConnection(
  {
  // host: 'monorail.proxy.rlwy.net',
  // port: 58853,
  // user: 'root',
  // password: 'tcDmRmMveOzzXryffLyUnZXNgxWRTRsA',
  // database: 'railway',
  // charset: 'utf8mb4',
mysql_url:  'mysql://root:tcDmRmMveOzzXryffLyUnZXNgxWRTRsA@monorail.proxy.rlwy.net:58853/railway'
}
);

connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos:', error);
      return;
    }
    console.log('Conexión exitosa a la base de datos');
  });

  
// PARTE 1 ENVIO DE RESEÑAS


  app.post('/enviarResenas', (req, res) => {
    // Obtener las reseñas del cuerpo de la solicitud
    const { nombre, resena } = req.body;
  
    // Insertar los datos en la tabla "Reseñas"
    const sql = 'INSERT INTO Resenas (nombre, resena) VALUES (?, ?)';
    connection.query(sql, [nombre, resena], (error, resultados) => {
      if (error) {
        console.error('Error al insertar reseña en la base de datos:', error);
        res.status(500).send('Error al insertar reseña en la base de datos');
        return;
      }
      console.log('Reseña insertada correctamente en la base de datos');
      res.status(200).send('Reseña insertada correctamente en la base de datos');
    });
  });
  
  // Cerrar la conexión a la base de datos cuando la aplicación se cierre
  process.on('exit', () => {
    connection.end();
    console.log('Conexión a la base de datos cerrada');
  });

// MANDAR RESEÑAS AL FRONTEND 

  app.get('/traerResenas', (req, res) => {
    const sql = "SELECT * FROM Resenas";
  
    // Ejecutar la consulta SQL
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
        return;
      }
      res.json(results); // Enviar los resultados como respuesta en formato JSON
    });
  });



  // Insertar los datos en la tabla Servicios

  app.post('/enviarServicio', (req, res) => {
    const { nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen } = req.body
    const sql = 'INSERT INTO Servicios (nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen], (error, resultados) => {
     if (error) {
       console.error('Error al insertar servicio en la base de datos:', error);
       res.status(500).send('Error al insertar servicio en la base de datos');
       return;
     }
     console.log('servicio insertado correctamente en la base de datos');
     res.status(200).send('servicio insertado correctamente en la base de datos');
   });
  // Cerrar la conexión a la base de datos cuando la aplicación se cierre
  process.on('exit', () => {
   connection.end();
   console.log('Conexión a la base de datos cerrada');
  });
  
  
  });
  
  

  // MANDAR SERVICIOS AL FRONTEND

  app.get("/traerServicios", (req, res) => {
const sql = "SELECT * FROM Servicios;"
connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ error: 'Error al obtener los servicios' });
    return;
  }
  res.json(results); // Enviar los resultados como respuesta en formato JSON
});
});


  

// Insertar los datos en la tabla de Solicitudes


app.post('/enviarSolicitud', (req, res) => {
  const { nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen } = req.body
  const sql = 'INSERT INTO Solicitudes (nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [nombrePersona, ubicacion, tipoAcompaniamiento, descripcion, precio, diasDisponibles, horasPreferidas, horasDiarias, whatssap, imagen], (error, resultados) => {
   if (error) {
     console.error('Error al insertar solicitud en la base de datos:', error);
     res.status(500).send('Error al insertar solicitud en la base de datos');
     return;
   }
   console.log('Solicitud insertada correctamente en la base de datos');
   res.status(200).send('Solicitud insertada correctamente en la base de datos');
 });
// Cerrar la conexión a la base de datos cuando la aplicación se cierre
process.on('exit', () => {
 connection.end();
 console.log('Conexión a la base de datos cerrada');
});


});



  // MANDAR SOLICITUDES AL FRONTEND

  app.get("/traerSolicitudes", (req, res) => {
    const sql = "SELECT * FROM Solicitudes;"
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al obtener las solicitudes' });
        return;
      }
      res.json(results); // Enviar los resultados como respuesta en formato JSON
    });
    });
    
    
    

  //   fullname: "",
  //   email: "",
  //   phone: "",
  //   city: "",
  //   iban: "",
  //   password: "",
  //   confirm_password: "",
  //   civilStatus: "",
  //   searchInteres: "",
  //   personalInteres: "",
  //   whoDoYouLive: "",
  //   musicalTaste: "",
  //   favoriteActivity: "",
  //   alcoholimetro: "",
  //   secretAsk: '',
  // secretAnswer: ''


  // Insertar los usuarios en su tabla corresopndiente

  app.post('/enviarUsuario', (req, res) => {
    const {
        payMethod, fullname, email, phone, city, iban, password,
         civilStatus, searchInteres, personalInteres,
        whoDoYouLive, musicalTaste, favoriteActivity, alcoholimetro,
        secretAsk, secretAnswer
    } = req.body;
    
    // Clave secreta para encriptar los datos sensibles
    // const secretKey = 'MiClaveSecreta123';

    // Encriptar la contraseña y la respuesta secreta
    const encryptedPassword = encrypt(password, secretKey);
    const encryptedSecretAnswer = encrypt(secretAnswer, secretKey);

    const sql = 'INSERT INTO usuarios (payMethod, fullname, email, phone, city, iban, password, civilStatus, searchInteres, personalInteres, whoDoYouLive, musicalTaste, favoriteActivity, alcoholimetro, secretAsk, secretAnswer, resenas, solicitudes, servicios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    const values = [payMethod, fullname, email, phone, city, iban, encryptedPassword, civilStatus, searchInteres, personalInteres, whoDoYouLive, musicalTaste, favoriteActivity, alcoholimetro, secretAsk, encryptedSecretAnswer, 0, 0, 0];
    
    connection.query(sql, values, (error, resultados) => {
        if (error) {
            console.error('Error al insertar usuario en la base de datos:', error);
            res.status(500).send('Error al insertar usuario en la base de datos');
            return;
        }
        console.log('Usuario insertado correctamente en la base de datos');
        res.status(200).send('Usuario insertado correctamente en la base de datos');
    });
});

// Cerrar la conexión a la base de datos cuando la aplicación se cierre
process.on('exit', () => {
    connection.end();
    console.log('Conexión a la base de datos cerrada');
});


  // MANDAR USUARIOS AL FRONTEND
  
  app.get("/traerUsuarios", (req, res) => {
    const sql = "SELECT * FROM usuarios;";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
            return;
        }

        // Desencriptar las contraseñas y respuestas secretas antes de enviar los resultados
        const decryptedResults = results.map(user => {
            // Desencriptar la contraseña y la respuesta secreta
            const decryptedPassword = decrypt(user.password, secretKey);
            
            console.log("antes de la desencriptacion:" + user.secretAnswer)
            const decryptedSecretAnswer = decrypt(user.secretAnswer, secretKey);
            console.log("despues de la desencriptacion: " + decryptedSecretAnswer)
            

            // Devolver un nuevo objeto de usuario con los valores desencriptados
            return {
                ...user,
                password: decryptedPassword,
                secretAnswer: decryptedSecretAnswer
            };
        });

        res.json(decryptedResults); // Enviar los resultados desencriptados como respuesta en formato JSON
    });
});


// 


    app.post("/enviarImagen/:userId", upload.single('imagen'), (req, res) => {
      if (!req.file) {
        return res.status(400).send('No se proporcionó ninguna imagen');
      }
    
      const fileName = req.file.originalname; 
      const userId = req.params.userId;   // Obtener el nombre original del archivo
    
      const sql = "UPDATE Usuarios SET imagen = ? WHERE id = ?";
      const values = [fileName, userId]; // Usar el nombre original del archivo
      
      connection.query(sql, values, (error, results) => {
        if (error) {
          console.error('Error al insertar imagen en la base de datos:', error);
          res.status(500).send('Error al insertar imagen en la base de datos');
          return;
        }
        console.log('Nombre del archivo insertado correctamente en la base de datos:', fileName);
        res.status(200).json({ fileName }); // Enviar el nombre del archivo como parte de un objeto JSON en la respuesta
      });
    });




// MEDIDAS DE SEGURIDAD CREAR SOLICITUD Y CREAR SERVICIO
app.post('/solicitud/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET solicitudes = solicitudes + 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar solicitud en la base de datos:', error);
      res.status(500).send('Error al actualizar solicitud en la base de datos');
      return;
    }
    console.log('Solicitud actualizada correctamente en la base de datos');
    res.status(200).send('Solicitud actualizada correctamente en la base de datos');
  });
});

// Cerrar la conexión a la base de datos cuando la aplicación se cierre
process.on('exit', () => {
  connection.end();
  console.log('Conexión a la base de datos cerrada');
});

// SUMAR 1 SERVICIO AL BACKEND


app.post('/servicio/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET servicios = servicios + 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar servicio en la base de datos:', error);
      res.status(500).send('Error al actualizar servicio en la base de datos');
      return;
    }
    console.log('servicio actualizado correctamente en la base de datos');
    res.status(200).send('servicio actualizado correctamente en la base de datos');
  });
});

// Cerrar la conexión a la base de datos cuando la aplicación se cierre
process.on('exit', () => {
  connection.end();
  console.log('Conexión a la base de datos cerrada');
});

// SUMAR 1 RESEÑA AL BACKEND

app.post('/resena/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET resenas = resenas + 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar servicio en la base de datos:', error);
      res.status(500).send('Error al actualizar servicio en la base de datos');
      return;
    }
    console.log('servicio actualizado correctamente en la base de datos');
    res.status(200).send('servicio actualizado correctamente en la base de datos');
  });
});

// Cerrar la conexión a la base de datos cuando la aplicación se cierre
process.on('exit', () => {
  connection.end();
  console.log('Conexión a la base de datos cerrada');
});



// SECCION DE CONFIGURACION. MODIFICACIONES A LA BASE DE DATOS


// PUBLICACIONES

// SERVICIOS

app.delete('/deleteservice/:id', (req, res) => {
  const servicioId = req.params.id;

  // Consulta SQL para eliminar el servicio por ID
  const sql = `DELETE FROM servicios WHERE id = ?`;

  // Ejecutar la consulta SQL
  connection.query(sql, [servicioId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el servicio:', err);
      res.status(500).json({ mensaje: 'Se produjo un error al eliminar el servicio' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'El servicio no existe' });
    } else {
      res.json({ mensaje: 'El servicio se ha eliminado correctamente' });
    }
  });
});

// reducir servicios en 1

app.post('/reducirservicio/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET servicios = servicios - 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar servicio en la base de datos:', error);
      res.status(500).send('Error al actualizar servicio en la base de datos');
      return;
    }
    console.log('servicio actualizado correctamente en la base de datos');
    res.status(200).send('servicio actualizado correctamente en la base de datos');
  });
});


// SOLICITUDES

app.delete('/deletesolicitud/:id', (req, res) => {
  const solicitudId = req.params.id;

  // Consulta SQL para eliminar el servicio por ID
  const sql = `DELETE FROM solicitudes WHERE id = ?`;

  // Ejecutar la consulta SQL
  connection.query(sql, [solicitudId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la solicitud:', err);
      res.status(500).json({ mensaje: 'Se produjo un error al eliminar la solicitud' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'La solicitud no existe' });
    } else {
      res.json({ mensaje: 'La solicitud se ha eliminado correctamente' });
    }
  });
});

// reducir solicitudes en 1

app.post('/reducirsolicitud/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET solicitudes = solicitudes - 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar solicitud en la base de datos:', error);
      res.status(500).send('Error al actualizar solicitud en la base de datos');
      return;
    }
    console.log('solicitud actualizada correctamente en la base de datos');
    res.status(200).send('solicitud actualizada correctamente en la base de datos');
  });
});





// RESEÑAS

app.delete('/deleteresena/:id', (req, res) => {
  const resenaId = req.params.id;

  // Consulta SQL para eliminar el servicio por ID
  const sql = `DELETE FROM resenas WHERE id = ?`;

  // Ejecutar la consulta SQL
  connection.query(sql, [resenaId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la resena:', err);
      res.status(500).json({ mensaje: 'Se produjo un error al eliminar la resena' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'La resena no existe' });
    } else {
      res.json({ mensaje: 'la resena se ha eliminado correctamente' });
    }
  });
});

// reducir solicitudes en 1

app.post('/reducirresena/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE usuarios SET resenas = resenas - 1 WHERE id = ?';

  connection.query(sql, [ userId], (error, resultados) => {
    if (error) {
      console.error('Error al actualizar resena en la base de datos:', error);
      res.status(500).send('Error al actualizar resena en la base de datos');
      return;
    }
    console.log('resena actualizada correctamente en la base de datos');
    res.status(200).send('resena actualizada correctamente en la base de datos');
  });
});




// ENDPOINT UNICO PARA CAMBIAR LOS DATOS DEL USUARIO


app.put('/:parametro/cambio/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const campo = req.params.parametro;
  const nuevoValor = req.body[campo];

  // Crear la consulta SQL para actualizar el campo del usuario
  const sql = `UPDATE Usuarios SET ${campo} = ? WHERE id = ?`;

  // Ejecutar la consulta SQL utilizando connection.query()
  connection.query(sql, [nuevoValor, userId], (error, results, fields) => {
    if (error) {
      console.error('Error al actualizar el usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }

    // Verificar si se actualizó algún registro
    if (results.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Si se actualizó, devolvemos el usuario actualizado
    res.json({ message: 'Usuario actualizado correctamente, '  + nuevoValor});
    console.log("esto esta llegando al backend" + nuevoValor ) 
  });
});
