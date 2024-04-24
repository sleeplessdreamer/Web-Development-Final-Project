import {Router} from 'express';
const router = Router();
import {announcementData} from '../data/index.js';

router.route('/')
  .get(async (req, res) => {
    const user = req.session.user;
    const announcements = await announcementData.getAllAnnouncementsByHouseholdName(user.householdName);
    res.render('announcements', 
    {pageTitle: "Announcements Tab",
    authenticated: true,
    household: true,
    announcements
  })
})
 .post(async (req,res) => {

 })

export default router;