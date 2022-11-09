const router = require('express').Router();

const {
    createFolder,
    getFolders,
    getFolder,
    addChatToFolder,
    deleteFolder,
    deleteChatFromFolder,
    sendMessage,
    updateFolderInfo
} = require("../controllers/folderController");
const authMiddleware = require('../middlewares/authMiddleware');

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
const upload = multer({storage: storage});

router.post('/create', authMiddleware, createFolder)
router.get('/getAll', authMiddleware, getFolders)
router.get('/getById', authMiddleware, getFolder)
router.post('/addChat', authMiddleware, addChatToFolder)
router.post('/sendMessage', upload.single('image'), authMiddleware, sendMessage)
router.delete('/delete', authMiddleware, deleteFolder)
router.delete('/deleteChat', authMiddleware, deleteChatFromFolder)
router.post('/update', authMiddleware, updateFolderInfo)

module.exports = router;