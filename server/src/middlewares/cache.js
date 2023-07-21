const { MemoryCache } = require("../cache/MemoryCache");

const cache = new MemoryCache();

module.exports = (req, res, next) => {
	if (cache.exists(req)) return res.status(201).json(cache.get(req));
	next();
};
