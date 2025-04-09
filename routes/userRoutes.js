const express = require("express")
const userController = require("../controllers/userController")
const jwtMiddleware = require("../middleware/auth")
const upload = require('../middleware/multerMiddleware');

const userRouter = new express.Router

userRouter.post('/login', userController.loginUserController)
userRouter.post('/register', upload.single('profilePhoto'), userController.registerUserController)
userRouter.post('/refresh-token',  userController.refreshTokenController)

// protected routes
userRouter.put('/profile', jwtMiddleware, upload.single('profilePhoto'), userController.updateUserController);
userRouter.delete('/profile', jwtMiddleware, userController.deleteUserController);
userRouter.post('/block/:userId', jwtMiddleware, userController.blockUserController);
userRouter.post('/unblock/:userId', jwtMiddleware, userController.unblockUserController);

module.exports = userRouter