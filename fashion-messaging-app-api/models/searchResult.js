import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const SearchResult = sequelize.define('SearchResult', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    searchTerm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      searchCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFashion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      imageId: { 
        type: DataTypes.STRING,
        allowNull: true
      }
});