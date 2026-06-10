// const express=require("express")
// const mongoose=require("mongoose")
// const cors=require("cors")
// const taskRoutes=require("./routes/taskRoutes")
// const app=express()
// app.use(cors())
// app.use(express.json())
// app.use('/api/tasks',taskRoutes)
// // app.use('/getTask',taskRoutes)

// // mongoose.connect("mongodb+srv://paramita:A2MwkIUUXoTjRVrL@cluster0.kj8ditx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// mongoose.connect("mongodb+srv://paramita:Sm52OqqzmQtR76dq@cluster0.od6zsr1.mongodb.net/?appName=Cluster0")
// .then(()=>{app.listen(5000,()=>console.log("server running at 5000"))}).catch((err)=>{console.log(err)})

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import your newly structured routes
const authRoutes = require("./middleware/auth");
const moodRoutes = require("./routes/mood");

const app = express();

app.use(cors());
app.use(express.json());

// Fallback key so token generation works smoothly
process.env.JWT_SECRET = process.env.JWT_SECRET || "temporary_portfolio_secret_key_123";

// Map endpoints to routes
app.use('/api/auth', authRoutes); // Handles /register and /login
app.use('/api/moods', moodRoutes); // Handles CRUD, filtering, and sorting

// Database connection
mongoose.connect("mongodb+srv://paramita:Sm52OqqzmQtR76dq@cluster0.od6zsr1.mongodb.net/?appName=Cluster0")
.then(() => {
    app.listen(5000, () => console.log("Server running perfectly at port 5000"));
})
.catch((err) => {
    console.log("Database connection error: ", err);
});