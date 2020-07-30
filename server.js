require("dotenv").config();
const express = require("express");
const http = require("http");
const next = require("next");
const passport = require("passport");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const sequelize = require("./models/index").sequelize;
sequelize.sync();
//routing
const apiRoute = require("./server/api_route");
const authRoute = require("./server/auth_route");
const dev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";
//login
const KakaoStrategy = require("./modules/auth/KakaoStrategy.js");
const auth_function = require("./server/auth_function");
const app = next({ dev }); // next 모듈을 사용
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = express(); // back 서버에서의 const app = express()
  server.use(morgan("dev"));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    cookieSession({
      keys: ["js"],
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET, // backend 서버와 같은 키를 써야한다.
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 100 * 60 * 60 // 쿠키 유효기간 1시간
      }
    })
  );
  const kakaoStrategy = new KakaoStrategy(
    {
      clientID: process.env.KAKAO_APP_ID,
      clientSecret: process.env.KAKAO_APP_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      auth_function.process_login(req, accessToken, profile, done, "kakao");
    }
  );
  server.use(apiRoute);
  passport.use(kakaoStrategy);
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  // adding Passport and authentication routes
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(authRoute);
  // you are restricting access to some routes
  const restrictAccess = (req, res, next) => {
    if (!req.isAuthenticated())
      return res.redirect("/home?error=permission denied");
    next();
  };
  server.use("/mypage", restrictAccess);

  // handling everything else with Next.js
  const options = {
    root: __dirname + "/static/",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    }
  };
  server.get("/robots.txt", (req, res) =>
    res.status(200).sendFile("robots.txt", options)
  );
  server.get("/shortcut.jpg", (req, res) =>
    res.status(200).sendFile("shortcut.jpg", options)
  );
  server.get("*", (req, res) => {
    // 모든 get 요청 처리
    return handle(req, res); // next의 get 요청 처리기
  });
  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
