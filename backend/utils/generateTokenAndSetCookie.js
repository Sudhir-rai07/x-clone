import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = async (userId, res) =>{

    const token =  jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //ms
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"  
    })
}

export default generateTokenAndSetCookie