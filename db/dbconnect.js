const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://user-04:root123@user-db.kk9mlmy.mongodb.net/?retryWrites=true&w=majority&appName=user-db", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // a48Tv0BpTgnq3Hp7
  
      // family: 4,s
    });
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
