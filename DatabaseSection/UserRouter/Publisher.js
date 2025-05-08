import bcrypt, { truncates } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthModel } from '../DatabaseSchema/AuthSchema.js'

const UserLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: 'Username and Password is required.',
                success: false
            })
        }
        const User = await AuthModel.findOne({ username })
        if (!User) {
            return res.status(404).json({
                message: 'Username is invalid, Please check and login',
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, User.password)
        if (!isMatch) {
            return res.status(401).json({
                message: 'Password is invalid, Please check and login',
                success: false
            })
        }
        const secret_key = process.env.SECRETE_kEY

        const token = jwt.sign({
            email: User.email,
            username: User.username,
            password: User.password,
            role: User.role
        }, secret_key, { expiresIn: '1d' })
        return res.status(200).json({
            token,
            role: User.role,
            message: 'Successfully Login',
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const UserRegister = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const saltRounds = 12;

        if (!email?.trim() || !username?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: 'Email, username, and password are required.',
                success: false
            })
        }

        const genSalt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, genSalt);

        const secreteKey = process.env.SECRETE_kEY
        const token = jwt.sign({
            email: email,
            username: username,
            password: hashPassword,
            role: role || 'user'
        }, secreteKey, { expiresIn: '1d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
        });

        const registerOnDatabase = new AuthModel({
            email: email,
            username: username,
            password: hashPassword,
            role: role || 'user',
        })

        const data = await registerOnDatabase.save();
        return res.status(200).json({
            message: 'Successfully registered.',
            success: true,
            data: data,
            token,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const UpdateRole = async (req, res) => {
    const { id, role } = req.body;
    try {
        if (!id || !role) {
            return res.status(404).json({
                message: 'Id and Role is required',
                success: false
            })
        }
        const userData = await AuthModel.findByIdAndUpdate(id, {
            role: role
        }, { new: true })
        return res.status(200).json({
            message: 'Successfully updated.',
            success: true,
            data: userData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const GetAllUser = async (req, res) => {
    try {
        const users = await AuthModel.find({})
        return res.status(200).json({
            message: 'Successfully fetched the data.',
            data: users,
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const UpdateUser = async (req, res) => {
    const { role, username } = req.body;
    try {
        if (!role || !username) {
            return res.status(404).json({
                message: 'User or Role is required.',
                success: false,
            })
        }
        const updateUser = await AuthModel.findOne({ username });

        if (!updateUser) {
            return res.status(403).json({
                message: 'Username is not valid',
                success: false
            })
        }
        const updateUserById = await AuthModel.findByIdAndUpdate(updateUser._id, {
            role: role,
        }, { new: true })

        if (!updateUserById) {
            return res.status(403).json({
                message: 'Role is not updated',
                success: false
            })
        }
        return res.status(201).json({
            data: updateUserById,
            message: 'Successfully updated the role',
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'soething went wrong, Please ry agan later.',
            success: false
        })
    }
}

export { UserLogin, UserRegister, UpdateRole, GetAllUser, UpdateUser }