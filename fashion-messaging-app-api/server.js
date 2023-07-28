import { createClient } from "pexels";
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { body, validationResult} from 'express-validator';
import path from 'path';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import { sequelize } from './database.js';
import { User, Post } from './models/index.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express();


const API_KEY = "06ZcwjgbmJBM8T2TxLUZ5iwdXXGxiAgz0Z018b7QPKwR1ExipkFjaAuw";
const clientAPI = createClient(API_KEY);
const defaultQuery = "Fashion";
const PHOTOS = 1;


app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json()); 
app.use(morgan('combined')); 


app.get('/photos', async (req, res) => {
  const query = req.query.search || defaultQuery;
  
  try {
    const response = await clientAPI.photos.search({ query, per_page: PHOTOS });
   
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "4d552e9f30522b1dec7c712f83c67c235be86e25ec14b4ba3493383ec7b81d3f");                               

    let fetchPromises = await Promise.all(response.photos.map(async photo => { 
      var formdata = new FormData();
      formdata.append("image_url", photo.src.original);
    

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
      };

      try {
        const fetchResponse = await fetch('https://cloudapi.lykdat.com/v1/detection/items', requestOptions);
        const result = await fetchResponse.json();     

        if (result.data.detected_items.length > 0) {
          return photo;     
        }
       
      } catch (error) {
        console.error('error', error);
      }
     
    }));

    const fashionPhotos = fetchPromises.filter(photo => photo !== undefined)
    res.json(fashionPhotos);

  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({message: error.message});
  }
});


const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null, 'images/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000'},
  fileFilter: (req, file, cb) => {
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
  return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
},
  limits: { fileSize: 1024 * 1024 * 10 }
});
app.use('/images', express.static(path.join(__dirname, 'images')));

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) 
    }
  })
);
sessionStore.sync();

app.use(userRoutes);
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/posts', upload.single('picture'),
 async (req, res) => {

    const errors = validationResult(req);
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const currentUser = req.session.user;
      const post = await Post.create({
        ...req.body,
        picture: req.file.filename, 
        userId: currentUser.id
    
    });
      const postWithUser = await Post.findOne({
        where: { id: post.id },
        include: [{ model: User, as: 'user' }]
      });
      res.status(201).json(postWithUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

sequelize.sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });