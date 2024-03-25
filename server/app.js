const express = require('express');
const connectdb = require('../db/dbconnect');
const path = require('path');
const bodyParser = require('body-parser');

// Import models
const studentReg = require("../db/schema/StudentRegistration");
const teacherReg = require("../db/schema/TeacherRegistration");
const instituteReg = require('../db/schema/Institute');

const { error } = require('console');

// Connect to the database
connectdb();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const viewPath = path.join(__dirname, "../views");
app.set("views", viewPath);
app.set("view engine", "ejs");
app.use(express.static('public'));

let userLogin;
let userData;
let TempInstituteName;

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (userLogin) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get("/", (req, res) => {
    res.render("index", { isLogin: userLogin });
});

app.get("/login", (req, res) => {
    res.render('login', { isLogin: userLogin });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkStu = await studentReg.findOne({ email });
        const checkTea = await teacherReg.findOne({ email });
        const checkInst = await instituteReg.findOne({ email });

        if (checkStu) {
            if (checkStu.active) {
                userData = await studentReg.findOne({ email });
                data = JSON.stringify(userData);
                if (userData.password === password) {
                    userLogin = "student";
                    res.redirect("/studentclass");
                } else {
                    let msg1 = "Password incorrect";
                    let msg = "";
                    res.render('error', { errorMessage: msg, message1: msg1, isLogin: userLogin });
                }
            } else {
                let msg1 = "User is not active.";
                let msg = "Please contact your college to approve the student request.";
                res.render('error', { errorMessage: msg, message1: msg1, isLogin: userLogin });
            }

        } else if (checkTea) {
            if (checkTea.active) {
                userData = await teacherReg.findOne({ email });
                studentData = await studentReg.find({}).sort({ rollNo: 1 });;

                data = JSON.stringify(userData);
                if (userData.password === password) {
                    userLogin = "teacher";
                    res.redirect("/classroom")
                } else {
                    let msg1 = "Password incorrect";
                    let msg = ""
                    res.render('error', { errorMessage: msg, message1: msg1, isLogin: userLogin });
                }
            } else {
                let msg1 = "User is not active.";
                let msg = "Please contact your college to approve the teacher request.";
                res.render('error', { errorMessage: msg, message1: msg1, isLogin: userLogin });
            }
        } else if (checkInst) {
            userData = await instituteReg.findOne({ email });
            TempInstituteName = userData.instituteName;
            data = JSON.stringify(userData);
            if (userData.password === password) {
                userLogin = "Institute";
                res.redirect('/instituteDashboard');
            } else {
                let msg1 = "Password incorrect";
                let msg = "";
                res.render('error', { errorMessage: msg, message1: msg1, isLogin: userLogin });
            }
        } else {
            userLogin = "";
            res.render('usernotfound', { isLogin: userLogin });
        }
    } catch (error) {
        console.error(error);
        let msg = "";
        res.render('error', { errorMessage: msg, message1: error, isLogin: userLogin });
    }
});



app.get("/studentregistration", async (req, res) => {
    const instituteNames = await instituteReg.find({});
    res.render("studentregistration", { isLogin: userLogin, instituteNames: instituteNames });
});

