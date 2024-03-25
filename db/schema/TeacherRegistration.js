const mongoose = require("mongoose");

const teacherRegSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    _class: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    lectures: [{
        date: {
            type: Date,
            default: Date.now
        },
        totalStudents: {
            type: Number,
            required: true
        }
    }]
});


const TeacherRegModel = mongoose.model("TeacherDB", teacherRegSchema);

module.exports = TeacherRegModel;
