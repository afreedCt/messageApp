const express = require("express");
const { loginController, registerController, getAllUsersController } = require("../controllers/userController");
const { getAllMessagesController } = require("../controllers/messageController");

const router=express.Router();

router.post('/login',loginController);
router.post('/register',registerController);
router.get('/users/:id',getAllUsersController);
router.get('/messages/:room',getAllMessagesController);

module.exports=router; 