import mongoose from "mongoose";

// The database Schema with strict rules
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        trim: true,
        minLength: [3, 'Title must be at least 3 characters'],
        maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        trim: true,
        minLength: [10, 'Description must be at least 3 characters'],
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    priority: {
        type: String,
        required: true,
        enum: {
            values: ['Low', 'Medium', 'High', 'Critical'],
            message: 'Priority must be either Low, Medium, High, or Critical'
        },
        default: 'Medium'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'In Progress', 'Completed', 'Archived'],
            message: 'Invalid status value'
        },
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Due date must be in the future'
        },
        set: function (date) {
            return new Date(date).setHours(0, 0, 0, 0)
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createAt: {
        type: Date,
        default: new Date
    }
}, {
    timestamps: false,
    toJSON: { getters: true },
    toObject: { getters: true }
})


const TaskModel = mongoose.model('task', TaskSchema)
export { TaskModel }