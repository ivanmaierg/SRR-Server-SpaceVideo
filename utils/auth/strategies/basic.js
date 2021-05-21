/* eslint-disable consistent-return */
const passport = require('passport');

const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const axios = require('axios');
const { config } = require('../../../config/index');

passport.use(new BasicStrategy(async (email, password, cb) => {
  // manda la información del usuario, si algo falla no devuelve un error
  try {
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/auth/sign-in`,
      method: 'post',
      auth: {
        password,
        username: email,
      },
      data: {
        apiKeyToken: config.apiKeyToken,
      },
    });
    if (!data || status !== 200) {
      return cb(boom.unauthorized(), false);
    }
    return cb(null, data);
  } catch (error) {
    cb(error);
  }
}));
