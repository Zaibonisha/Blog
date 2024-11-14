const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");  // Import cors
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());

// Enable CORS
app.use(cors()); 

app.use("/images", express.static(path.join(__dirname, "/images")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'images');
      cb(null, uploadDir);  // Use absolute path
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);  // Use req.body.name for the filename
    },
  });
  

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Backend is running.");
});
