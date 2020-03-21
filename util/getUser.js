const config = require("../config");
const credentials = require("../credentials");
const axios = require("axios");

module.exports = async (param, username) =>
	(
		await axios.get(
			`${config.apiUrl}/user?${
				username ? "username" : "id"
			}=${encodeURIComponent(param)}`,
			{
				auth: {
					username: credentials.allesOAuth.id,
					password: credentials.allesOAuth.secret
				}
			}
		)
	).data;
