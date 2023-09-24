import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import qrCode from 'qrcode';
import config from './config.json' assert { type: "json" };
import db from 'quick.db';
import bcrypt from 'bcrypt';
import session from 'express-session';
import crypto from 'crypto';
import ejs from 'ejs';
import logger from './logger.js';
import cookieParser from 'cookie-parser';

const app = express();

app.set('view engine', 'ejs');

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser()); // Use cookie-parser middleware
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7200000 } // Set cookie expiration time in milliseconds (e.g., 1 day)
}));

app.use(bodyParser.urlencoded({ extended: false }));
// Set the upload limit (default: 500MB)
const uploadLimit = 500 * 1024 * 1024;
app.use(fileUpload({
  limits: { fileSize: uploadLimit }
}));

// Serve the login page
app.get('/', checkLoggedIn, (req, res) => {
  res.render('login');
});
app.get('/login', checkLoggedIn, (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user object from the database
  const user = db.get(`users.${username}`);

  // Check if the user exists
  if (!user) {
    return res.status(400).send('Invalid username or password');
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result) {
      // Passwords match, user is authenticated
      req.session.loggedIn = true; // Save authentication state to session
      res.cookie('loggedInUser', username); // Set loggedInUser cookie
      return res.redirect('/upload');
    } else {
      // Passwords do not match
      return res.status(400).send('Invalid username or password');
    }
  });
});

// Serve the account creation page
app.get('/create-account', (req, res) => {
  res.render('create-account');
});

// Handle account creation form submission
app.post('/create-account', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (db.has(`users.${username}`)) {
    return res.status(400).send('Username already taken');
  }

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      logger.error(err);
      return res.status(500).send('Internal Server Error');
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        logger.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Create a new user object with the hashed password
      const user = {
        username: username,
        password: hash
      };

      // Store the user object in the database
      db.set(`users.${username}`, user);

      // Redirect to the login page after successful account creation
      res.redirect('/');
    });
  });
});

// Authentication middleware
function authenticate(req, res, next) {
  // Check if the user is logged in
  if (req.session.loggedIn) {
    // User is authenticated, allow access to the next middleware or route
    next();
  } else {
    // Check if there is a loggedInUser cookie and restore the session
    if (req.cookies.loggedInUser) {
      req.session.loggedIn = true;
      req.session.user = req.cookies.loggedInUser;
      return next();
    }
    // User is not logged in, redirect to the login page
    res.redirect('/');
  }
}

function checkLoggedIn(req, res, next) {
  if (req.session.loggedIn) {
    return res.redirect('/upload');
  }
  next();
}


// Serve the upload form page
app.get('/upload', authenticate, (req, res) => {
  const username = req.cookies.loggedInUser; // Get the loggedInUser cookie value
  res.render('upload', { username });
});


// Handle file upload
app.post('/upload', authenticate, async (req, res) => {
  const username = req.cookies.loggedInUser;
  // Check if a file was uploaded
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file was uploaded.');
  }

  const file = req.files.file;
  const fileName = file.name;
  const filePath = path.join(__dirname, 'uploads', fileName);
  const downloadLink = `${config.domain}/download/${file.name}`;

  // Encrypt the file
  const encryptedFilePath = encryptFile(file.data, filePath);

  // Generate the QR code image
  const qrCodeImage = await qrCode.toDataURL(downloadLink);

  // Display the file name, download link, and QR code on the upload success page
  res.send(`
<div class="Download">
    <h2>File uploaded successfully!</h2>
    <p>File name: ${file.name}</p>
    <p>Uploaded By: ${username}</p>
    <p>Download link: <a href="${downloadLink}">${downloadLink}</a></p>
    <img src="${qrCodeImage}" alt="QR Code">
    <p>Download the file before it gets deleted. It will be deleted in 60 minutes.</p>
</div>

<style>
    .Download {
        text-align: center;
        padding: 20px;
        background-color: #1e1e1e;
        border-radius: 10px;
        box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.1);
        color: #fff;
    }

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    p {
        font-size: 16px;
        margin-bottom: 10px;
    }

    img {
        padding: 5px;
        width: 120px;
    }
</style>

`);
  logger.info(`${fileName} Is Just Uploaded By ${username}. And It's Have 60min To Get Downloaded.`)
  setTimeout(() => {
    logger.info(`${fileName} Is Now Deleting After 30mins Of Upload....`);
    deleteFile(filePath);
    // set file delete time
  }, 60 * 60 * 1000);
});

// Handle file download
app.get('/download/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Decrypt the file
  const decryptedFilePath = decryptFile(filePath);

  res.download(decryptedFilePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error occurred while downloading the file.');
    }

    // Delete the decrypted file after download
    logger.info(`Decrypted ${fileName} Is Now Deleting Because It's Downloaded.....`);
    deleteFile(decryptedFilePath);
  });
});

// file delete handler
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info('File Deleted Successfully.');
    }
  });
}


// Encrypt file
function encryptFile(fileData, filePath) {
  const key = crypto.createHash('sha256').update(path.basename(filePath)).digest('hex').slice(0, 32);
  const iv = crypto.createHash('sha256').update(path.basename(filePath)).digest('hex').slice(0, 16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  const encryptedData = Buffer.concat([
    cipher.update(fileData),
    cipher.final()
  ]);

  fs.writeFileSync(filePath, encryptedData);

  return filePath;
}

// Decrypt file
function decryptFile(filePath) {
  const encryptedData = fs.readFileSync(filePath);

  const key = crypto.createHash('sha256').update(path.basename(filePath)).digest('hex').slice(0, 32);
  const iv = crypto.createHash('sha256').update(path.basename(filePath)).digest('hex').slice(0, 16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const decryptedData = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final()
  ]);

  const decryptedFilePath = filePath.replace('/uploads/', '/decrypted/');
  fs.writeFileSync(decryptedFilePath, decryptedData);

  return decryptedFilePath;
}

// Start the server
app.listen(config.port, () => {
  logger.info(`Server Started On Port ${config.port}`);
});
