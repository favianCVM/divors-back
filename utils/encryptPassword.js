const bcryptjs = require('bcryptjs');

const encryptPassword = (password) => {
	bcryptjs.genSalt(15, (err, salt) => {
		if (err) throw err;

		bcryptjs.hash(password, salt, (err, hash) => {
			if (err) throw err;

			return hash;
		});
	});
};

module.exports = encryptPassword;
