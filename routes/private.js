import {Router} from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    throw `Error: You Must Be Logged In to Access`;
  }
  if (user.householdName.length === 0) {
    res.redirect('/private/household');
    return;
  } else if (user.householdName.length !== 0){
    console.log('hello 2');
    res.redirect('/private/household');
    return;
  }
});


export default router;