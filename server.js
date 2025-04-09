const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/userRoutes")
const brandRouter = require("./routes/brandRoutes")
const productRouter = require("./routes/productRoutes")
require("dotenv").config()
require("./config/db")

const server = express()
const PORT = 5000

server.use(cors())
server.use(express.json())
server.use(cookieParser())
server.use('/uploads', express.static('uploads'));

// routes
server.use('/api/users', userRouter)
server.use('/api/brands', brandRouter)
server.use('/api/products', productRouter)

server.listen(PORT, () => {
    console.log(`Server started running on PORT: ${PORT}`)
})