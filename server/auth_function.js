const axios = require("axios");

auth_function = {
  process_login
};

function process_login(req, accessToken, profile, done, company) {
  const userRequest = {
    oauth: {
      company: company,
      access_token: accessToken
    },
    profile: profile
  };
  var url = "http://localhost:3001/api/login";
  axios({
    url: url,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    data: userRequest
  })
    .then(res => {
      done(null, res.data);
    })
    .catch(function(err) {
      done(err, null);
    });
}
module.exports = auth_function;
