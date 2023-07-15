import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './database.js';
import { User, Post } from './models/index.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json()); 
app.use(morgan('combined')); 


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


app.post('/posts', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentUser = req.session.user;
    const post = await Post.create({
      ...req.body,
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

