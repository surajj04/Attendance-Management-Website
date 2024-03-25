const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    rollNo: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default:'absent',
        enum: ['present', 'absent']
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
