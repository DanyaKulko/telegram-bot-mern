const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {userLogin, userSignup, checkAuth} = require("../controllers/userController");

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.post('/checkAuth', authMiddleware, checkAuth);


module.exports = router;