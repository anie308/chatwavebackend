const Messages = require("../models/messageModel");

const addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.status(200).json({
        status: "success",
        message: "Message sent",
        data: data,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Message not sent",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const getAllMessages = async(req, res) => {
    try{
        const { from, to } = req.body;
        const messages = await Messages.find({
            users: {
                $all: [from, to]
            }
        }).sort({updatedAt: 1});
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        })

        res.status(200).json(projectedMessages)
    }catch(err){
        console.log(err)
    }
};

module.exports = {
  addMessage,
  getAllMessages,
};