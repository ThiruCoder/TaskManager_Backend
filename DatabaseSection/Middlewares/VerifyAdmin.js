import jwt from 'jsonwebtoken'

const VerifyAdminOrUser = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided!',
            sucess: false
        })
    }

    const token = authToken.split(' ')[1];
    try {
        const secreteKey = process.env.SECRETE_kEY
        const decoded = jwt.verify(token, secreteKey)
        if (!decoded) {
            return res.status(404).json({
                message: 'Un authorized - Please try gain later.',
                success: false
            })
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error,
            sucess: false
        })
    }
}

const VerifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(404).json({
            message: 'Token is required.',
            success: false
        })
    }
    const secreteKey = process.env.SECRETE_kEY
    const decoded = jwt.verify(token, secreteKey)
    if (!decoded) {
        return res.status(404).json({
            message: 'Token is not active.',
            success: false
        })
    }
    return res.status(200).json({
        data: decoded,
        message: 'Token is active.',
        success: true
    })
}

export { VerifyAdminOrUser, VerifyToken }

// if (decoded.role !== 'admin') {
//     NormalUsername = decoded.username;
//     return res.status(200).json({
//         message: 'Wellcome to the User page',
//         data: {
//             email: decoded.email,
//             username: decoded.username,
//             role: decoded.role
//         },
//         sucess: true
//     })
// }