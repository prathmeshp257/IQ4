const fs = require("fs");
const archiver = require("archiver");
const dayjs = require("dayjs");

const sendZip = async ({ files, zipName, res }) => {
	try {
		const tempFolder = __dirname + "/tmp";

		if (fs.existsSync(tempFolder)) {
			fs.rmSync(tempFolder, { recursive: true });
		}

		fs.mkdirSync(tempFolder);

		const archive = archiver("zip", { zlib: { level: 9 } });

		archive.on("error", (err) => {
			throw err;
		});

		
		for (const { file, fileName } of files) {
			archive.append(file, { name: `${fileName}.zip` });
		}

		const output = fs.createWriteStream(tempFolder + `/${zipName}.zip`);

		output.on("finish", () => {
			res.setHeader("Content-Disposition", `attachment; filename=${zipName}_${dayjs().format("DDMMYYYY")}.zip`);

			return res.status(200).sendFile(tempFolder + `/${zipName}.zip`, () => {
				fs.rmSync(tempFolder, { recursive: true, force: true });
			});
		});

		archive.pipe(output);
		await archive.finalize();

		res.on("close", () => {
			return;
		});

		res.on("finish", () => {
			return;
		});

		return;
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
};

module.exports = {
	sendZip
};
