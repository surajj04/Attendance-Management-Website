const mongoose = require("mongoose");

const StudentRegSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        default: false,
        type: Boolean,
    },
    attendance: [{
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'absent',
            enum: ['present', 'absent']
        }
    }]
});

const StudentRegistration = mongoose.model("StudentDB", StudentRegSchema);

module.exports = StudentRegistration;
