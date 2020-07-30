const express = require("express");
const passport = require("passport");
const router = express.Router();

function handleAuthRoute(req, res, next, err, user) {
  if (err) return res.redirect("/?error=" + err);
  else if (!user) return res.redirect("/login?error=registered");
  else
    req.login(user, err => {
      if (err) return res.redirect("/?error=" + err);
      res.redirect("/");
    });
}
//kakao 로그인
router.get("/auth/kakao", (req, res, next) => {
  passport.authenticate("kakao", {
    // state: request.query.type
  })(req, res);
});
//kakao 로그인 연동 콜백
router.get("/auth/kakao/callback", (req, res, next) => {
  passport.authenticate("kakao", (err, user) => {
    handleAuthRoute(req, res, next, err, user);
  })(req, res, next);
});
// logout
router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
