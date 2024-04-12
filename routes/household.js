import {Router} from 'express';
const router = Router();
import {householdData} from '../data/index.js';

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    throw `Error: You Must Be Logged In to Access`;
  }
  // Redirect to Correct Place depending on if they have a household or not
  if (user.householdName.length === 0) {
    res.redirect('/private/household/new');
    return;
  } else if (user.householdName.length !== 0) {
    res.redirect('/private/household/info');
    return;
  }
});

router
  .get('/new', async (req, res) => {
    const user = req.session.user;
    if (!user) {
      throw `Error: You Must Be Logged In to Access`;
    }
    // Redirect to Correct Place depending on if they have a household or not
    if (user.householdName.length !== 0) {
      res.redirect('/private/household/info');
      return;
    }
    res.render('household/new', {pageTitle: 'New', user});
    return;
})
  .post(async(req,res) => {

});

router
  .get('/info', async (req, res) => {
    const user = req.session.user;
    if (!user) {
      throw `Error: You Must Be Logged In to Access`;
    }
    // Redirect to Correct Place depending on if they have a household or not
    if (user.householdName.length === 0) {
      res.redirect('/private/household/new');
      return;
    }
    res.render('household/info', {pageTitle: 'Info', user});
    return;
});


router
  .get('/create', async (req, res) => {
    const user = req.session.user;
    if (!user) {
      throw `Error: You Must Be Logged In to Access`;
    }
    // Redirect to Correct Place depending on if they have a household or not
    if (user.householdName.length !== 0) {
      res.redirect('/private/household/info');
      return;
    }
    res.render('household/create', {pageTitle: 'Create Hosehold', user});
    return;
});

router
  .get('/join', async (req, res) => {
    const user = req.session.user;
    if (!user) {
      throw `Error: You Must Be Logged In to Access`;
    }
    // Redirect to Correct Place depending on if they have a household or not
    if (user.householdName.length !== 0) {
      res.redirect('/private/household/info');
      return;
    }
    res.render('household/join', {pageTitle: 'Join Hosehold', user});
    return;
})
  .post(async(req,res) => {

});

export default router;