const generic = (res, e) => {
	res.status(500).send({ message: e?.response?.data?.message || e.message || "Something went wrong"});
};

module.exports = {
	generic
};
