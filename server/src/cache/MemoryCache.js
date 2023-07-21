const { Cache } = require("memory-cache");

const cache = new Cache();
const createKey = (req) => `__express__${req.originalUrl || req.url}`;

const DEFAULT_RETENTION = 1000 * 60;

const Retention = {
	MINUTES_5: DEFAULT_RETENTION * 5,
	MINUTES_10: DEFAULT_RETENTION * 10,
	MINUTES_20: DEFAULT_RETENTION * 20,
	MINUTES_30: DEFAULT_RETENTION * 30,
	HOURS_1: DEFAULT_RETENTION * 60,
	HOURS_2: DEFAULT_RETENTION * 120,
	HOURS_4: DEFAULT_RETENTION * 240,
	HOURS_8: DEFAULT_RETENTION * 480,
	HOURS_12: DEFAULT_RETENTION * 720,
	DAYS_1: DEFAULT_RETENTION * 1440
};

class MemoryCache {
	constructor() {
		this.cache = cache;
	}

	put(req, value, retention = DEFAULT_RETENTION) {
		try {
			const key = createKey(req);
			this.cache.put(key, value, retention);
		} catch (e) {
			console.log(e);
		}
	}

	get(req) {
		const key = createKey(req);
		return this.cache.get(key);
	}

	memSize() {
		return this.cache.size();
	}

	exists(req) {
		const key = createKey(req);
		return this.cache.get(key) != null;
	}
}

module.exports = {
	MemoryCache,
	Retention
};
