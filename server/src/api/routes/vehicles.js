const { default: axios } = require("axios");
const dayjs = require("dayjs");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();
const { sendZip } = require("../../utils/ArchiveUtil");

const YMD = "YYYY-MM-DD";

router.get("/emissions", async (req, res) => {
	const { sites, range, make, model, userType, email, month } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	let qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userType}&email=${email}&month=${month}`;

	if (range) {
		qs += `&range=${range}`;
	}

	if (make) {
		qs += `&make=${make}`;
	}

	if (model) {
		qs += `&model=${model}`;
	}

	const emissionsUrl = `${baseUrl}/api/vehicles/emissions?${qs}`;

	try {
		const { data: emissionsData } = await axios.get(emissionsUrl);

		// let allMakes = [];
		// let allModels = [];

		// for (const siteName of Object.keys(emissionsData)) {
		// 	for (const { results } of emissionsData[siteName]) {
		// 		allMakes.push(...results.filter(({ make }) => make).map(({ make }) => make));
		// 		allModels.push(...results.map(({ model }) => model));
		// 	}
		// 	const uniqueMakes = [...new Set(allMakes)];
		// 	const uniqueModels = [...new Set(allModels)];

		// 	emissionsData[siteName] = [
		// 		...emissionsData[siteName].map((emission) => {
		// 			return {
		// 				...emission,
		// 				makes: uniqueMakes.length > 0 ? uniqueMakes : [make],
		// 				models: uniqueModels.length > 0 ? uniqueModels : [model]
		// 			};
		// 		})
		// 	];
		// }

		return res.send(emissionsData);
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/emissions/report", async (req, res) => {
	const { sites, format = "daily", responseType = "json", userType } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

	const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&responseType=${responseType}&userType=${userType}`;

	const emissionsUrl = `${baseUrl}/api/vehicles/emissions?${qs}`;

	try {
		const { data } = await axios.get(emissionsUrl, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		return res.send(data);
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/make", async (req, res) => {
	const { sites, format = "daily", responseType = "json", userType, month } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const makeUrl = `${baseUrl}/api/vehicles/make?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;

	try {
		const {data:makeData} = await axios.get(`${makeUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_manufacturers", file: makeData },
			];

			await sendZip({ files: zipFiles, zipName: "make", res });
			return;
		}
		else{
			const response = {};
			for (const site of sites.split(",")) {
				response[site] = {
					make: makeData[site] ? makeData[site] : [],
				};
			}
			return res.send(response);
		}

		return;
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get('/model',async(req,res)=>{
	const { sites, format = "daily", responseType = "json", userType, month } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const modelUrl = `${baseUrl}/api/vehicles/model?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;
	try {
		const {data:modelData} = await axios.get(`${modelUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_models", file: modelData },
				
			];

			await sendZip({ files: zipFiles, zipName: "model", res });
			return;
		}
		else{

			const response = {};

			for (const site of sites.split(",")) {
				response[site] = {
					model: modelData[site] ? modelData[site] : [],
				};
			}

			return res.send(response);
		}
		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}

});

router.get('/age',async(req,res)=>{
	const { sites, format = "daily", responseType = "json", userType, month} = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const ageUrl = `${baseUrl}/api/vehicles/age?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;
	
	try {
		const {data:ageData} = await axios.get(`${ageUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_ages", file: ageData },
			];

			await sendZip({ files: zipFiles, zipName: "age", res });
			return;
		}
		else{

			const response = {};

			for (const site of sites.split(",")) {
				response[site] = {
					age: ageData[site] ? ageData[site] : [],
				};
			}

			return res.send(response);
		}

		return;

		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
		
	}

});

router.get('/fuel',async(req,res)=>{
	const { sites, format = "daily", responseType = "json", userType, month } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const fuelUrl = `${baseUrl}/api/vehicles/fuel?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;

	try {

		const {data:fuelData} = await axios.get(`${fuelUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_fuel_types", file: fuelData },
			];

			await sendZip({ files: zipFiles, zipName: "fuel", res });
			return;
		}
		else{

			const response = {};

			for (const site of sites.split(",")) {
				response[site] = {
					fuel: fuelData[site] ? fuelData[site] : [],
				};
			}

			return res.send(response);
		}

		return;
		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
		
	}
});

