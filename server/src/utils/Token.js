const exists = () => {
	const token = localStorage.getItem("token");

	return !!token;
};

const user = (token) => {
	const base64Payload = String(token).split(".")[1];
	const payload = Buffer.from(base64Payload, "base64").toJSON();
	return payload;
};

const extractPayload = (headers) => {
	const token = headers.authorization.split("Bearer ")[1];
	const base64Payload = String(token).split(".")[1];
	const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());
	return payload;
};

module.exports = {
	exists,
	user,
	extractPayload
};
