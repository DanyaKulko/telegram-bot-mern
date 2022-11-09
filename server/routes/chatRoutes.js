const {
    getChats,
    sendMessage,
    updateChatToFolders,
    removeChat,
    updateChatInfo,
    addToBlackList,
    removeFromBlackList,
    getAllFromBlackListRequest
} = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require('express').Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/')
    },
    filename: function (req, file, cb) {
        //    make random name
        cb(null, Date.now() + '.' + file.originalname.split('.').pop())
    }
})

//size limit 5mb

const upload = multer({storage: storage});

router.get('/getAll', authMiddleware, getChats)
router.post('/sendMessage', upload.single('image'), authMiddleware, sendMessage)
router.post('/addChatToFolders', authMiddleware, updateChatToFolders)
router.delete('/remove', authMiddleware, removeChat)
router.post('/update', authMiddleware, updateChatInfo)

router.get('/getAllFromBlackListRequest', authMiddleware, getAllFromBlackListRequest)
router.post('/addToBlackList', authMiddleware, addToBlackList)
router.delete('/removeFromBlackList', authMiddleware, removeFromBlackList)

module.exports = router;