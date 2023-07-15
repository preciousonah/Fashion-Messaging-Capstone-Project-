import bcrypt from 'bcrypt';
import {User }from './models/user.js'; 
async function migrateUsers() {
  try {
    const users = await User.findAll(); 

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await user.update({ password: hashedPassword });
    }
  } catch (error) {
    console.error('User migration failed:', error);
  }
}

migrateUsers(); 