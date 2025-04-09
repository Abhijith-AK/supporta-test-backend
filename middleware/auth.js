const jwt = require("jsonwebtoken")

const jwtMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies

    if (!accessToken) {
        return res.status(401).json("Authorization Failed.. Token Missing or Expired!!!");
    }

    try {
        const jwtResponse = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.userId = jwtResponse.id
        next()
    } catch (error) {
        res.status(403).json("Authorization Failed.. Please Login!!!")
    }
}

module.exports = jwtMiddleware