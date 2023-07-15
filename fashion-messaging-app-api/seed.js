
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Post } from './models/index.js';
import { sequelize } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/users.json'), 'utf8'));
const postData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/posts.json'), 'utf8'));

const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    await User.bulkCreate(userData);

    await Post.bulkCreate(postData);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();