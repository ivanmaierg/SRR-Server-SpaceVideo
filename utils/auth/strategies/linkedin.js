const passport = require('passport');
const axios = require('axios');
const boom = require('@hapi/boom');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

const { config } = require('../../../config');

passport.use(new LinkedinStrategy({
  clientID: config.linkedinClientId,
  clientSecret: config.linkedinClientSecret,
  callbackURL: 'http://localhost:8000/auth/linkedin/callback',
  scope: ['r_emailaddress', 'r_liteprofile'],
}, (async (accesToken, refresToken, profile, cb) => {
  const email = profile.emails[0].value;
  const { data, status } = await axios({
    url: `${config.apiUrl}/api/auth/sign-provider`,
    method: 'post',
    data: {
      name: profile.displayName,
      email,
      password: profile.id.toString(),
      apiKeyToken: config.apiKeyToken,
    },
  });
  if (!data || status !== 200) {
    return cb(boom.unauthorized(), false);
  }
  return cb(null, data);
})));