app.post("/studentregistration", async (req, res) => {
    try {
        const existingStudent = await studentReg.findOne({ email: req.body.email });
        if (existingStudent) {
            return res.render("userExists", { isLogin: userLogin });
        }
        const newStudent = new studentReg(req.body);
        await newStudent.save();
        res.render("successful", { isLogin: userLogin });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/teacherregistration", async (req, res) => {
    const instituteNames = await instituteReg.find({});
    res.render("teacherregistration", { isLogin: userLogin, instituteNames: instituteNames });
});


app.post("/teacherregistration", async (req, res) => {
    try {
        const { fullName, email, password, institute, _class } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).send("Missing required fields");
        }

        const existingTeacher = await teacherReg.findOne({ email });
        const classTeacher = await teacherReg.findOne({ _class });

        if (existingTeacher) {
            return res.render("userExists", { isLogin: userLogin });
        } else if (classTeacher) {
            let msg1 = "";
            let msg = "Sorry, the class coordinator is already registered for this class."
            res.render('error', { errorMessage: msg1, message1: msg, isLogin: userLogin });
        } else {
            const newTeacher = new teacherReg({ fullName, email, password, institute, _class });
            await newTeacher.save();
        }

        res.render("successful", { isLogin: userLogin });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/submit-attendance", async (req, res) => {
    try {
        const arr = req.body;

        const stringArray = arr.attendance;
        const numArr = stringArray.map(str => parseInt(str));


        console.log(numArr)

        let year = "";
        if (numArr.length >= 0) {
            total = 1;
            const student = await studentReg.findOne({ rollNo: numArr[0] });
            year = student.year;
            student.attendance.push({
                date: new Date(),
                status: "present"
            });
            await student.save();
        } else {
            for (const rollNo of numArr) {
                const student = await studentReg.findOne({ rollNo });
                year = student.year;
                if (student) {
                    // Add attendance record for the student
                    student.attendance.push({
                        date: new Date(),
                        status: "present"
                    });
                    // Save the updated student record
                    await student.save();
                } else {
                    console.log(`Student with roll number ${rollNo} not found`);
                }
            }
        }


        const teacher = await teacherReg.findOne({ _class: year });

        teacher.lectures.push({
            date: new Date(),
            totalStudents: numArr.length
        });

        await teacher.save();

        res.redirect('/successfulAttend');
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/successfulAttend", (req, res) => {
    res.render("successfulAttend", { isLogin: userLogin });
});



app.get("/classroom", isAuthenticated, async (req, res) => {
    try {
        const studentData = await studentReg.find({}).sort({ rollNo: 1 });
        res.render("teacherclassroom", { isLogin: userLogin, studentData: studentData, teacherData: userData });
    } catch (err) {
        res.render(err)
    }

});

app.post("/get-year", async (req, res) => {
    try {
        const year = req.body.year;
        let studentData = await studentReg.find({ year: year }).sort({ rollNo: 1 });

        // res.render('teacherclassroom', { isLogin: userLogin, studentData: studentData, teacherData: userData });
        res.redirect("/classroom")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/instituteRegistration", async (req, res) => {
    try {
        const { instituteName, email, password } = req.body;
        const newInstitute = new instituteReg({
            instituteName: instituteName,
            email: email,
            password: password
        });
        newInstitute.save();
        res.render("successful", { isLogin: userLogin });
    } catch (err) {
        let msg1 = "";
        res.render('error', { errorMessage: msg1, message1: err, isLogin: userLogin });
    }
})

app.post("/acceptStatusStudent", async (req, res) => {

    try {
        const student = await studentReg.findOneAndUpdate(
            { email: req.body.email },
            { active: true },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const institute = await instituteReg.findOne({ instituteName: TempInstituteName });

        if (institute) {
            institute.students.push(student._id);
            await institute.save();
        } else {
            console.log("Institute not found");
        }
        return res.redirect(302, '/instituteDashboard');
    } catch (error) {
        console.error(error);
        let msg1 = "";
        res.render('error', { errorMessage: msg1, message1: 'Internal Server Error', isLogin: userLogin });
    }
});


app.post("/acceptStatusTeacher", async (req, res) => {
    try {
        // Find and update the teacher's active status
        const teacher = await teacherReg.findOneAndUpdate(
            { email: req.body.email },
            { active: true },
            { new: true } // Return the updated document
        );

        // If teacher is not found, return 404 error
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        const institute = await instituteReg.findOne({ instituteName: TempInstituteName });

        if (institute) {
            institute.teachers.push(teacher._id);
            await institute.save();
        } else {
            console.log("Institute not found");
        }


        console.log("hello ")
        // Redirect to institute dashboard
        return res.redirect(302, '/instituteDashboard');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post("/rejectStatusStudent", async (req, res) => {
    try {
        const studentData = await studentReg.find({ institute: TempInstituteName }).sort({ rollNo: 1 });

        const student = await studentReg.findOneAndDelete({ email: req.body.email });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        return res.redirect(302, '/instituteDashboard');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post("/rejectStatusTeacher", async (req, res) => {
    try {
        const teacher = await teacherReg.findOneAndDelete({ email: req.body.email });
        return res.redirect(302, '/instituteDashboard');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/searchStudent', async (req, res) => {
    try {
        const { fullName } = req.query;
        const students = await studentReg.find({ fullName: { $regex: new RegExp(fullName, 'i') } });
        studentData = students;
        res.redirect('InstituteDashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/instituteDashboard", isAuthenticated, async (req, res) => {
    try {
        const studentData = await studentReg.find({ institute: TempInstituteName }).sort({ rollNo: 1 });
        const teacherData = await teacherReg.find({ institute: TempInstituteName });
        const instituteData = await instituteReg.find({ instituteName: TempInstituteName });

        res.render("InstituteDashboard", { students: studentData, teacher: teacherData, institute: instituteData });
    } catch (error) {
        let msg1 = "";
        res.render('error', { errorMessage: msg1, message1: error, isLogin: userLogin });
    }
});

app.get("/studentclass", isAuthenticated, async (req, res) => {
    const classCordinator = await teacherReg.findOne({ _class: userData.year })
    res.render("classroom", { isLogin: userLogin, userData, teacherData: classCordinator });
});

app.get("/logout", (req, res) => {
    userLogin = "";
    res.redirect('/login');
});

app.get("/about", (req, res) => {
    res.render("about", { isLogin: userLogin });
});

app.get("/institute", (req, res) => {
    res.render("instituteRegistration");
});

app.listen(4040, () => {
    console.log("Server is running on port 4040");
});
