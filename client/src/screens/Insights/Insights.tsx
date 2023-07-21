import CSVIcon from "@material-ui/icons/Assessment";
import PDFIcon from "@material-ui/icons/PictureAsPdf";
import Toggle from '@mui/material/Switch';
import { Switch } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { Button, CardWithTabs, Divider, Flex, MultiSelect } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { PATHS, YMD } from "../../constants";
import { Shell } from "../../containers";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { VehiclesGraph, TwoYAxisGraph } from "../../graphs";
import { VehicleData, ValuationsData, EmissionsData } from "../../types";
import { formatSite, Formatter, sortBy } from "../../utils";
import { InsightPdfTemplate } from "../PdfTemplate";
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";

interface ActiveLabel {
	[site: string]: string;
}

export const Insights: FC = () => {
	const { userData } = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
	const { enqueueSnackbar } = useSnackbar();
	const localVehiclesSites = localStorage.getItem("insights-sites");
	const localSelectedSites = (localVehiclesSites && localVehiclesSites.split(",")) || [];
	const localFromDate = localStorage.getItem("insights-from-date") || "";
	const localToDate = localStorage.getItem("insights-to-date") || "";
	const sessionSortOrder = sessionStorage.getItem("insights-sort-order") || "h-l";
	const userLoginType = userData.userType;
	const insightAccessSites = userData.insightAccessSites || [];
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	let bulkDateRange = ["2 Months", "3 Months", "6 Months"]
	let date = new Date();
	let currentMonth = date.getMonth();
	let currentYear = date.getFullYear();


	const [fromDate, setFromDate] = useState<string | undefined>(localFromDate);
	const [toDate, setToDate] = useState<string | undefined>(localToDate);

	const [loading, setLoading] = useState(false);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
	const [downloadingPDF, setDownloadingPDF] = useState(false);

	const { sites, email } = useContext(UserContext);



	const history = useHistory();

	const [vehicles, setVehicles] = useState<VehicleData>();
	const [make, setMake] = useState<any>();
	const [model, setModel] = useState<any>();
	const [fuel, setFuel] = useState<any>();
	const [age, setAge] = useState<any>();
	const [co2, setCo2] = useState<any>();
	const [color, setColor] = useState<any>();

	const [selectedSites, setSelectedSites] = useState<string[]>(localSelectedSites);
	const [selectedRange, setSelectedRange] = useState<any>(null);
	const [selectedMake, setSelectedMake] = useState<any>(null);
	const [originalSampleSize, setOriginalSampleSize] = useState<any>();
	const localActiveLabel = localStorage.getItem("insights-activeLabel")
	const [activeLabel, setActiveLabel] = useState<ActiveLabel>({ [localSelectedSites[0]]: "make" });
	const [sortOrder, setSortOrder] = useState<any>(sessionSortOrder);
	const [valuations, setValuations] = useState<ValuationsData>({});
	const [evVisits, setEvVisits] = useState<any>({});
	const [evPureVisits, setEvPureVisits] = useState<any>({});
	const [evDwellAverage, setEvDwellAverage] = useState<any>({});
	const [evDwellAverageMinMax, setEvDwellAverageMinMax] = useState<any>({});
	const [evpureDwellAverage, setEvPureDwellAverage] = useState<any>({});
	const [evDwellByHour, setEvDwellByHour] = useState<any>({});
	const [evDwellByHourMinMax, setEvDwellByHourMinMax] = useState<any>({});
	const [evPureDwellByHour, setEvPureDwellByHour] = useState<any>({});
	const [evRepeatVisits, setEvRepeatVisits] = useState<any>({});
	const [typeApproval, setTypeApproval] = useState<any>({});
	const [evPureRepeatVisits, setEvPureRepeatVisits] = useState<any>({});
	const [emissions, setEmissions] = useState<any>([]);
	const [minDate, setMinDate] = useState<any>(undefined);
	const [maxDate, setMaxDate] = useState<any>(undefined);
	const [selectableSites, setSelectableSites] = useState<any>([]);
	const [selectedMonth, setSelectedMonth] = useState("");
	const [showEVOnly, setShowEvOnly] = useState(false);
	const [dataFormat, setDataFormat] = useState<string>('daily');
	const [showDaily, setShowDaily] = useState(true);
	const [showEvMinMax, setShowEvMinMax] = useState(false);
	const [emissionTabData, setEmissionTabData] = useState<any>();
	const [allMake, setAllMake] = useState<any>([]);

	useEffect(() => {
		let accessSites = userLoginType === 'Admin' ? sites : insightAccessSites;
		let accSites = accessSites;
		if (userData.userType !== 'Admin') {
			for (const eachSite of accessSites) {
				const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
				if (foundSite[0] && foundSite[0].contractExpired) {
					accSites = accSites.filter((val: any) => val !== eachSite)
				}
			}
		}
		setSelectableSites(accSites);
		// eslint-disable-next-line
	}, [sitesData])
	const getMake = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-make-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setMake(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setMake({});
			try {

				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;
				const { data } = await axios.get(`/api/vehicles/make?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-make-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setMake(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};

	const getModel = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-model-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setModel(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setModel({});
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/vehicles/model?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-model-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setModel(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};



	const getFuel = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-fuel-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setFuel(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setFuel({});
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/vehicles/fuel?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-fuel-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setFuel(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};

	const getAge = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-age-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setAge(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setAge({});
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;
				const { data } = await axios.get(`/api/vehicles/age?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-age-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setAge(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};

	const getCo2 = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-co2-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setCo2(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setCo2({});
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/vehicles/co2?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-co2-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setCo2(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};

	const getColor = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-color-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setColor(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setColor({})
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/vehicles/color?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-color-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setColor(data);
			} catch (e: any) {
				enqueueSnackbar("Unable to load data, please try again", { variant: "error" });
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};



	const getValuations = async () => {
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-valuations-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setValuations(JSON.parse(sessionData));
		} else {
			setLoading(true);
			setValuations({});
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/vehicles/valuations?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-valuations-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setValuations(data);
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		}
	};

	useEffect(() => {
		sessionStorage.setItem("insights-sort-order", sortOrder);
	}, [sortOrder]);

	const isAlphaSort = sortOrder === "a-z";

	const getEmissionsData = async () => {
		const sites = selectedSites?.join();
		setLoading(true);
		setEmissions({})
		if (!selectedMake) setSelectedMake(null);

		const sessionData = sessionStorage.getItem(`insights-emissions-data-${sites}-${fromDate}-${toDate}`);
		if (sessionData) {
			setEmissions(JSON.parse(sessionData));
		}
		else {
			try {
				let qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&month=${selectedMonth}`;

				if (selectedRange) qs += `&range=${selectedRange}`;
				if (selectedMake) qs += `&make=${selectedMake}`;

				const { data } = await axios.get(`/api/vehicles/emissions?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				
				// setOriginalSampleSize({ [sites[0]]: data[sites[0]].reduce((acc: any, curr: any) => acc + curr.beforeTotal, 0) });
				
				setEmissions(data[selectedSites[0]]);
				sessionStorage.setItem(`insights-emissions-data-${sites}-${fromDate}-${toDate}`, JSON.stringify(data[selectedSites[0]]));
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (emissions && emissions.length > 0) {
			let uniqueMakes = [] as any
			emissions.map((v:any) => { if (!uniqueMakes.includes(v.make)) uniqueMakes.push(v.make)})
			setAllMake(uniqueMakes)
		}

		if (selectedRange && selectedMake){
			let labels = [ selectedRange ]
			let datasets = [] as any
			let uniqueModels = [] as any
			
			if (emissions && emissions.length > 0) {
				emissions.map((v:any) => { if (!uniqueModels.includes(v.model) && v.make == selectedMake && v.range == selectedRange) uniqueModels.push(v.model)})
				uniqueModels = uniqueModels.slice(0,19)
				for (let eachModel of uniqueModels){
					let label = eachModel
					let values = [] as any
					
					for (let eachLabel of labels){
						let rangeData = emissions.filter((v:any) => v.range == eachLabel && v.model == eachModel)
						
						values.push(rangeData && rangeData[0] ? rangeData[0].modelVehicles : 0)
					}
				datasets.push({ label, values })
				}

			}

			setEmissionTabData({labels, datasets})
		} else if (selectedMake) { 
			let labels = [ '200', '151-200', '101-150', '51-100', '1-50', '0' ]
			let datasets = [] as any
			let uniqueModels = [] as any
			
			if (emissions && emissions.length > 0) {
				emissions.map((v:any) => { if (!uniqueModels.includes(v.model) && v.make == selectedMake) uniqueModels.push(v.model)})
				uniqueModels = uniqueModels.slice(0,19)
				for (let eachModel of uniqueModels){
					let label = eachModel
					let values = [] as any
					
					for (let eachLabel of labels){
						let rangeData = emissions.filter((v:any) => v.range == eachLabel && v.model == eachModel)
						
						values.push(rangeData && rangeData[0] ? rangeData[0].modelVehicles : 0)
					}
				datasets.push({ label, values })
				}

			}

			setEmissionTabData({labels, datasets})
		
		} else if (selectedRange) {
			let labels = [ selectedRange ]
			let datasets = [] as any
			let uniqueMakes = [] as any
			
			if (emissions && emissions.length > 0) {
				emissions.map((v:any) => { if (!uniqueMakes.includes(v.make)) uniqueMakes.push(v.make)})
				uniqueMakes = uniqueMakes.slice(0,19)
				for (let eachMake of uniqueMakes){
					let label = eachMake
					let values = [] as any
					
					for (let eachLabel of labels){
						let rangeData = emissions.filter((v:any) => v.range == eachLabel && v.make == eachMake)
						
						values.push(rangeData && rangeData[0] ? rangeData[0].vehicles : 0)
					}
				datasets.push({ label, values })
				}

			}
			setEmissionTabData({labels, datasets})

		} else {
			let labels = [ '200', '151-200', '101-150', '51-100', '1-50', '0' ]
			let datasets = [] as any
			let uniqueMakes = [] as any
			
			
			if (emissions && emissions.length > 0) {
				emissions.map((v:any) => { if (!uniqueMakes.includes(v.make)) uniqueMakes.push(v.make)})
				uniqueMakes = uniqueMakes.slice(0,19)
				
				for (let eachMake of uniqueMakes){
					let label = eachMake
					let values = [] as any
					
					for (let eachLabel of labels){
						let rangeData = emissions.filter((v:any) => v.range == eachLabel && v.make == eachMake)
						
						values.push(rangeData && rangeData[0] ? rangeData[0].vehicles : 0)
					}
				datasets.push({ label, values })
				}
			}
			setEmissionTabData({labels, datasets})
		}
		// eslint-disable-next-line
	}, [selectedRange, selectedMake, emissions]);

	const getEvVisits = async () => {
		setLoading(true);
		setEvVisits({})
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-evVisits-format-${dataFormat}-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setEvVisits(JSON.parse(sessionData));
		} else {
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}&format=${dataFormat}`;

				const { data } = await axios.get(`/api/evData/evVisits?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});

				sessionStorage.setItem(`insights-evVisits-format-${dataFormat}-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setEvVisits(data);
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		}
		setLoading(false);
	};

	const getEvRepeatVisits = async () => {
		setLoading(true);
		setEvRepeatVisits({})
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-evRepeatVisits-${sites}-${fromDate}-${toDate}`);

		if (sessionData) {
			setEvRepeatVisits(JSON.parse(sessionData));
		} else {
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/evData/evRepeatFrequency?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-evRepeatVisits-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setEvRepeatVisits(data);
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		}
		setLoading(false);
	};

	const getEvDwellAverage = async () => {
		setLoading(true);
		setEvDwellAverage({})
		setEvDwellAverageMinMax({})
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-evAverageDwell-format-${dataFormat}-${sites}-${fromDate}-${toDate}`);
		let mainData = {} as any
		if (sessionData) {
			mainData =  JSON.parse(sessionData);
		} else {
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}&format=${dataFormat}`;

				const { data } = await axios.get(`/api/evData/evAverageDwell?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				

				sessionStorage.setItem(`insights-evAverageDwell-format-${dataFormat}-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				mainData = data;

			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		}
		
		if (dataFormat==="monthly"){
			let datasetsEvDwellAvgMon = [];
			let datasetsEvDwellAvgMinMaxMon = [];
			let datasets = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].datasets ? mainData[selectedSites[0]].datasets : []
			const arr1 = ["minAverageEvPureDwell","maxAverageEvPureDwell","minAverageEvHybridDwell","maxAverageEvHybridDwell"]
			for(const val of datasets){
				if(arr1.includes(val.label)){
					if(val.label=="minAverageEvPureDwell")
					{
						val.label="EV Pure Min Avg"
					}
					if(val.label=="maxAverageEvPureDwell")
					{
						val.label="EV Pure Max Avg"
					}
					if(val.label=="minAverageEvHybridDwell")
					{
						val.label="EV Hybrid Min Avg"
					}
					if(val.label=="maxAverageEvHybridDwell")
					{
						val.label="EV Hybrid Max Avg"
					}
					

					datasetsEvDwellAvgMinMaxMon.push(val)
				}else{
					datasetsEvDwellAvgMon.push(val)
				}
			}
			
			let labelsEvDwellAvgMon = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].labels ? mainData[selectedSites[0]].labels : [];
		    let modifiedEvDwellAvgMon = {} as any;
		
		    modifiedEvDwellAvgMon[selectedSites[0]] = {};
		    modifiedEvDwellAvgMon[selectedSites[0]].datasets = datasetsEvDwellAvgMon;
		    modifiedEvDwellAvgMon[selectedSites[0]].labels = labelsEvDwellAvgMon;
			
			let modifiedEvDwellAvgMinMaxMon = {} as any;
            modifiedEvDwellAvgMinMaxMon[selectedSites[0]] = {};
            modifiedEvDwellAvgMinMaxMon[selectedSites[0]].datasets = datasetsEvDwellAvgMinMaxMon;
            modifiedEvDwellAvgMinMaxMon[selectedSites[0]].labels = labelsEvDwellAvgMon;
			

		    setEvDwellAverage(modifiedEvDwellAvgMon);
		    setEvDwellAverageMinMax(modifiedEvDwellAvgMinMaxMon);
			

		}else{
			let datasetsEvDwellAvg = [];
		    let datasetsEvDwellAvgMinMax = [];
		    let datasets = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].datasets ? mainData[selectedSites[0]].datasets : []
		    const arr = ["EV Pure Min Avg","EV Pure Max Avg","EV Hybrid Min Avg","EV Hybrid Max Avg"]
		    for(const val of datasets){
			   if(arr.includes(val.label)){
				  datasetsEvDwellAvgMinMax.push(val)
			   }else{
				   datasetsEvDwellAvg.push(val)
			   }
		    }
			let labelsEvDwellAvg = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].labels ? mainData[selectedSites[0]].labels : [];
		let modifiedEvDwellAvg = {} as any;
		
		modifiedEvDwellAvg[selectedSites[0]] = {};
		modifiedEvDwellAvg[selectedSites[0]].datasets = datasetsEvDwellAvg;
		modifiedEvDwellAvg[selectedSites[0]].labels = labelsEvDwellAvg;

		let modifiedEvDwellAvgMinMax = {} as any;
		modifiedEvDwellAvgMinMax[selectedSites[0]] = {};
		modifiedEvDwellAvgMinMax[selectedSites[0]].datasets = datasetsEvDwellAvgMinMax;
		modifiedEvDwellAvgMinMax[selectedSites[0]].labels = labelsEvDwellAvg;
        
		setEvDwellAverage(modifiedEvDwellAvg);
		setEvDwellAverageMinMax(modifiedEvDwellAvgMinMax);

		}
		
		setLoading(false);
	};

	const getEvDwellByHour = async () => {
		setLoading(true);
		setEvDwellByHour({});
		setEvDwellByHourMinMax({});
		const sites = selectedSites?.join();
		const sessionData = sessionStorage.getItem(`insights-evDwellByHour-${sites}-${fromDate}-${toDate}`);
		let mainData = {} as any
		if (sessionData) {
			mainData = JSON.parse(sessionData);
		} else {
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userLoginType}&email=${email}&month=${selectedMonth}`;

				const { data } = await axios.get(`/api/evData/evDwellByHour?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				

				mainData = data
				sessionStorage.setItem(`insights-evDwellByHour-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		}
		let datasetsEvDwellByHour = [];
		let datasetsEvDwellByHourMinMax = [];
		let datasets = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].datasets ? mainData[selectedSites[0]].datasets : []
		const arr = ["EV Pure Min Avg","EV Pure Max Avg","EV Hybrid Min Avg","EV Hybrid Max Avg"]
		for(const val of datasets){
			if(arr.includes(val.label)){
				datasetsEvDwellByHourMinMax.push(val)
			}else{
				datasetsEvDwellByHour.push(val)
			}
		}
		let labelsEvDwellByHour = mainData && mainData[selectedSites[0]] && mainData[selectedSites[0]].labels ? mainData[selectedSites[0]].labels : [];
		let modifiedEvDwellByHour = {} as any;
		modifiedEvDwellByHour[selectedSites[0]] = {};
		modifiedEvDwellByHour[selectedSites[0]].datasets = datasetsEvDwellByHour;
		modifiedEvDwellByHour[selectedSites[0]].labels = labelsEvDwellByHour;

		let modifiedEvDwellByHourMinMax = {} as any;
		modifiedEvDwellByHourMinMax[selectedSites[0]] = {};
		modifiedEvDwellByHourMinMax[selectedSites[0]].datasets = datasetsEvDwellByHourMinMax;
		modifiedEvDwellByHourMinMax[selectedSites[0]].labels = labelsEvDwellByHour;

		setEvDwellByHour(modifiedEvDwellByHour);
		setEvDwellByHourMinMax(modifiedEvDwellByHourMinMax);
		setLoading(false);
	};

	const getTypeApproval = async () => {
		setLoading(true);
		setTypeApproval({})
		const sites = selectedSites?.join();
		
		
			try {
				const qs = `sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&month=${selectedMonth}&format=${dataFormat}&userType=${userLoginType}`;

				const { data }  = await axios.get(`/api/vehicles/typeApproval?${qs}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				sessionStorage.setItem(`insights-typeApproval-${sites}-${fromDate}-${toDate}`, JSON.stringify(data));
				setTypeApproval(data);
			} catch (e: any) {
				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
		
		setLoading(false);
	};


	
	useEffect(() => {
		if (fromDate && toDate && selectedSites.length > 0) {
			
			getModel();getColor();getAge();getFuel();getCo2();getEmissionsData();
			getValuations();getEvDwellByHour();getEvVisits();getEvDwellAverage();getEvRepeatVisits();getTypeApproval();
			if (activeLabel?.[selectedSites[0]] === "make") {
				getMake();
			}
			if (activeLabel?.[selectedSites[0]] === "model") {
				getModel();
			}
			if (activeLabel?.[selectedSites[0]] === "color") {
				getColor();

			}
			if (activeLabel?.[selectedSites[0]] === "age") {
				getAge();

			}
			if (activeLabel?.[selectedSites[0]] === "fuel") {
				getFuel();

			}
			if (activeLabel?.[selectedSites[0]] === "co2") {
				getCo2();
			}
			if (activeLabel?.[selectedSites[0]] === "emissions") {
				getEmissionsData();

			}

			if (activeLabel?.[selectedSites[0]] === "valuations") {

				getValuations();

			}
			if (activeLabel?.[selectedSites[0]] === "evDwellTimeByHour") {
				
				getEvDwellByHour();

			}
			if (activeLabel?.[selectedSites[0]] === "evTotalVisits") {
				getEvVisits();

			}
			if (activeLabel?.[selectedSites[0]] === "evAverageDwellTime") {
				getEvDwellAverage();

			}
			if (activeLabel?.[selectedSites[0]] === "evRepeatVisits") {
				getEvRepeatVisits();

			}
			if (activeLabel?.[selectedSites[0]] === "typeApproval") {
				getTypeApproval();
			}

		}
		// eslint-disable-next-line
	}, [fromDate, toDate, selectedSites, activeLabel, history, selectedMonth, showDaily, showEVOnly, showEvMinMax]);

	const createDownloadLink = (data: any, fileName: string) => {
		let link = document.createElement("a");
		let url = window.URL.createObjectURL(new Blob([data]));
		link.href = url;
		link.setAttribute("download", `insights_${fileName}_${dayjs().format("DD_MM_YYYY")}.zip`);
		document.body.appendChild(link);
		link.click();
	}

	const downloadCSV = async () => {
		const sites = selectedSites?.join();
		setDownloadingCSV(true);
		try {
			const { data: makeData } = await axios.get(
				`/api/vehicles/make?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(makeData, "make_data");
			const { data: modelData } = await axios.get(
				`/api/vehicles/model?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(modelData, "model_data");

			const { data: colorData } = await axios.get(
				`/api/vehicles/color?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(colorData, "color_data");

			const { data: ageData } = await axios.get(
				`/api/vehicles/age?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(ageData, "age_data");

			const { data: fuelData } = await axios.get(
				`/api/vehicles/fuel?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(fuelData, "fuel_data");

			const { data: co2Data } = await axios.get(
				`/api/vehicles/co2?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(co2Data, "co2_data");


			const { data: valuationData } = await axios.get(
				`/api/vehicles/valuations?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(valuationData, "valuation_data");
			const { data: dwellData } = await axios.get(
				`/api/evData/evAverageDwell?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}&format=${dataFormat}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(dwellData, "ev_dwell_data");
			const { data: dwellByHourData } = await axios.get(
				`/api/evData/evDwellByHour?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(dwellByHourData, "ev_dwell_by_hour_data");
			const { data: visitData } = await axios.get(
				`/api/evData/evVisits?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}&format=${dataFormat}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			
			createDownloadLink(visitData, "ev_visits_data");
			const { data: repeatVisitData } = await axios.get(
				`/api/evData/evRepeatFrequency?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(repeatVisitData, "ev_repeat_visits_data");
			
			const { data: typeApproval } = await axios.get(
				`/api/vehicles/typeApproval?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&responseType=csv&userType=${userLoginType}&month=${selectedMonth}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(typeApproval, "vehicle_type_data");
			
			
		} catch (e) {
			console.log("Error download csv insights: \n", e)
		}
		setDownloadingCSV(false);
	}

	useEffect(() => {
		if (selectedSites[0] && userLoginType !== 'Admin') {
			const data = sitesData.filter((eachSite: any) => eachSite.id === selectedSites[0])
			if (data[0]) {
				const minimumDate = data[0].contractStart ? new Date(data[0].contractStart) < new Date(dayjs().subtract(3, 'month').format('YYYY-MM-DD')) ? dayjs().subtract(3, 'month').toDate() : data[0].contractStart : dayjs().subtract(3, 'month').toDate();
				const maximumDate = data[0].contractEnd ? new Date(data[0].contractEnd) > new Date(dayjs().subtract(1, 'day').format('YYYY-MM-DD')) ? dayjs().subtract(1, 'day').toDate() : dayjs(data[0].contractEnd).add(1, 'day').toDate() : dayjs().subtract(1, 'day').toDate();
				setMinDate(new Date(minimumDate));
				setMaxDate(new Date(maximumDate));
			}
		}
		else {
			setMinDate(dayjs().subtract(3, 'month').toDate());
			setMaxDate(dayjs().subtract(1, 'day').toDate());
		}
		// eslint-disable-next-line
	}, [selectedSites])


	const setDateRange = (month: any, currMonth: any) => {
		setSelectedMonth(month)
		if (month === "2 Months") {
			let fromDate = dayjs().subtract(2, 'month').startOf("month").format("YYYY-MM-DD");
			let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
			setFromDate(fromDate)
			setToDate(toDate)
		} else if (month === "3 Months") {
			let fromDate = dayjs().subtract(3, 'month').startOf("month").format("YYYY-MM-DD");
			let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
			setFromDate(fromDate)
			setToDate(toDate)
		} else if (month === "6 Months") {
			let fromDate = dayjs().subtract(6, 'month').startOf("month").format("YYYY-MM-DD");
			let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
			setFromDate(fromDate)
			setToDate(toDate)
		} else if (month === "January") {
			setFromDate(`${currentYear}-01-01`)
			setToDate(`${currentYear}-01-31`)
		}
		else if (month === "February") {
			setFromDate(`${currentYear}-02-01`)
			setToDate(currentYear % 4 === 0 ? `${currentYear}-02-29` : `${currentYear}-02-28`)
		}
		else if (month === "March") {
			setFromDate(`${currentYear}-03-01`)
			setToDate(`${currentYear}-03-31`)
		}
		else if (month === "April") {
			setFromDate(`${currentYear}-04-01`)
			setToDate(`${currentYear}-04-30`)
		}
		else if (month === "May") {
			setFromDate(`${currentYear}-05-01`)
			setToDate(`${currentYear}-05-31`)
		}
		else if (month === "June") {
			setFromDate(`${currentYear}-06-01`)
			setToDate(`${currentYear}-06-30`)
		}
		else if (month === "July") {
			if (currMonth === 0) {
				setFromDate(`${currentYear - 1}-07-01`)
				setToDate(`${currentYear - 1}-07-31`)
			} else {
				setFromDate(`${currentYear}-07-01`)
				setToDate(`${currentYear}-07-31`)
			}
		}
		else if (month === "August") {
			if (currMonth === 0 || currMonth === 1) {
				setFromDate(`${currentYear - 1}-08-01`)
				setToDate(`${currentYear - 1}-08-31`)
			} else {
				setFromDate(`${currentYear}-08-01`)
				setToDate(`${currentYear}-08-31`)
			}

		}
		else if (month === "September") {
			if (currMonth >= 0 && currMonth <= 2) {
				setFromDate(`${currentYear - 1}-09-01`)
				setToDate(`${currentYear - 1}-09-30`)
			} else {
				setFromDate(`${currentYear}-09-01`)
				setToDate(`${currentYear}-09-30`)
			}

		}
		else if (month === "October") {
			if (currMonth >= 0 && currMonth <= 3) {
				setFromDate(`${currentYear - 1}-10-01`)
				setToDate(`${currentYear - 1}-10-31`)
			} else {
				setFromDate(`${currentYear}-10-01`)
				setToDate(`${currentYear}-10-31`)
			}

		} else if (month === "November") {
			if (currMonth >= 0 && currMonth <= 4) {
				setFromDate(`${currentYear - 1}-11-01`)
				setToDate(`${currentYear - 1}-11-30`)
			} else {
				setFromDate(`${currentYear}-11-01`)
				setToDate(`${currentYear}-11-30`)
			}

		} else if (month === "December") {
			if (currMonth >= 0 && currMonth <= 5) {
				setFromDate(`${currentYear - 1}-12-01`)
				setToDate(`${currentYear - 1}-12-31`)
			} else {
				setFromDate(`${currentYear}-12-01`)
				setToDate(`${currentYear}-12-31`)
			}
		}
	}

	const showEvOnlyFunc = () => {
		setEvPureDwellByHour({});
		setEvPureVisits({})
		setEvPureDwellAverage({})
		setEvPureRepeatVisits({})
		if (showEVOnly) {
			if (activeLabel?.[selectedSites[0]] === "evDwellTimeByHour") {

				let datasetsEvDwellByHour = evDwellByHour[selectedSites[0]] ? evDwellByHour[selectedSites[0]].datasets : [];
				let labelsEvDwellByHour = evDwellByHour[selectedSites[0]] ? evDwellByHour[selectedSites[0]].labels : [];

				let modifiedEvDwellByHour = {} as any;
				let newEvDwellByHourDataSets = datasetsEvDwellByHour.filter((eachRecord: any) => {
					return eachRecord.label === "EV Hybrid" || eachRecord.label === "EV Pure" || eachRecord.label === "EV All"
				})
				let newEvDwellByHourLabels = labelsEvDwellByHour.map((eachRecord: any) => {
					return eachRecord
				})
				modifiedEvDwellByHour[selectedSites[0]] = {};
				modifiedEvDwellByHour[selectedSites[0]].datasets = newEvDwellByHourDataSets;
				modifiedEvDwellByHour[selectedSites[0]].labels = newEvDwellByHourLabels;

				setEvPureDwellByHour(modifiedEvDwellByHour);
			}
			if (activeLabel?.[selectedSites[0]] === "evTotalVisits") {
				let datasetsEvTotalVisits = evVisits[selectedSites[0]] ? evVisits[selectedSites[0]].datasets : [];
				let labelsEvTotalVisits = evVisits[selectedSites[0]] ? evVisits[selectedSites[0]].labels : [];

				let modifiedEvTotalVisits = {} as any;
				let newEvTotalVisitsDataSets = datasetsEvTotalVisits.filter((eachRecord: any) => {
					if(dataFormat === "monthly"){
						return eachRecord.label === "evHybridVisits" || eachRecord.label === "evAllVisits" || eachRecord.label === "evPureVisits"
	
						}else{
							return eachRecord.label === "EV Hybrid" || eachRecord.label === "EV Pure" || eachRecord.label === "EV All"
	
						}
				})
				let newEvTotalVisitsLabels = labelsEvTotalVisits.map((eachRecord: any) => {
					return eachRecord
				})
				modifiedEvTotalVisits[selectedSites[0]] = {};
				modifiedEvTotalVisits[selectedSites[0]].datasets = newEvTotalVisitsDataSets;
				modifiedEvTotalVisits[selectedSites[0]].labels = newEvTotalVisitsLabels;

				setEvPureVisits(modifiedEvTotalVisits);
			}
			if (activeLabel?.[selectedSites[0]] === "evAverageDwellTime") {
				let datasetsEvDwellAverage = evDwellAverage[selectedSites[0]] ? evDwellAverage[selectedSites[0]].datasets : [];
				let labelsEvDwellAverage = evDwellAverage[selectedSites[0]] ? evDwellAverage[selectedSites[0]].labels : [];

				let modifiedEvDwellAverage = {} as any;
				let newEvDwellAverageDataSets = datasetsEvDwellAverage.filter((eachRecord: any) => {
					if(dataFormat === "monthly"){
					return eachRecord.label === "averageEvPureDwell" || eachRecord.label === "averageEvHybridDwell" || eachRecord.label === "averageEvAllDwell"

					}else{
						return eachRecord.label === "EV Hybrid" || eachRecord.label === "EV Pure" || eachRecord.label === "EV All"

					}
				})
				let newEvDwellAverageLabels = labelsEvDwellAverage.map((eachRecord: any) => {
					return eachRecord
				})
				modifiedEvDwellAverage[selectedSites[0]] = {};
				modifiedEvDwellAverage[selectedSites[0]].datasets = newEvDwellAverageDataSets;
				modifiedEvDwellAverage[selectedSites[0]].labels = newEvDwellAverageLabels;

				setEvPureDwellAverage(modifiedEvDwellAverage)
			}
			if (activeLabel?.[selectedSites[0]] === "evRepeatVisits") {
				let datasetsEvRepeatVisits = evRepeatVisits[selectedSites[0]] ? evRepeatVisits[selectedSites[0]].datasets : [];
				let labelsEvRepeatVisits = evRepeatVisits[selectedSites[0]] ? evRepeatVisits[selectedSites[0]].labels : []
				let modifiedEvRepeatVisits = {} as any;
				let newEvRepeatVisitsDataSets = datasetsEvRepeatVisits.filter((eachRecord: any) => {
					return eachRecord.label === "EV Hybrid" || eachRecord.label === "EV Pure" || eachRecord.label === "EV All"
				})
				let newEvRepeatVisitsLabels = labelsEvRepeatVisits.map((eachRecord: any) => {
					return eachRecord
				})
				modifiedEvRepeatVisits[selectedSites[0]] = {};
				modifiedEvRepeatVisits[selectedSites[0]].datasets = newEvRepeatVisitsDataSets;
				modifiedEvRepeatVisits[selectedSites[0]].labels = newEvRepeatVisitsLabels;

				setEvPureRepeatVisits(modifiedEvRepeatVisits)
			}
		}else if(showEvMinMax && activeLabel?.[selectedSites[0]] === "evDwellTimeByHour"){
			
			setEvPureDwellByHour(evDwellByHourMinMax)
		}else if(showEvMinMax && activeLabel?.[selectedSites[0]] === "evAverageDwellTime"){
			   setEvPureDwellAverage(evDwellAverageMinMax)
		}
		else {
			setEvPureDwellByHour(evDwellByHour);
			setEvPureVisits(evVisits)
			setEvPureDwellAverage(evDwellAverage)
			setEvPureRepeatVisits(evRepeatVisits)
		}

	}
	
	

	useEffect(() => {
		showEvOnlyFunc()
	}, [ evVisits, evDwellAverage, evDwellByHour, evRepeatVisits, showEVOnly, showEvMinMax, evDwellByHourMinMax, evDwellAverageMinMax]);
    
	function toggleEv(e:any){
		
        setShowEvOnly(e)
		if(e){
			setShowEvMinMax(false)
		}
	}
	  async function toggleMinMax(e:any){
		await setShowEvOnly(false)
        //  
		 if(e){
			setShowEvMinMax(e)
		 }else{
			setShowEvMinMax(e)
		 }
		
			// setShowEvMinMax(e)
		
	 }


	return (
		<React.Fragment>
			<div className="insights__refine-menu">
				<Flex className="--margin-bottom-large" justify="space-between" wrap="wrap">
					<LabelledComponent label="Car park">
						<MultiSelect
							fullWidth={!!isMobile}
							multi={false}
							className="insights__refine-menu__multi-select"
							options={selectableSites.map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
							values={selectedSites}
							onChange={(values) => {
								sessionStorage.removeItem("insights-emissions-manufacturers");
								const normalizedSites = Formatter.normalizeSites(values) || [];
								setSelectedSites(normalizedSites);
								setActiveLabel({ [values[0]]: "make" } || activeLabel)
								localStorage.setItem("insights-sites", normalizedSites.join());
							}}
						/>
					</LabelledComponent>

					{/* If client asks to provide a date picker just uncomment it
					<LabelledComponent label="Date range">
						<DatePicker
							disabled={!selectedSites[0]}
							onChange={(values) => {
								setSelectedMonth('');
								sessionStorage.removeItem("insights-emissions-manufacturers");
								if (values) {
									setFromDate(moment(values[0]).format(YMD));
									setToDate(moment(values[1]).format(YMD));
									localStorage.setItem("insights-from-date", `${dayjs(values[0]).format(YMD)}`);
									localStorage.setItem("insights-to-date", `${dayjs(values[1]).format(YMD)}`);
								} else {
									setFromDate(undefined);
									setToDate(undefined);
									localStorage.removeItem("insights-from-date");
									localStorage.removeItem("insights-to-date");
								}
							}}
							minDate={minDate}
							maxDate={maxDate}
							values={fromDate && toDate && [moment(fromDate), moment(toDate)]}
						/>
					</LabelledComponent> */}
					{!isMobile && (
						<LabelledComponent label="Download formats">
							<Flex>
								<Button
									text="Print/PDF"
									variant="filled"
									disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate)}
									icon={<PDFIcon />}
									loading={downloadingPDF}
									buttonStyle={{ marginRight: 8 }}
									onClick={() => {
										setDownloadingPDF(true);
										window.print();
										setDownloadingPDF(false);
									}}
								/>
								<Button
									text="CSV"
									variant="filled"
									disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate)}
									icon={<CSVIcon />}
									loading={downloadingCSV}
									buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
									onClick={downloadCSV}
								/>
							</Flex>
						</LabelledComponent>
					)}
				</Flex >

				<Flex style={{ width: '70%' }} justify="space-between" wrap="wrap">
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth], currentMonth) }}
					>{months[currentMonth]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1], currentMonth) }}
					>{months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5]}
					</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6], currentMonth) }}
					>
						{months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6]}
					</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "2 Months" ? `--active` : ""}`}
						onClick={() => { setDateRange("2 Months", currentMonth) }}
					>{`${dayjs().subtract(2, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "3 Months" ? `--active` : ""}`}
						onClick={() => { setDateRange("3 Months", currentMonth) }}
					>{`${dayjs().subtract(3, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "6 Months" ? `--active` : ""}`}

						onClick={() => { setDateRange("6 Months", currentMonth) }}
					>{`${dayjs().subtract(6, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>

				</Flex>
			</div>

			<>
				{loading && (
					<ProgressBar />
				)}
				{make && Object.keys(make).length > 0 && (
					<div className="vehicles-area" style={{ marginTop: 32 }}>
						<h2>
							<b>Vehicle data</b>
						</h2>
						<Divider />
						{make && Object.keys(make).length > 0 &&
							Object.keys(make).map((site: string) => {
								const dateFrmt = "DD MMM (YYYY)";
								const dateRangeStr = `${dayjs(fromDate).format(dateFrmt)} - ${dayjs(toDate).format(dateFrmt)}`;
								return (
									<CardWithTabs
										height={650}
										mHeight={620}
										key={site}
										activeLabel={activeLabel?.[site] || "make"}
										title={
											<Flex direction="column">
												<h2 style={{ margin: 0, marginRight: 8, marginBottom: 4, marginTop: 8 }}>
													<b>{Formatter.capitalizeSite(formatSite(site, email))}</b>
												</h2>
												<h4>{dateRangeStr}</h4>
											</Flex>
										}
										htmlElement={activeLabel?.[selectedSites[0]] === "evDwellTimeByHour" ||
											activeLabel?.[selectedSites[0]] === "evTotalVisits" ||
											activeLabel?.[selectedSites[0]] === "evAverageDwellTime" ||
											activeLabel?.[selectedSites[0]] === "evRepeatVisits" ?
											<div>
												<b style={{ alignSelf: 'center' }}>Show EV Only</b>
												<Toggle
													checked={showEVOnly}
													color='success'
													onChange={(e) =>toggleEv(e.target.checked)
														 
													}
												/>
												{
													(activeLabel?.[selectedSites[0]] === "evDwellTimeByHour" || activeLabel?.[selectedSites[0]] === "evAverageDwellTime") && 
													<>
														<b style={{ alignSelf: 'center' }}>Show EV Min/Max</b>
														<Toggle
															checked={showEvMinMax}
															color='success'
															onChange={(e)=>( setShowEvOnly(false),toggleMinMax(e.target.checked)
		                                                                  )
	                                                    }
														/>
													</>
												}
											</div> : ''
										}
										onItemClick={({ label }) => {
											setActiveLabel({ ...activeLabel, [site]: label });
											localStorage.setItem('insights-activeLabel', label);
										}}
										tabColor="dark"
										loading={loading}
										isOpen
										items={[
											{
												label: "Make",
												value: "make",
												content: make[site] && make[site].make && Object.keys(make[site].make).length > 0 && (
													<>
														<LabelledComponent label="Sort order" style={{ float: "right", marginBottom: 8 }}>
															<Switch
																className="insights__refine-menu__switch"
																checkedChildren="A - Z"
																unCheckedChildren="H - L"
																defaultChecked={sortOrder === "a-z"}
																style={{ marginRight: 8 }}
																onChange={(isAlphabetical) => {
																	if (isAlphabetical) {
																		setSortOrder("a-z");
																	} else {
																		setSortOrder("h-l");
																	}
																}}
															/>
														</LabelledComponent>
														<br />
														<div style={{ height: isMobile ? 150 : 280, overflowY: "scroll", width: "100%" }}>
															<VehiclesGraph
																key={site + "make" + make[site].make.length}
																color="magenta"
																label="Visits"
																labelAxisX="Visits"
																height={isMobile ? 350 : make[site].make.length === 0 ? 70 : make[site].make.length * 6}
																type="Make"
																data={{
																	datasets: [
																		{
																			values: isAlphaSort
																				? make[site].make
																					// .slice(0, 20)
																					.sort(sortBy("name"))
																					.map(({ total } : any) => String(total))
																				: make[site].make
																					// .slice(0, 20)
																					.sort(sortBy("total", 1))
																					.map(({ total } : any) => String(total))
																		}
																	],
																	labels: isAlphaSort
																		? make[site].make
																			// .slice(0, 20)
																			.sort(sortBy("name"))
																			.map(({ name } : any) => Formatter.capitalize(name))
																		: make[site].make
																			// .slice(0, 20)
																			.sort(sortBy("total", 1))
																			.map(({ name } : any) => Formatter.capitalize(name))
																}}
															/>
														</div>
													</>
												)
											},
											{
												label: "Model",
												value: "model",
												content: model[site] && model[site].model && Object.keys(model[site].model).length > 0 && (
													<>
														<LabelledComponent label="Sort order" style={{ float: "right", marginBottom: 8 }}>
															<Switch
																className="insights__refine-menu__switch"
																checkedChildren="A - Z"
																unCheckedChildren="H - L"
																defaultChecked={sortOrder === "a-z"}
																style={{ marginRight: 8 }}
																onChange={(isAlphabetical) => {
																	if (isAlphabetical) {
																		setSortOrder("a-z");
																	} else {
																		setSortOrder("h-l");
																	}
																}}
															/>
														</LabelledComponent>
														<br />
														<div style={{ height: isMobile ? 150 : 280, overflowY: "scroll", width: "100%" }}>
															<VehiclesGraph
																key={site + "model" + model[site].model.length}
																color="purple"
																label="Visits"
																type="Model"
																labelAxisX="Visits"
																height={isMobile ? 350 : model[site].model.length === 0 ? 70 : model[site].model.length < 1334 ? model[site].model.length * 6 : 8000}
																data={{
																	datasets: [
																		{
																			values: isAlphaSort
																				? model[site].model
																					// .slice(0, 20)
																					.sort(sortBy("name"))
																					.map(({ total } : any) => String(total))
																				: model[site].model
																					// .slice(0, 20)
																					.sort(sortBy("total", 1))
																					.map(({ total } : any) => String(total))
																		}
																	],
																	labels: isAlphaSort
																		? model[site].model
																			// .slice(0, 20)
																			.sort(sortBy("name"))
																			.map(({ name } : any) => Formatter.capitalize(name))
																		: model[site].model
																			// .slice(0, 20)
																			.sort(sortBy("total", 1))
																			.map(({ name } : any) => Formatter.capitalize(name))
																}}
															/>
														</div>
													</>
												)
											},
											{
												label: "Colour",
												value: "color",
												content: color[site] && color[site].colorType && Object.keys(color[site].colorType).length > 0 && (
													<>
														<LabelledComponent label="Sort order" style={{ float: "right", marginBottom: 8 }}>
															<Switch
																className="insights__refine-menu__switch"
																checkedChildren="A - Z"
																unCheckedChildren="H - L"
																defaultChecked={sortOrder === "a-z"}
																style={{ marginRight: 8 }}
																onChange={(isAlphabetical) => {
																	if (isAlphabetical) {
																		setSortOrder("a-z");
																	} else {
																		setSortOrder("h-l");
																	}
																}}
															/>
														</LabelledComponent>
														<br />
														<VehiclesGraph
															key={site}
															color="green"
															label="Visits"
															type="Color"
															labelAxisX="Visits"
															yAxisTitle="Visits"
															isHorizontal={false}
															height={isMobile ? 350 : 90}
															data={{
																datasets: [
																	{
																		values: isAlphaSort
																			? color[site].colorType
																				.slice(0, 20)
																				.sort(sortBy("name"))
																				.map(({ total } : any ) => String(total))
																			: color[site].colorType
																				.slice(0, 20)
																				.sort(sortBy("total", 1))
																				.map(({ total } : any ) => String(total))
																	}
																],
																labels: isAlphaSort
																	? color[site].colorType
																		.slice(0, 20)
																		.sort(sortBy("name"))
																		.map(({ name } : any ) => Formatter.capitalize(name))
																	: color[site].colorType
																		.slice(0, 20)
																		.sort(sortBy("total", 1))
																		.map(({ name } : any ) => Formatter.capitalize(name))
															}}
														/>
													</>
												)
											},
											{
												label: "Age",
												value: "age",
												content: age[site] && age[site].age && Object.keys(age[site].age).length > 0 && (
													<TwoYAxisGraph
														height={isMobile ? 420 : 90}
														leftTitle="Visits"
														rightTitle="Emissions"
														data={{
															datasets: [
																{
																	values: age[site].age.map(({ total } : any ) => String(total)),
																	label: "Total Visits",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values: age[site].age.map(({ emissions } : any) => String(emissions)),
																	label: "CO2 Emissions(Average)",
																	yAxisID: "right",
																	color: "purple"
																}
															],
															labels: age[site].age.map(({ ageGap } : any) => String(ageGap).replace(" yrs", ""))
														}}
													/>
												)
											},
											{
												label: "Fuel",
												value: "fuel",
												content: fuel[site] && fuel[site].fuel && Object.keys(fuel[site].fuel).length > 0 && (
													// <VehiclesGraph
													// 	key={site}
													// 	color="blue"
													// 	label="Vehicles"
													// 	type="Fuel"
													// 	height={isMobile ? 420 : 90}
													// 	labelAxisX="Fuel type"
													// 	isHorizontal={false}
													// 	data={{
													// 		datasets: [
													// 			{
													// 				values: vehicles[site].fuel.map(({ total }) => String(total)),
													// 				label: "Visits"
													// 			},
													// 			{
													// 				values: vehicles[site].fuel.map(({ emissions }) => String(emissions)),
													// 				label: "CO₂ Emissions (average)"
													// 			}
													// 		],
													// 		labels: vehicles[site].fuel.map(({ fuel }) => Formatter.capitalize(fuel))
													// 	}}
													// />
													<TwoYAxisGraph
														height={isMobile ? 420 : 90}
														leftTitle="Visits"
														rightTitle='CO₂ g/km'
														data={{
															datasets: [
																{
																	values: fuel[site].fuel.map(({ total } : any ) => String(total)),
																	label: "Visits",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values: fuel[site].fuel.map(({ emissions } : any ) => String(emissions)),
																	label: "CO₂ Emissions (average)",
																	yAxisID: "right",
																	color: "purple"
																},
																
															],
															labels: fuel[site].fuel.map(({ fuel } : any ) => Formatter.capitalize(fuel))
															
															
														}}
													/>
												)
											},
											{
												label: "CO2",
												value: "co2",
												content: co2[site] && co2[site].co2 && (co2[site].co2).length > 0 && (
													// <VehiclesGraph
													// 	key={site}
													// 	color="green"
													// 	label="Emissions (average)"
													// 	labelAxisY="CO₂ / Visits"
													// 	type="CO2"
													// 	height={isMobile ? 350 : 98}
													// 	isHorizontal={false}
													// 	data={{
													// 		datasets: [
													// 			{
													// 				values: vehicles[site].co2.map(({ emissionsAverage }) => String(emissionsAverage)),
													// 				label: "CO₂ Emissions (average)"
													// 			},
													// 			{
													// 				values: vehicles[site].co2.map(({ vehicles }) => String(vehicles)),
													// 				label: "Visits"
													// 			}
													// 		],
													// 		labels: vehicles[site].co2.map(({ when }) => dayjs(when).format("DD MMM"))
													// 	}}
													// />
													<TwoYAxisGraph
														height={isMobile ? 420 : 90}
														leftTitle="Visits"
														rightTitle='Emissions'
														data={{
															datasets: [
																{
																	values: co2[site].co2.map(({ emissionsAverage } : any ) => String(emissionsAverage)),
																	label: "CO₂ Emissions (average)",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values: co2[site].co2.map(({ vehicles } : any ) => String(vehicles)),
																	label: "Visits",
																	yAxisID: "right",
																	color: "purple"
																},
															],
															labels: co2[site].co2.map(({ when } : any ) => dayjs(when).format("DD MMM"))
														}}
													/>
												)
											},
											{

												label: "Emissions",
												value: "emissions",
												content: emissions && (
													<>
														<LabelledComponent
															label="Vehicle manufacturer"
															style={{ float: "right", marginRight: 16, marginBottom: 8 }}
														>
															<MultiSelect
																fullWidth={!!isMobile}
																className="insights__refine-menu__multi-select"
																options={allMake
																	.sort()
																	.map((make: string) => ({
																		value: make,
																		label: make
																	}))}
																multi={false}
																placement="bottomLeft"
																placeholder="All manufacturers"
																values={selectedMake ? [selectedMake] : []}
																onChange={(values) => {
																	if (values[0]) {
																		setSelectedMake(values[0]);
																	} else {
																		setSelectedMake(null);
																	}
																}}
															/>
														</LabelledComponent>

														<LabelledComponent
															label="CO₂ emission ranges"
															style={{ float: "right", marginRight: 16, marginBottom: 8 }}
														>
															<MultiSelect
																fullWidth={!!isMobile}
																className="insights__refine-menu__multi-select"
																options={["0", "1-50", "51-100", "101-150", "151-200", "200"].map((range) => ({
																	value: range,
																	label: range
																}))}
																multi={false}
																placement="bottomLeft"
																placeholder="All ranges"
																values={selectedRange ? [selectedRange] : []}
																onChange={(values) => {
																	if (values[0]) {
																		setSelectedRange(values[0]);
																	} else {
																		setSelectedRange(null);
																	}
																}}
															/>
														</LabelledComponent>

														<br />
														<VehiclesGraph
															key={site}
															color="green"
															label="Vehicles"
															type="Emissions"
															displayLegend={!selectedRange}
															// maxAxisY={originalSampleSize && originalSampleSize[site]}
															height={isMobile ? 350 : 90}
															isHorizontal={true}
															labelAxisY={selectedRange ? selectedRange + " CO₂/km" : "CO₂ emissions"}
															labelAxisX={selectedRange ? "CO₂ emissions" : "Vehicles"}
															labelSpacingAxisY={selectedRange && selectedMake ? 200 : selectedRange ? 140 : 100}
															data={ emissionTabData }
														/>
													</>
												)
											},
											{
												label: "Valuations",
												value: "valuations",
												afterSlot: isMobile ? undefined : <div className="navbar__tabs__tag">Beta</div>,
												content: valuations[site] && (
													<TwoYAxisGraph
														height={isMobile ? 420 : 90}
														leftTitle="Maximum"
														rightTitle='Minimum And Average'
														data={{
															datasets: [
																{
																	values: valuations[site] ? Object.values(valuations[site]).map((value) =>{
																	return value.maxPrice}) : [],
																	label: "Valuations (max)",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values: valuations[site] ? Object.values(valuations[site]).map((value) => value.minPrice) : [],
																	label: "Valuations (min)",
																	yAxisID: "right",
																	color: "purple"
																},
																{
																	values: valuations[site] ? Object.values(valuations[site]).map((value) => value.averagePrice) : [],
																	label: "Valuations (average)",
																	yAxisID: "right",
																	color: "magenta"
																}
															],
															labels: valuations[site] ? Object.keys(valuations[site]).map((date) => dayjs(date).format("DD MMM")) : []
														}}
													/>
												)
											},
											{
												label: "EV-Dwell Time By Hour",
												value: "evDwellTimeByHour",
												content: evPureDwellByHour[site] && (showEvMinMax?
													 <>
                                                    <TwoYAxisGraph  
													        key={site} 															
															height={isMobile ? 420 : 90} 														
														    leftTitle="Maximum"
														    rightTitle='Minimum'
														    data={{
															    datasets: [
																{
																	values: evPureDwellByHour[site] ?evPureDwellByHour[site].datasets[1]? evPureDwellByHour[site].datasets[1].values:[]													
																	 : [],
																	label: "Ev Pure Max Avg",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values:  evPureDwellByHour[site] ?evPureDwellByHour[site].datasets[3]? evPureDwellByHour[site].datasets[3].values:[]	
																	: [],
																	label: "Ev Hybrid Max Avg",
																	yAxisID: "left",
																	color: "purple"
																},
																{
																	values: evPureDwellByHour[site] ?evPureDwellByHour[site].datasets[0]? evPureDwellByHour[site].datasets[0].values:[]		
																	 : [],
																	label: "Ev Pure Min Avg",
																	yAxisID: "right",
																	color: "magenta"
																},
																{
																	values: evPureDwellByHour[site] ? evPureDwellByHour[site].datasets[2]? evPureDwellByHour[site].datasets[2].values:[]	
																	: [],
																	label: "Ev Hybrid Min Avg",
																	yAxisID: "right",
																	color: "green"
																}
															],
															labels: evPureDwellByHour[site] ? Object.values(evPureDwellByHour[site].labels).map((date:any) =>date) : []
														}}
														/>
														</>:
														<>

														<VehiclesGraph
															 key={site} 
															color="yellow" 
															label="Dwell(average)" 
															type="EV-Dwell Time By Hour" 
															labelAxisX="Time" 
															yAxisTitle="Minutes"
															height={isMobile ? 420 : 90} 
															isHorizontal={false} 
															data={{ 
																datasets: evPureDwellByHour[site] ? evPureDwellByHour[site].datasets : [], 
																labels: evPureDwellByHour[site] ? evPureDwellByHour[site].labels : [], 
															}} 
														/> 
													</>
												      )
													},
											{
												label: "EV-Total Visits",
												value: "evTotalVisits",
												content: evPureVisits[site] && (
													<>
														<div style={{ display: 'flex', justifyContent: 'end' }}>
															<Switch
																style={{ marginRight: 8 }}
																className="reports__refine-menu__switch --margin-bottom-large"
																checkedChildren={<span>Daily</span>}
																unCheckedChildren={<span>Monthly</span>}
																defaultChecked={showDaily}
																onChange={(value) => {
																	setShowDaily(value);
																	if(value){
																		setDataFormat('daily')
																	}else{
																		setDataFormat('monthly');
																	}
																}}
															/>
														</div>

														<VehiclesGraph
															key={site}
															color="blue"
															label="Visits"
															type="EV-Total Visits"
															yAxisTitle="Visits"
															height={isMobile ? 420 : 90}
															labelAxisX="Date"
															isHorizontal={false}
															data={{
																datasets: evPureVisits[site] ? evPureVisits[site].datasets : [],
																labels: evPureVisits[site] ? evPureVisits[site].labels : [],
															}}
														/>

													</>

												)
											},
											{
												label: "EV-Average Dwell Time",
												value: "evAverageDwellTime",
												content: evpureDwellAverage[site] && (!showEvMinMax?
													<>

														<div style={{ display: 'flex', justifyContent: 'end' }}>
															<Switch
																style={{ marginRight: 8 }}
																className="reports__refine-menu__switch --margin-bottom-large"
																checkedChildren={<span>Daily</span>}
																unCheckedChildren={<span>Monthly</span>}
																defaultChecked={showDaily}
																onChange={(value) => {
																	setShowDaily(value);
																	if(value){
																		setDataFormat('daily')
																	}else{
																		setDataFormat('monthly')
																	}
																	
																}}
															/>
														</div>
														
														<VehiclesGraph
															key={site}
															color="green"
															label="Dwell(average)"
															labelAxisY="Date"
															yAxisTitle="Minutes"
															type="EV-Average Dwell Time"
															height={isMobile ? 420 : 90}
															isHorizontal={false}
															data={{
																datasets: evpureDwellAverage[site] ? evpureDwellAverage[site].datasets : [],
																labels: evpureDwellAverage[site] ? evpureDwellAverage[site].labels : [],
															}}
														/>
													</>: <>
													<div style={{ display: 'flex', justifyContent: 'end' }}>
															<Switch
																style={{ marginRight: 8 }}
																className="reports__refine-menu__switch --margin-bottom-large"
																checkedChildren={<span>Daily</span>}
																unCheckedChildren={<span>Monthly</span>}
																defaultChecked={showDaily}
																onChange={(value) => {
																	setShowDaily(value);
																	if(value){
																		setDataFormat('daily')
																	}else{
																		setDataFormat('monthly')
																	}
																	
																}}
															/>
														</div>
                                                    <TwoYAxisGraph  
													        key={site} 															
															height={isMobile ? 420 : 90} 														
														    leftTitle="Maximum"
														    rightTitle='Minimum'
														    data={{
															    datasets: [
																{
																	values: evpureDwellAverage[site] ?evpureDwellAverage[site].datasets[1]? evpureDwellAverage[site].datasets[1].values:[]													
																	 : [],
																	label: "Ev Pure Max Avg",
																	yAxisID: "left",
																	color: "yellow"
																},
																{
																	values: evpureDwellAverage[site] ?evpureDwellAverage[site].datasets[3]? evpureDwellAverage[site].datasets[3].values:[]	
																	: [],
																	label: "Ev Hybrid Max Avg",
																	yAxisID: "left",
																	color: "purple"
																},
																{
																	values: evpureDwellAverage[site] ? evpureDwellAverage[site].datasets[0]? evpureDwellAverage[site].datasets[0].values:[]		
																	 : [],
																	label: "Ev Pure Min Avg",
																	yAxisID: "right",
																	color: "magenta"
																},
																{
																	values: evpureDwellAverage[site] ?evpureDwellAverage[site].datasets[2]? evpureDwellAverage[site].datasets[2].values:[]	
																	: [],
																	label: "Ev Hybrid Min Avg",
																	yAxisID: "right",
																	color: "green"
																}
															],
															labels: evpureDwellAverage[site] ? Object.values(evpureDwellAverage[site].labels).map((date:any) =>date) : []
														}}
														/>
														</>


												)
											},
											{
												label: "EV-Repeat Visits",
												value: "evRepeatVisits",
												content: evPureRepeatVisits[site] && (
													<>
														<VehiclesGraph
															key={site}
															color="green"
															label="Repeat Frequency"
															labelAxisY="Time"
															type="EV-Repeat Visits"
															yAxisTitle="Visits"
															xAxisTitle="Repeat Frequency"
															height={isMobile ? 350 : 90}
															isHorizontal={false}
															data={{
																datasets: evPureRepeatVisits[site] ? evPureRepeatVisits[site].datasets : [],
																labels: evPureRepeatVisits[site] ? evPureRepeatVisits[site].labels : [],
															}}
														/>
													</>

												)
											},
											{
												label: "Vehicle Type",
												value: "typeApproval",
												content: typeApproval[site] && (
													<>
													<div style={{ display: 'flex', justifyContent: 'end' }}>
															<Switch
																style={{ marginRight: 8 }}
																className="reports__refine-menu__switch --margin-bottom-large"
																checkedChildren={<span>Daily</span>}
																unCheckedChildren={<span>Monthly</span>}
																defaultChecked={showDaily}
																onChange={(value) => {
																	setShowDaily(value);
																	if(value){
																		setDataFormat('daily')
																	}else{
																		setDataFormat('monthly')
																	}
																	
																}}
															/>
														</div>

														<VehiclesGraph
															key={site}
															color="green"
															label="Vehicle Type"
															labelAxisY="Time"
															yAxisTitle="Visits"
															type="Vehicle Type"
															height={isMobile ? 350 : 90}
															isHorizontal={false}
															data={{
																datasets: typeApproval[site] ? typeApproval[site].datasets : [],
																labels: typeApproval[site] ? typeApproval[site].labels : [],
															}}
														/>
													</>

												)
											}
										]}
									/>
								);
							})}
					</div>
				)}
			</>

			<InsightPdfTemplate
				make={make || {}}
				model={model || {}}
				fuel={fuel || {}}
				age={age || {}}
				co2={co2 || {}}
				color={color || {}}
				vehicles={vehicles || {}}
				// originalSampleSize={originalSampleSize || 10}
				valuations={valuations || {}}
				emissions={emissions || {}}
				evVisits={evVisits || {}}
				evRepeatVisits={evRepeatVisits || {}}
				evDwellAverage={evDwellAverage || {}}
				evDwellByHour={evDwellByHour || {}}
				typeApproval={typeApproval || {}}
				chartType={'bar'}
				dateRange={`${dayjs(fromDate).format("DD MMM YYYY")} - ${dayjs(toDate).format("DD MMM YYYY")}`}
				selectedRange={selectedRange || null}
				selectedMake={selectedMake || null}
				emissionTabData={emissionTabData || {}}
			/>
		</React.Fragment>
	);
};
