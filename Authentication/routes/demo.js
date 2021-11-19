const express = require("express");

const bcryptjs = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputDataField;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  req.session.inputData = null; //flashing

  res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
  let sessionInputData = req.session.inputDataField;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }

  req.session.inputData = null; //flashing
  res.render("login", { inputData: sessionInputData });
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const confirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;
  if (
    !enteredEmail ||
    !confirmEmail ||
    !enteredPassword ||
    enteredPassword.trim().length < 6 ||
    enteredEmail !== confirmEmail ||
    !enteredEmail.includes("@")
  ) {
    req.session.inputDataField = {
      hasError: true,
      message: "Invalid input!",
      email: enteredEmail,
      confirmEmail: confirmEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/signup");
    });

    return;
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (existingUser) {
    req.session.inputDataField = {
      hasError: true,
      message: "User already exist!",
      email: enteredEmail,
      confirmEmail: confirmEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcryptjs.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser) {
    req.session.inputDataField = {
      hasError: true,
      message: "Could not log you in - please check your credentials",
      email: enteredEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  const auth = await bcryptjs.compare(enteredPassword, existingUser.password);
  if (!auth) {
    req.session.inputDataField = {
      hasError: true,
      message: "Could not log you in - please check your credentials",
      email: enteredEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/login");
    });

    return;
  }

  //this session object provided by the express-session
  //add user and isAuthenticated properties into session object
  req.session.user = {
    id: existingUser._id,
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;
  //handling asynchronous task
  //one session data saved into database then redirect the /admin
  req.session.save(() => {
    res.redirect("/profile");
  });
});

router.get("/admin", async function (req, res) {
  if (!res.locals.idAuth) {
    return res.status(401).render("401");
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }
  res.render("admin");
});

router.get("/profile", function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }
  res.render("profile");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect("/");
});

module.exports = router;
