const { engine } = require("express-handlebars");
require("colors");
const path = require("path");
const configPath = path.join(__dirname, "..", "config", ".env");
require("dotenv").config({ path: configPath });
const connectDB = require("../config/connectDB");
const errorHandler = require("./middlewares/errorHandler");
const asyncHandler = require("express-async-handler");
const usersModel = require("./models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware");
const rolesModel = require("./models/rolesModel");
const sendEmail = require('./service/sendEmail');
require("dotenv").config();

// console.log("Hello from Max");
// console.log(require("dotenv").config({path: configPath}));

// console.log(process.env.PORT);
// console.log(process.env.DB_HOST);

const express = require("express");
const { generateKey } = require("crypto");


const app = express();

//Підключення статікі картінок
 app.use(express.static("public"));

// Set template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "buckEnd/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Роути сторінок =====
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
//=======================
//======= POST запит ==========//
app.post("/sended", (req, res) => {
  // res.send(req.body);
  res.render("sended", {
    message: "Contact form send success",
    name: req.body.userName,
    email: req.body.userEmail,
  });
  sendEmail(req.body);
});

app.use("/api/v1", require("./routes/drinksRoutes"));

//========Лонтроллер регістрациї
app.get("/signup", (req, res) => {
  res.render("signup");
});
// Реєстрація - це збереження користувача в базі данних
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // Отримуємо та валідуємо данні від користувача
    const { email, password } = req.body;
    if (!email || !password) {
      req.status = 400;
      throw new Error("Provided all fields are required");
    }
    // console.log(req.body);
    // Шукаємо коистувача у БД
    const condidat = await usersModel.findOne({ email: email });
    if (condidat) {
      req.status = 400;
      throw new Error("User already exists");
    }
    // Якщо знайшли (відправляємо на логін або редірект кудись)
    // Хешуемо пароль
    const hashPassword = bcrypt.hashSync(password, 5);
    // console.log( hashPassword);

    // Додаємо роль користувача
    const roles = await rolesModel.findOne({ value: "USER" });

    // Зберігаемо користувача у БД
    const user = await usersModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });
    res.status(201).json({
      code: 201,
      message: "User created successfully",

      data: {
        email: user.email,
      },
    });
  })
);

// Аутентифікація - це перевірка данних які передав користувач і порівняння з тими яки є у базі данних
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // Отримуємо та валідуємо данні від користувача
    const { email, password } = req.body;
    if (!email || !password) {
      req.status = 400;
      throw new Error("Provided all fields are required");
    }

    // Шукаємо коистувача у БД та розшіфровуемо пароль
    const user = await usersModel.findOne({ email });
    // Якщо користувач не знайден кидаємо помилку "Invalid login or password"
    if (!user) {
      req.status = 400;
      throw new Error("Invalid login or password");
    }
    // Якщо не розшифровали  пароль кидаємо помилку "Invalid login or password"
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      req.status = 400;
      throw new Error("Invalid login or password");
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Може бути записано в один ИФ
    // const user = await usersModel.findOne({ email });

    // if (!user || !becrypt.compareSync(password, user.password)) {
    //   req.status = 400;
    //   throw new Error("Invalid login or password");
    // }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Якщо все добре то генеруемо токын

    //Отримуємо TOKEN
    const token = generateToken({
      friends: ["Dima", "Ihor", "Max"],
      id: user._id,
      roles: user.roles,
    });
    // console.log("token" token);

    // Записуємо token юзеру в БД
    user.token = token;
    await user.save();
    res.status(200).json({
      code: 200,

      data: {
        email: user.email,
        token: user.token, // Беремо token з стр. 105
      },
    });
  })
);
// Авторизація - це перевірка прав доступу

// Розлогінення - вихід з приложенія
app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    console.log(req.user.id);
    const { id } = req.user;
    const user = await usersModel.findById(id);
    user.token = null;
    await user.save();
    res.status(200).json({
      code: 200,
      data: {
        message: "Logout success",
        email: user.email,
      },
    });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "pizza", { expiresIn: "24h" });
}

app.use(errorHandler);

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is runing on port ".green.bold.italic + process.env.PORT);
});
