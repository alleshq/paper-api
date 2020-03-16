const config = require("../config");
const credentials = require("../credentials");
const axios = require("axios");

module.exports = async (req, res, next) => {
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

		//Get User
		const user = (
			await axios.get(
				`${config.apiUrl}/user?id=${encodeURIComponent(session.user)}`,
				{
					auth: {
						username: credentials.allesOAuth.id,
						password: credentials.allesOAuth.secret
					}
				}
			)
		).data;

		req.user = user;
		next();
	} catch (e) {
		//console.log(e);
		return res.status(401).json({err: "invalidSession"});
	}
};
