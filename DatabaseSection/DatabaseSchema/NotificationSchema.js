import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    },
    task: {
        type: mongoose.Schema.ObjectId,
        ref: 'task'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const NotificationModel = mongoose.model('Notification', NotificationSchema);
export { NotificationModel }