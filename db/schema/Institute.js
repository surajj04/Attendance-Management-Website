const express = require('express');
const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    instituteName: {
        require: true,
        type: String
    },
    email: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    },
    students: [{ type: String }],
    teachers: [{ type: String }],
});

const Institute = mongoose.model('Institute', instituteSchema);
module.exports = Institute;