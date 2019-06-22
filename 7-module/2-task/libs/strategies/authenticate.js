const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }
  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
  const user = await User.findOne({email});
  if (user) {
    done(null, user);
  } else {
    try {
      const user = await User.create({email: email, displayName: displayName});
      done(null, user);
    } catch (e) {
      done(e, null);
    }
  }
};
