const { default: axios } = require("axios");
const dayjs = require("dayjs");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();
const { Formatter } = require("../../utils");
const { sendZip } = require("../../utils/ArchiveUtil");

const YMD = "YYYY-MM-DD";

router.get("/evVisits", async (req, res) => {
    const { sites, responseType, userType, email, month, format } = req.query;
    const fromDate = dayjs(req.query.fromDate).format(YMD);
    const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

    const evVisitsUrl = `${baseUrl}/api/evData/evVisits?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=${responseType}&userType=${userType}&email=${email}&month=${month}&format=${format}`;
    try {
        const { data: visitsData } = await axios.get(evVisitsUrl, {
            responseType: responseType === "csv" ? "arraybuffer" : "json"
        });


        if (responseType === 'csv') {
            const zipFiles = [
                { fileName: "ev_visits", file: visitsData }
            ];

            await sendZip({ files: zipFiles, zipName: "ev_visits_insights", res });
            return;
        }
        else {
            let datasets = [], labels = [], response = {}, keys = 0, index = 0, month = '';
            for (const site of sites.split(",")) {
                if (format === "monthly" && visitsData[site].length > 0 ) {
                    for (const [i, eachMonthData] of visitsData[site].entries()) {
                        for (let eachMonth of Object.keys(eachMonthData)) {
                            if (Object.keys(eachMonthData[eachMonth]).length > keys) {
                                month = eachMonth;
                                index = i
                                keys = Object.keys(eachMonthData[eachMonth]).length
                            }
                        }
                    }

                    for (let fuelType of Object.keys(visitsData[site][index][month])){
                        let Obj = {}
                        Obj.label = fuelType
                        Obj.values = []
                        datasets.push(Obj)

                    }

                    for (let eachMonthData of visitsData[site]) {
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
                } else {
                    for (const fuelType of Object.keys(visitsData[site])) {
                        datasets.push({
                            values: Object.values(visitsData[site][fuelType]),
                            label: fuelType === "evPureVisits" ? "EV Pure" : fuelType === "evHybridVisits" ? "EV Hybrid" : fuelType === "evAllVisits" ? "EV All" : Formatter.capitalize(fuelType)
                        })
                        // labels = Object.keys(visitsData[site][fuelType]);

                        if (Object.keys(visitsData[site][fuelType]).length > keys) {
                            labels = (Object.keys(visitsData[site][fuelType]))
                            keys = Object.keys(visitsData[site][fuelType]).length
                        }

                    }
                    response[site] = { datasets, labels }
                }


            }
            return res.send(response);
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message });
    }
});

router.get("/evRepeatFrequency", async (req, res) => {
    const { sites, responseType, userType, email, month } = req.query;
    const fromDate = dayjs(req.query.fromDate).format(YMD);
    const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

    const evRepeatVisitsUrl = `${baseUrl}/api/evData/evRepeatFrequency?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=${responseType}&userType=${userType}&email=${email}&month=${month}`;

    try {
        const { data: repeatVisitsData } = await axios.get(evRepeatVisitsUrl, {
            responseType: responseType === "csv" ? "arraybuffer" : "json"
        });
        if (responseType === 'csv') {
            const zipFiles = [
                { fileName: "ev_repeat_visits", file: repeatVisitsData }
            ];

            await sendZip({ files: zipFiles, zipName: "ev_repeat_visits_insights", res });
            return;
        }
        else {
            let datasets = [], labels = [], response = {};
            for (const site of sites.split(",")) {
                for (const fuelType of Object.keys(repeatVisitsData[site])) {
                    datasets.push({
                        values: Object.values(repeatVisitsData[site][fuelType]),
                        label: fuelType === "evPureRepeatVisits" ? "EV Pure" : fuelType === "evHybridRepeatVisits" ? "EV Hybrid" : fuelType === "evAllRepeatVisits" ? "EV All" : Formatter.capitalize(fuelType)
                    })
                    labels = Object.keys(repeatVisitsData[site][fuelType]);
                }
                response[site] = { datasets, labels }
            }
            return res.send(response);
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message });
    }
});

