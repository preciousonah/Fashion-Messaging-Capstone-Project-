
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const SavedImage = sequelize.define('SavedImage', {
  imageId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
