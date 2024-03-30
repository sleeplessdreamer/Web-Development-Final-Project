// This file will import both route files and export the constructor method as shown in the lecture code
import announcementRoutes from './announcementPost.js';
import groceryListRoutes from './groceryList.js';
import householdRoutes from './household.js';
import userRoutes from './users.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  app.use('/announcements', announcementRoutes);
  app.use('/groceryList', groceryListRoutes);
  app.use('/household', householdRoutes);
  app.use('/user', userRoutes);
  app.use('/public', staticDir('public'));

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;