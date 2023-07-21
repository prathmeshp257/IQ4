const request = async (req, ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    req.then(resolve, reject);
  });
};

const optional = async (req, url, ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({
        data: undefined,
        config: { url },
      });
    }, ms);
    req.then(resolve, reject);
  });
};

module.exports = {
  request,
  optional,
};
