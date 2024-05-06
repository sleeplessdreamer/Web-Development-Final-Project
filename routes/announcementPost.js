import {Router} from 'express';
const router = Router();
import {announcementData} from '../data/index.js';
import {checkString} from '../validation.js';

router.route('/')
  .get(async (req, res) => {
    const user = req.session.user;
    try { // extra error checking
      user.householdName = checkString(user.householdName);
    } catch (e) {
      res.status(400).render('error', 
      {pageTitle: "Error",
      authenticated: true,
      household: true,
      error: e
    })
    return;
    }
    const announcements = await announcementData.getAllAnnouncementsByHouseholdName(user.householdName);
    res.status(200).render('announcements', 
    {pageTitle: "Announcements",
    authenticated: true,
    household: true,
    announcements
  })
})
 .post(async (req,res) => {
  const user = req.session.user;
  try{
    user.householdName = checkString(user.householdName);
  } catch (e) {
    res.status(400).render('error', 
    {pageTitle: "Error",
    authenticated: true,
    household: true,
    error: e
  })
  }
  const {announcement} = req.body;
  if (!announcement) {
      res.status(400).render('error', {
      pageTitle: "Error",
      authenticated: true,
      household: true,
      error: "Announcement is required to make an announcement"
    })
    return;
  }
  try{
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const date = `${month}/${day}/${year}`;
    const time = currentDate.toLocaleTimeString();
    const newAnnouncement = { // UNSURE OF THIS SECTION OF CODE
      action: "announcement",
      groceryItem: checkString(groceryItem), 
      groceryList: checkString(groceryList),
      comment: checkString(comment),
      userId: user._id
    };  // UP TO HERE
    const announcementCreated = await announcementData.newAnnouncement(newAnnouncement);
    if (!announcementCreated) {
        res.status(400).render('error', {
          pageTitle: "Error",
          authenticated: true,
          household: true,
          error: "Announcement could not be created"
        })
      return;
    }
    else{
      res.status(200).redirect('/announcements');
    }
  }
  catch (e) {
    res.status(400).render('error', { 
      pageTitle: "Error",
      authenticated: true,
      household: true,
      error: e
    })
  }
});

export default router;