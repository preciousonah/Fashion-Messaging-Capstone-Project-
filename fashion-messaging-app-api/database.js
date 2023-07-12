import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('project', 'phi34', 'code', {
  host: 'localhost',
  dialect: 'postgres'
});

