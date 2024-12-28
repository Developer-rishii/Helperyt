const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/referralDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully!"))
.catch((err) => console.error("Failed to connect to MongoDB:", err));  

// Define a generic schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    referralCode: String
});

// Function to get the appropriate model based on referral code
function getModelByReferralCode(referralCode) {
    let collectionName;
    if (referralCode === "RISHI123") {
        collectionName = "user1";
    } else if (referralCode === "VANSH123") {
        collectionName = "user2";
    } else {
        collectionName = "unknownUsers"; // Fallback for invalid referral codes
    }
    return mongoose.model(collectionName, userSchema, collectionName);
}

// Route to handle form submission
app.post("/submit", async (req, res) => {
    const { name, email, referralCode } = req.body;

    try {
        // Get the appropriate model based on the referral code
        const UserModel = getModelByReferralCode(referralCode);

        // Save the user data to the appropriate collection
        const user = new UserModel({ name, email, referralCode });
        await user.save();

        res.status(201).send({ 
            message: `User data saved successfully.` 
        });
    } catch (error) {
        console.error("Error saving user data:", error);
        res.status(500).send({ error: "Error saving user data." });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
