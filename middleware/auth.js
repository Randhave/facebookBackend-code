import jwt from 'jsonwebtoken'
import User from '../model/user.js';


export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log("token form auth ", token)

        if (!token) {
            throw new Error("Unauthorized : No token provided ! Please login")
        }
        const varifiedToken = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = await User.findById(varifiedToken.id); // ye line humne iss liye likh di he kyonki agar user login he to uska sara data req.user me se hum access kr skte he

        next();
    } catch (error) {
        res.status(401).send({ error: `${error.message}` })
    }
}
