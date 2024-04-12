import {Router} from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  res.json({route: '/private', method: req.method});


  return res.render('users/info', {pageTitle: 'Your Profile', authenticated: true, user: user});

});



export default router;