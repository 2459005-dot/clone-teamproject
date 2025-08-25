const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.cookies?.auth

    if (!token) return res.status(401).json({ message: '인증 필요 토큰 없음' })

    try {
        const playload = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user =playload
        next()
    } catch (error) {
        return res.status(401).json({message:'유효하지 않은 토큰'})
    }

}