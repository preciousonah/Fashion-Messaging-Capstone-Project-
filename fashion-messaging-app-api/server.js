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
import { User, Post, SearchResult } from './models/index.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';
import { Op } from 'sequelize';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express();


const API_KEY = "06ZcwjgbmJBM8T2TxLUZ5iwdXXGxiAgz0Z018b7QPKwR1ExipkFjaAuw";
const clientAPI = createClient(API_KEY);
const defaultQuery = "Fashion";
const PHOTOS = 10;

let cache = new Map();
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json()); 
app.use(morgan('combined')); 


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

app.use((req, res, next) => {
  next();
});

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

    app.get('/photos', async (req, res) => {
      const query = req.query.search || defaultQuery;
      const perPage = (query === defaultQuery) ? 20 : PHOTOS; 
    
      try {
        const response = await clientAPI.photos.search({ query, per_page: perPage, page: 1});
        let fetchPromises = response.photos.map(async photo => {
          if (cache.has(photo.src.original)) { 
            return cache.get(photo.src.original);
            
          } else if (query !== defaultQuery) { 
           
            var myHeaders = new Headers();
            myHeaders.append("x-api-key", "7008b5da328806c39a5561c3d51339c18dbb66dcd8bbfeebca80f0a96c44c332");      
            
          
            var formdata = new FormData();
            formdata.append("image_url", photo.src.original);
    
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
            };
    
            try {
              const fetchResponse = await fetch('https://cloudapi.lykdat.com/v1/detection/items', requestOptions);      
              if (fetchResponse.status === 400) {
                throw new Error('Image size too large for the API.');
              }
              const result = await fetchResponse.json();
    
              if (result.data.detected_items.length > 0) {
                cache.set(photo.src.original, photo); 
                return photo;
              }
    
            } catch (error) {
              console.error('error', error);
              return null;
            }
          }
          else if (query === defaultQuery) {
            cache.set(photo.src.original, photo); 
            return photo;
          }
        });
    
        const fashionPhotos = await Promise.all(fetchPromises);
        const validPhotos = fashionPhotos.filter(photo => photo !== undefined && photo !== null);
    
    for (let photo of validPhotos) {
      let searchResult = await SearchResult.findOne({
        where: { 
          searchTerm: query,
          userId: req.session.user ? req.session.user.id : null,
        },
      });     
      if (searchResult) {
        searchResult.searchCount += 1;
        await searchResult.save();
      } else {
        await SearchResult.create({
          searchTerm: query,
          imageUrl: photo.src.original,
          isFashion: true,  
          userId: req.session.user ? req.session.user.id : null,  
          searchCount: 1,
        });
      }    
    }

    res.json(validPhotos);
  
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({message: error.message});
  }
});

app.get('/recommendations', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let recommendations = {
      lastSearch: [],
      mostFrequent: [],
      posts: [],
      popularSearch: [],
    };
    const frequentSearch = await SearchResult.findOne({
      where: { 
        userId: req.session.user.id,
        searchTerm: {
          [Op.not]: defaultQuery 
        }
      },
      order: [['searchCount', 'DESC']],
    });
    const lastSearch = await SearchResult.findOne({
      where: { 
        userId: req.session.user.id,
        searchTerm: {
          [Op.not]: defaultQuery  
        }
      },
      order: [['createdAt', 'DESC']],
    });

    const popularSearch = await SearchResult.findOne({
      attributes: ['searchTerm', [sequelize.fn('COUNT', sequelize.col('searchTerm')), 'searchCount']],
      group: ['searchTerm'],
      where: {
        searchTerm: {
          [Op.not]: defaultQuery  
        }
      },
      order: [[sequelize.fn('COUNT', sequelize.col('searchTerm')), 'DESC']],
      raw: true,
    });

    const latestPost = await Post.findOne({
      where: { 
        userId: req.session.user.id
      },
      order: [['createdAt', 'DESC']],
    });

    if (latestPost) {
      const responseLatestPost = await clientAPI.photos.search({ 
        query: latestPost.title,  
        per_page: PHOTOS 
      });
      responseLatestPost.photos.forEach(photo => {
        photo.source = "latest post";
      });
      recommendations.posts.push(...responseLatestPost.photos);
    }

    if (!frequentSearch && !lastSearch && !popularSearch) {
      return res.json([]);  
    }

    if (frequentSearch) {
      const responseFrequentSearch = await clientAPI.photos.search({ 
        query: frequentSearch.searchTerm, 
        per_page: PHOTOS 
      }); 

      responseFrequentSearch.photos.forEach(photo => {
        photo.source = "most frequent search";
      });
      recommendations.mostFrequent.push(...responseFrequentSearch.photos);
    }

    if (lastSearch && (!frequentSearch || (frequentSearch && frequentSearch.searchTerm !== lastSearch.searchTerm))) {
      const responseLastSearch = await clientAPI.photos.search({ 
        query: lastSearch.searchTerm, 
        per_page: PHOTOS 
      });
      responseLastSearch.photos.forEach(photo => {
        photo.source = "last search";
      });
      recommendations.lastSearch.push(...responseLastSearch.photos);
    }
    if (popularSearch && (!frequentSearch || (frequentSearch && frequentSearch.searchTerm !== popularSearch.searchTerm)) && (!lastSearch || (lastSearch && lastSearch.searchTerm !== popularSearch.searchTerm))) {
      const responsepopularSearch = await clientAPI.photos.search({ 
        query: popularSearch.searchTerm, 
        per_page: PHOTOS 
      });
      responsepopularSearch.photos.forEach(photo => {
        photo.source = "popular search";
      });
      recommendations.popularSearch.push(...responsepopularSearch.photos);
    }

    return res.json(recommendations);
    
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ message: error.message });
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