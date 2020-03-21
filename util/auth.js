const config = require("../config");
const credentials = require("../credentials");
const axios = require("axios");
const getUser = require("./getUser");

module.exports = allowGuest => {
	return async (req, res, next) => {
		try {
			//Auth Header
			const authHeader = req.headers.authorization;
			if (typeof authHeader !== "string") throw "No Auth Header";

			//Get Session
			const session = (
				await axios.get(
					`${config.apiUrl}/session?token=${encodeURIComponent(authHeader)}`,
					{
						auth: {
							username: credentials.allesOAuth.id,
							password: credentials.allesOAuth.secret
						}
					}
				)
			).data;

			const user = await getUser(session.user);
			req.user = user;
			next();
		} catch (e) {
			if (allowGuest) return next();
			return res.status(401).json({err: "invalidSession"});
		}
	};
};
