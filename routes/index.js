// This file will import both route files and export the constructor method as shown in the lecture code
import announcementRoutes from './announcementPost.js';
import groceryListRoutes from './groceryList.js';
import householdRoutes from './household.js';
import userRoutes from './users.js';
import privateRoutes from './private.js';

import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  app.use('/private/announcements', announcementRoutes);
  app.use('/private/groceryList', groceryListRoutes);
  app.use('/private/household', householdRoutes);
  app.use('/users', userRoutes);
  app.use('/private', privateRoutes);
  app.use('/public', staticDir('public'));

  app.get('/', (req, res) => {
    return res.render('landing/landing', {pageTitle: "Welcome"});
  });

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;