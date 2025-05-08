import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        minLength: [4, 'Username is must be at least 4 characters'],
        maxLength: [50, 'Username is exceed of 50 characters'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minLength: [4, 'Password is must be at least 4 characters']
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'manager', 'guest'],
        default: 'user'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const AuthModel = mongoose.model('User', AuthSchema)
export { AuthModel }