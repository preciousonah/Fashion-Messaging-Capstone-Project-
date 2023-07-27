import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const SearchResult = sequelize.define('SearchResult', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    searchTerm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFashion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
});