router.get('/co2',async(req,res)=>{
	const { sites, format = "daily", responseType = "json", userType, month} = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const emissionsUrl = `${baseUrl}/api/emissions?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;
	try {
		const {data:emissionsData} = await axios.get(`${emissionsUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_emissions", file: emissionsData },
			];

			await sendZip({ files: zipFiles, zipName: "emission", res });
			return;
		}
		else{

			const response = {};

			for (const site of sites.split(",")) {
				response[site] = {
					co2: emissionsData[site] ? emissionsData[site] : [],
				};
			}

			return res.send(response);
		}

		return;
		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
		
	}


});

router.get('/color',async(req,res)=>{
	const { sites, format = "daily", responseType = "json", userType, month } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const colorUrl = `${baseUrl}/api/vehicles/color?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&month=${month}`;
    try {

		const {data:colorData} = await axios.get(`${colorUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "vehicle_colours", file: colorData }
			];

			await sendZip({ files: zipFiles, zipName: "color", res });
			return;
		}
		else{

			const response = {};

			for (const site of sites.split(",")) {
				response[site] = {
					colorType: colorData[site] ? colorData[site] : [],
				};
			}

			return res.send(response);
		}

		return;
		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
		
	}
})


router.get("/valuations", async (req, res) => {
	try{
		const { sites, format = "daily", responseType = "json", userType, email, month} = req.query;
		const fromDate = dayjs(req.query.fromDate).format(YMD);
		const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
		const valuationsUrl = `${baseUrl}/api/vehicles/valuations?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&email=${email}&month=${month}`;
		const { data: valuationsData } = await axios.get(`${valuationsUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if(responseType === 'csv'){
			const zipFiles = [
				{ fileName: "vehicle_valuations", file: valuationsData }
			];

			await sendZip({ files: zipFiles, zipName: "valuations", res });
			return;
		}
		else{
			const response = {};

			for (const site of sites.split(",")) {
				response[site] =  valuationsData[site] ? valuationsData[site] : []
			}
			return res.send(response);
		}
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get('/typeApproval',async(req,res)=>{
	const { sites, format = "daily", responseType = "json",  month , userType} = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);
	const typeAprrovalURL = `${baseUrl}/api/analytics/typeApproval?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&month=${month}&format=${format}&userType=${userType}`;
    try {

		const {data:typeApprovalData} = await axios.get(`${typeAprrovalURL}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "typr_approval", file: typeApprovalData }
			];

			await sendZip({ files: zipFiles, zipName: "approval", res });
			return;
		}
		else {
            let datasets = [], labels = [], response = {}, keys = 0, index = 0, month = '';
            for (const site of sites.split(",")) {

                if (format === "monthly" && typeApprovalData[site].length > 0) {
                    for (const [i, eachMonthData] of typeApprovalData[site].entries()) {
                        for (let eachMonth of Object.keys(eachMonthData)) {
                            if (Object.keys(eachMonthData[eachMonth]).length > keys) {
                                month = eachMonth;
                                index = i
                                keys = Object.keys(eachMonthData[eachMonth]).length
                            }
                        }
                    }

                    for (let fuelType of Object.keys(typeApprovalData[site][index][month])){
                        let Obj = {}
                        Obj.label = fuelType
                        Obj.values = []
                        datasets.push(Obj)

                    }

                    for (let eachMonthData of typeApprovalData[site]) {
                        for (let eachMonth of Object.keys(eachMonthData)) {
                            for(let eachFuelType of Object.keys(eachMonthData[eachMonth])){
                                let value = eachMonthData[eachMonth][eachFuelType];
                                    datasets.map((eachdata)=>{
                                        if(eachdata.label === eachFuelType){
                                            eachdata.values.push(value);
                                        }
                                    })
                            }
                           labels.push(eachMonth)
                        }
                    }
                    response[site] = { datasets, labels }
                }else{
                    for (const fuelType of Object.keys(typeApprovalData[site])) {
                        datasets.push({
                            values: Object.values(typeApprovalData[site][fuelType]),
                            label: fuelType
                        })
                        // labels = Object.keys(dwellData[site][fuelType]);
    
                        if (Object.keys(typeApprovalData[site][fuelType]).length > keys) {
                            labels = (Object.keys(typeApprovalData[site][fuelType]))
                            keys = Object.keys(typeApprovalData[site][fuelType]).length
                        }
                    }
                }
               
                response[site] = { datasets, labels }
            }
            return res.send(response);
        }

		
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
		
	}
})


module.exports = router;
