const { handleError } = require('../utils');
const Utilities = require('./utilities');
const jwt = require('express-jwt');
const { ALL } = require('./roles');

function authorize(roles = []) {
	// roles param can be a single role string (e.g. Role.User or 'User')
	// or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
	if (typeof roles === 'string') {
		roles = [roles];
	}

	const secret = process.env.JWT_SECRET;
	return [
		// authenticate JWT token and attach user to request object (req.user)
		jwt({ secret, algorithms: ['HS256'] }),

		// authorize based on user role
		(req, res, next) => {
			req.user = req.user?.data;
			req.user.role = JSON.parse(req.user.role);

			if (roles.includes(ALL)) return next();

			if (roles.length && (!roles.includes(req.user.role) || !req.user.role)) {
				// user's role is not authorized
				return res.status(500).json({
					message:
						'Debe iniciar sesión o registrarse para ejecutar esta acción.',
					status: 403
				});
			}

			// authentication and authorization successful
			next();
		}
	];
}

module.exports = authorize;
