const request = async (req: any, ms: number) => {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			reject(new Error("timeout"));
		}, ms);
		req.then(resolve, reject);
	});
};

const optional = async (req: any, url: string, ms: number) => {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve({
				data: undefined,
				config: { url }
			});
		}, ms);
		req.then(resolve, reject);
	});
};

export const Timeout = {
	request,
	optional
};
