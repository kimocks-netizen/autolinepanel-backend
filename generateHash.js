// generateHash.js
const bcrypt = require('bcryptjs');

const plainPassword = '12345'; // Change to your real password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
