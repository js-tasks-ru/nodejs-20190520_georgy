const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email}).then((user) => {
        if (!user) {
          done(false, false, 'Нет такого пользователя');
          return false;
        }
        user.checkPassword(password).then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            done(false, false, 'Невереный пароль');
            return false;
          }
          done(null, user);
        });
      }).catch((error) => {
        done(error, null);
      });
    }
);
