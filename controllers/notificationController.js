const Notification = require("../models/notificationSchema");
const User = require("../models/user.model");

// قواعد مين يبعت لمين
const allowedMap = {
  teacher: ["student", "parent"],
  parent: ["teacher"],
};

const sendNotification = async (req, res) => {
  try {
    const senderId = req.user._id;
    const senderRole = req.user?.role?.name;
    const { recipientId, message } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, message: "recipientId and message are required." });
    }

    const recipient = await User.findById(recipientId).populate("role");
    if (!recipient) {
      return res.status(404).json({ success: false, message: "Recipient not found." });
    }

    const recipientRole = recipient.role?.name;

    if (!allowedMap[senderRole] || !allowedMap[senderRole].includes(recipientRole)) {
      return res.status(403).json({
        success: false,
        message: `You (${senderRole}) cannot send notifications to (${recipientRole}).`,
      });
    }

    const notification = await Notification.create({ recipient: recipientId, sender: senderId, message });

    return res.status(201).json({ success: true, message: "Notification sent.", notification });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }
    return res.status(200).json({ success: true, notification });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendNotification, getMyNotifications, markAsRead, markAllAsRead };