router.get("/evAverageDwell", async (req, res) => {
    const { sites, responseType, userType, email, month, format } = req.query;
    const fromDate = dayjs(req.query.fromDate).format(YMD);
    const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

    const evDwellAverageUrl = `${baseUrl}/api/evData/evAverageDwell?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=${responseType}&userType=${userType}&email=${email}&month=${month}&format=${format}`;

    try {
        const { data: dwellData } = await axios.get(evDwellAverageUrl, {
            responseType: responseType === "csv" ? "arraybuffer" : "json"
        });
        if (responseType === 'csv') {
            const zipFiles = [
                { fileName: "ev_dwell", file: dwellData }
            ];

            await sendZip({ files: zipFiles, zipName: "ev_dwell_insights", res });
            return;
        }
        else {
            let datasets = [], labels = [], response = {}, keys = 0, index = 0, month = '';
            for (const site of sites.split(",")) {

                if (format === "monthly" && dwellData[site].length > 0) {
                    for (const [i, eachMonthData] of dwellData[site].entries()) {
                        for (let eachMonth of Object.keys(eachMonthData)) {
                            if (Object.keys(eachMonthData[eachMonth]).length > keys) {
                                month = eachMonth;
                                index = i
                                keys = Object.keys(eachMonthData[eachMonth]).length
                            }
                        }
                    }

                    for (let fuelType of Object.keys(dwellData[site][index][month])){
                        let Obj = {}
                        Obj.label = fuelType
                        Obj.values = []
                        datasets.push(Obj)

                    }

                    for (let eachMonthData of dwellData[site]) {
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
                    for (const fuelType of Object.keys(dwellData[site])) {
                        datasets.push({
                            values: Object.values(dwellData[site][fuelType]),
                            label: fuelType === "averageEvPureDwell" ? "EV Pure" : fuelType === "averageEvHybridDwell" ? "EV Hybrid" : fuelType === "averageEvAllDwell" ? "EV All" : fuelType == "minAverageEvPureDwell" ? "EV Pure Min Avg" : fuelType == "maxAverageEvPureDwell" ? "EV Pure Max Avg" : fuelType == "minAverageEvHybridDwell" ? "EV Hybrid Min Avg" : fuelType == "maxAverageEvHybridDwell" ? "EV Hybrid Max Avg" : Formatter.capitalize(fuelType)
                        })
                        // labels = Object.keys(dwellData[site][fuelType]);
    
                        if (Object.keys(dwellData[site][fuelType]).length > keys) {
                            labels = (Object.keys(dwellData[site][fuelType]))
                            keys = Object.keys(dwellData[site][fuelType]).length
                        }
                    }
                }
               
                response[site] = { datasets, labels }
            }
            return res.send(response);
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message });
    }
});

router.get("/evDwellByHour", async (req, res) => {
    const { sites, responseType, userType, email, month } = req.query;
    const fromDate = dayjs(req.query.fromDate).format(YMD);
    const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

    const evDwellByHourUrl = `${baseUrl}/api/evData/evDwellByHour?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=${responseType}&userType=${userType}&email=${email}&month=${month}`;

    try {
        const { data: dwellByHourData } = await axios.get(evDwellByHourUrl, {
            responseType: responseType === "csv" ? "arraybuffer" : "json"
        });
        if (responseType === 'csv') {
            const zipFiles = [
                { fileName: "ev_dwell_by_hour", file: dwellByHourData }
            ];

            await sendZip({ files: zipFiles, zipName: "ev_dwell_by_hour_insights", res });
            return;
        }
        else {
            let datasets = [], labels = [], response = {};
            for (const site of sites.split(",")) {
                for (const fuelType of Object.keys(dwellByHourData[site])) {
                    datasets.push({
                        values: Object.values(dwellByHourData[site][fuelType]),
                        label: fuelType === "averageEvPureDwell" ? "EV Pure" : fuelType === "averageEvHybridDwell" ? "EV Hybrid" : fuelType === "averageEvAllDwell" ? "EV All" : fuelType == "minAverageEvPureDwell" ? "EV Pure Min Avg" : fuelType == "maxAverageEvPureDwell" ? "EV Pure Max Avg" : fuelType == "minAverageEvHybridDwell" ? "EV Hybrid Min Avg" : fuelType == "maxAverageEvHybridDwell" ? "EV Hybrid Max Avg" : Formatter.capitalize(fuelType)
                    })
                    labels = Object.keys(dwellByHourData[site][fuelType]);
                }
                response[site] = { datasets, labels }
            }
            return res.send(response);
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message });
    }
});

module.exports = router;
