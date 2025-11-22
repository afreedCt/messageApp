const mongoose = require("mongoose");
const { Message } = require("../Models/messageModel");

const getAllMessagesController = async (req, res) => {
  const room = req.params.room;
  try {
    const messages = await Message.find({ room }).sort({ date: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(401).json({ succes: false, message: error.message });
  }
};


module.exports = { getAllMessagesController };
