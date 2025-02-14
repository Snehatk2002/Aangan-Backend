const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { userModel } = require("./models/user")
const TeenagerModel = require("./models/teenager")
const PregnantModel = require("./models/pregnantwomen")
const ChildModel = require("./models/child")
const { feedbackModel } = require("./models/feedback")
const SlotModel = require("./models/book")
const { adminModel } = require("./models/admin")


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://snehatk:6282011259@cluster0.jd3vcot.mongodb.net/aangancaredb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async(password) =>{
    const salt = await bcrypt.genSalt(10)  
    return bcrypt.hash(password,salt)
}


//--------------------------------------------------------------USER----------------------------------------------

app.post("/userSignUp",async(req,res)=>{

    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)

    input.password = hashedPassword     
    let user = new userModel(input)
    user.save()
    console.log(user)

    res.json({"status":"success"})
})


app.post("/userSignIn", (req, res) => {
    let input = req.body
    userModel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbPassword = response[0].password  //entered email is compared with existing password(email)
                console.log(dbPassword)
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => { //input pswd and hashed pswd is  compared
                    if (isMatch) {
                        //if login success generate token
                        jwt.sign({ email: input.email }, "aangancare-app", { expiresIn: "1d" },
                            (error, token) => {
                                if (error) {
                                    res.json({ "status": "unable to create token" })
                                } else {
                                    res.json({ "status": "success", "userId": response[0]._id, "token": token })
                                }
                            }
                        )
                    } else {
                        res.json({ "status": "incorrect" })
                    }
                })

            } else {
                res.json({ "status": "user not found" })
            }
        }
    ).catch()
})

app.post("/AdminLogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "aangancare-app", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        adminModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "aangancare-app", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
});



app.post("/Teenager", async (req, res) => {
    try {
        let input = req.body;
        let teenager = new TeenagerModel(input);
        await teenager.save();
        res.json({ "status": "success", "data": teenager });
    } catch (error) {
        res.status(500).json({ "status": "error", "message": error.message });
    }
});
app.post("/pregnant", async (req, res) => {
    try {
        let input = req.body;
        let pregnant = new PregnantModel(input);
        await pregnant.save();
        res.json({ status: "success", data: pregnant });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Register a child in Anganwadi
app.post("/child", async (req, res) => {
    try {
        let input = req.body;
        let child = new ChildModel(input);
        await child.save();
        res.json({ status: "success", data: child });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

//-------------------------------------------FEEDBACK---------------------------------------------------------



// Submit feedback
app.post('/submitFeedback', async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ status: 'error', message: 'email and message are required.' });
    }

    try {
        // Create feedback entry
        const newFeedback = new feedbackModel
        ({
            feedbackId: Date.now().toString(), // Use current timestamp as a unique ID
            email,
            message,
            submittedDate: new Date() // Automatically sets current date
        });

        // Save feedback to the database
        const savedFeedback = await newFeedback.save();
        res.status(201).json({ status: 'success', data: savedFeedback });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
})


app.get('/viewFeedbacks', async (req, res) => {
    try {
        const feedbacks = await feedbackModel.find(); // Use feedbackModel
        res.json({ status: "success", data: feedbacks });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})


// Route to delete feedback by ID (admin side)
app.delete('/deleteFeedback/:feedbackId', async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId.trim(); // Extract and trim feedbackId from URL parameters

        const deletedFeedback = await feedbackModel.findOneAndDelete({ feedbackId });

        if (!deletedFeedback) {
            return res.status(404).json({ status: "error", message: "Feedback not found" });
        }

        res.json({ status: "success", message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


// Route to delete feedback by ID (admin side)
app.delete('/deleteFeedback/:feedbackId', async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId.trim(); // Extract and trim feedbackId from URL parameters

        const deletedFeedback = await feedbackModel.findOneAndDelete({ feedbackId });

        if (!deletedFeedback) {
            return res.status(404).json({ status: "error", message: "Feedback not found" });
        }

        res.json({ status: "success", message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});
//--------------------------------------SLOT BOOKING-----------------------------------------------------
app.post("/book", async (req, res) => {
    const { name, email, contact, age, date, time, location, vaccineType, doseNumber } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !contact || !age || !date || !time || !location || !vaccineType ) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        // Check if the slot is already booked
        const existingBooking = await SlotModel.findOne({
            location,
            vaccineType,
            date,
            time
        });

        if (existingBooking) {
            return res.status(409).json({ status: 'error', message: 'Slot already booked for this time' });
        }

        // Create new booking
        const newSlot = new SlotModel({
            name,
            email,
            contact,
            age,
            date,
            time,
            location,
            vaccineType,
            status: "Booked",
            bookedAt: new Date()
        });

        await newSlot.save();

        return res.status(201).json({ status: 'success', message: 'Slot successfully booked' });

    } catch (error) {
        console.error("Error during slot booking:", error);
        return res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
    }
});

app.post("/Viewbook", async (req, res) => {
    try {
        const slots = await SlotModel.find();
        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching workout schedule:", error);
        res.status(500).json({ status: "error", message: "Server error. Please try again later." });
    }
});

app.delete('/cancel/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await SlotModel.deleteMany({ email });
        if (result.deletedCount > 0) {
            res.status(200).json({ status: 'success', message: 'Slot deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

app.listen(8080, () => {
    console.log("server started")
})
