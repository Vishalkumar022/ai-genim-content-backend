import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:"*",
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import
import userRouter from './routes/user.route.js'
import paymentRouter from './routes/payment.route.js'
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/payment", paymentRouter)


export { app }
