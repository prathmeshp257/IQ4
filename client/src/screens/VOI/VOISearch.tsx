import React, { FC, useState, useContext, useEffect } from "react";
import CSVIcon from "@material-ui/icons/Assessment";
import moment from "moment";
import axios from "axios";  
import dayjs from "dayjs";
import { Flex, DatePicker, MultiSelect, Button } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { YMD } from "../../constants";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DataTable } from "../../components";
import { Divider } from "../../components/Divider";

const Form = styled.form`
	width: 100%;
`;

const InputText = styled.input`
	display: flex;
	height: 38px;
	width: 100%;
	min-width: ${isMobile ? "260px" : "250px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "250px"};
	box-shadow: inset 1px 1px 2px #14141469;
	border-radius: 10px;
	border: none;
	font-size: 13px;
	letter-spacing: 1.1px;
	align-items: center;
	background-color: #f4f2f6;
	-webkit-appearance: none;
	:focus {
		outline-color: ${colors.primary};
	}
`;

const AutoComplete = styled(Autocomplete)`
	& .MuiInputBase-input {
	height: 0.8rem;
	}
`;

export const VOISearch: FC = () => {
	const {userData} = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
	const localSearchString = localStorage.getItem("voi-search-string") ? JSON.parse(localStorage.getItem("voi-search-string") || "") : "";
	const { enqueueSnackbar } = useSnackbar();
    const [fromDate, setFromDate] = useState<string | undefined>(localSearchString.fromDate ? localSearchString.fromDate : undefined);
	const [toDate, setToDate] = useState<string | undefined>(localSearchString.toDate ? localSearchString.toDate : undefined);
    const [downloadingCSV, setDownloadingCSV] = useState(false);
    const { sites } = useContext(UserContext);
    const [selectedSites, setSelectedSites] = useState<string[]>(localSearchString.site ? [localSearchString.site] : []);
    const [searchData, setSearchData] = useState<string[]>([]);
    const [searchCount, setSearchCount] = useState<number>(0);
	const [maxDate ,setMaxDate] = useState<any>();
	const [minDate ,setMinDate] = useState<any>();
	const [loading, setLoading] = useState(false);
	const [vrmType ,setVrmType] = useState<string[]>(localSearchString.vrmType ? [localSearchString.vrmType] : []);
	const [makeList, setMakeList] = useState<any[]>([]);
	const [modelList, setModelList] = useState<any[]>([]);
	const [colorList, setColorList] = useState<any[]>([]);
	const [localSearchSites, setLocalSearchSites] = useState<any[]>([]);
	const [insightAccess, setInsightAccess] = useState<boolean>(false);
	const [columns, setColumns] = useState<any[]>(["VRM", "Date/Time", "Direction", "Camera", "Plate", "Overview"]);
	const [vrmOptions, setVrmOptions] = useState<any[]>(["Exact","Partial"]);
	const userLoginType = userData.userType;

	const rowsPerPage = 50;

	useEffect(() => {
		if(insightAccess){
			setColumns(["VRM", "Date/Time", "Direction", "Camera", "Make", "Model", "Colour", "Fuel Type", "Year", "Plate", "Overview"]);
			setVrmOptions(["Exact","Partial", "No VRM"]);
		}
		else{
			setColumns(["VRM", "Date/Time", "Direction", "Camera", "Plate", "Overview"]);
			setVrmOptions(["Exact","Partial"]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[insightAccess])

	useEffect(() => {
		const localSearchAccessSites = userData.vehicleSearchAccessSites;
		if(userLoginType !== "Admin" && localSearchAccessSites){
			let accessSites = localSearchAccessSites;
			for(const eachSite of localSearchAccessSites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setLocalSearchSites(accessSites);
		}
		else if(userLoginType === "Admin"){
			setLocalSearchSites(sites);
			setInsightAccess(true);
		}
		else{
			setLocalSearchSites([]);
			setInsightAccess(false);
		}
		// eslint-disable-next-line
	},[sitesData])
	

	const cancelSearch = () => {
		setFromDate(undefined);
		setToDate(undefined);
		setMaxDate(undefined);
		setMinDate(undefined);
		setSelectedSites([]);
		setVrmType([]);
		setMakeList([]);
		setModelList([]);
		setColorList([]);
		setSearchData([]);
		setSearchCount(0);
		formik.setFieldValue("site", "");
		formik.setFieldValue("vrmType", "");
		formik.setFieldValue("fromDate", "");
		formik.setFieldValue("toDate", "");
		formik.resetForm(); 
	}

	const getData = async(values: any) => {
		setLoading(true);
		const searchString =`${values.site}-${fromDate}-${toDate}-${values.vrmType}-${values.vrm}-${values.make}-${values.model}-${values.color}-${values.page}`;
		const sessionSearchData = sessionStorage.getItem(searchString)
		if(sessionSearchData){
			const parsedData = JSON.parse(sessionSearchData);
			setSearchData(parsedData.searchData);
			setSearchCount(parsedData.searchCount);
		}
		else{
			try {
				values.perPage = rowsPerPage;
				values.insightAccess = insightAccess;
				values.userType = userLoginType;
				values.email = userData.email;
				const {data} = await axios.get(`/api/voi/search`, {
					params: values,
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setSearchData(data.searchData);
				setSearchCount(data.searchCount);
				sessionStorage.setItem(searchString, JSON.stringify(data));
			} catch (e) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
				setSearchData([]);
				setSearchCount(0);
				sessionStorage.setItem(searchString, "");
			}
		}
		localStorage.setItem("voi-search-string", JSON.stringify(values))
		setLoading(false);
	}

	const handleSearch = async(values: any) => {
		formik.setFieldValue("page", 0);
		values.page = 0;
		await getData(values);
	}

	const vrmTypeChange = (values: any) => {
		setVrmType(values);
		setFromDate(undefined);
		setToDate(undefined);
		setMaxDate(undefined);
		setMinDate(undefined);
		formik.setFieldValue("vrmType",values[0]);
		formik.setFieldValue("fromDate","");
		formik.setFieldValue("toDate","");
		formik.setFieldValue("vrm", "")
		formik.setFieldValue("make", "")
		formik.setFieldValue("model", "")
		formik.setFieldValue("color", [])
	}

	const onSiteChange = (values: any) => {
		const normalizedSites = Formatter.normalizeSites(values) || [];
		setVrmType([])
		setFromDate(undefined);
		setToDate(undefined);
		setMaxDate(undefined);
		setMinDate(undefined);
		formik.resetForm();
		setSelectedSites(normalizedSites);
		formik.setFieldValue("site", normalizedSites[0]);
	}

	const onDateChange = (values: any) => {
		if (values) {
			setFromDate(moment(values[0]).format(YMD));
			setToDate(moment(values[1]).format(YMD));
			formik.setFieldValue("fromDate", values[0] ? moment(values[0]).format(YMD) : "");
			formik.setFieldValue("toDate", values[1] ? moment(values[1]).format(YMD) : "");
		} else {
			setFromDate(undefined);
			setToDate(undefined);
			formik.setFieldValue("fromDate", "");
			formik.setFieldValue("toDate", "");
		}
	}

	const onCalendarChange = (values: any) => {
		if (values && values[0]) {
			setMaxDate(vrmType[0] === "Partial" ? dayjs(values[0]).add(1,"week").toDate() : dayjs(values[0]).add(1,"month").toDate())
		} else if(values && !values[0] && values[1]){
			setMinDate(vrmType[0] === "Partial" ? dayjs(values[1]).subtract(1,"week").toDate() : dayjs(values[1]).add(1,"month").toDate())
			setMaxDate(dayjs(values[1]).toDate())
		}
	}

	const handleOpenChange = (open: any) => {
		if(open){
			setFromDate(undefined);
			setToDate(undefined);
			setMinDate(dayjs().subtract(10,"year").toDate());
			setMaxDate(dayjs().toDate());
		}
	}

	const handleChangePage = async(newPage: any) => {
		formik.setFieldValue("page", Number(newPage || 0) || 0)
		formik.values.page = Number(newPage || 0) || 0;
		await getData(formik.values);
			
	}

	const onCSVClick = async (values: any) => {
		setDownloadingCSV(true);
		try {
			values.responseType = "csv";
			values.insightAccess = insightAccess;
			values.userType = userLoginType;
			values.email = userData.email;
			const response = await axios.get(`/api/voi/search`,
				{ responseType: "blob", params:values, headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `Vehicle_Search_${dayjs().format("DD_MM_YYYY")}.zip`);
			document.body.appendChild(link);
			link.click();
		} catch (e) {}
		setDownloadingCSV(false);
	}
	
	const formik = useFormik({
		initialValues: {
			vrmType: "",
			vrm: "",
			make: "",
			model: "",
			color: [],
			site: "",
			fromDate: "",
			toDate: "",
			page: 0
		},
		onSubmit: handleSearch
	});

	useEffect(() => {
		formik.setFieldValue("make", "");
		formik.setFieldValue("model", "");
		formik.setFieldValue("color", []);

		const getSiteData = async() => {
			try {
				const {data: makes} = await axios.get(`/api/sites/makeBySite?site=${selectedSites[0]}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setMakeList(makes.allMakes)
				const {data: colors} = await axios.get(`/api/sites/colorBySite?site=${selectedSites[0]}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});

				const capitalizeColor = [] as any;

				colors.allColors.map((color:any,index:any)=>{
					let toLowerCase = color.toLowerCase()
					capitalizeColor.push( toLowerCase.charAt(0).toUpperCase() + toLowerCase.slice(1))
				})

				const uinqueColors = capitalizeColor.filter((color:any,index:any)=>{
					return capitalizeColor.indexOf(color) === index
				})
				
				setColorList(uinqueColors)
			} catch (error) {
				console.log("Error Site Data", error);
				setMakeList([]);
				setColorList([]);
				setModelList([]);
			}
		}

		const getInsightsAccess = () => {
			const localSearchInsightSites = userData.vehicleSearchInsightAccessSites;
			if(userLoginType !== "Admin" && localSearchInsightSites){
				const insightAccessLocal = userData.vehicleSearchInsightAccess && localSearchInsightSites && localSearchInsightSites.includes(selectedSites[0]) ? true : false;
				setInsightAccess(insightAccessLocal);
			}else if(userLoginType === "Admin"){
				setInsightAccess(true);
			}
		}
		if(selectedSites[0]){
			getSiteData();
			getInsightsAccess();
		}
		else{
			setInsightAccess(false);
			setMakeList([]);
			setColorList([]);
			setModelList([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSites]);

	useEffect(() => {
		formik.setFieldValue("model", "");
		const getModelData = async() => {
			try {
				const {data: models} = await axios.get(`/api/sites/modelBySite?site=${selectedSites[0]}&make=${formik.values.make}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setModelList(models.allModels)
			} catch (error) {
				console.log("Error Model Data", error);
				setModelList([]);
			}
		}
		if(formik.values.make){
			getModelData();
		}
		else{
			setModelList([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.make]);

	useEffect(() => {
		const setInitialData = async () => {
			await formik.setValues({
				vrmType: localSearchString.vrmType || "",
				vrm: localSearchString.vrm || "",
				make: localSearchString.make || "",
				model: localSearchString.model || "",
				color: localSearchString.color || [],
				site: localSearchString.site || "",
				fromDate: localSearchString.fromDate || "",
				toDate: localSearchString.toDate || "",
				page: localSearchString.page || 0
			});
			await getData(localSearchString);
		}
		if(localSearchString && localSearchString.site){
			setTimeout(() => {
				setInitialData();
			}, 1000);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

    return(
        <React.Fragment>
			<Form onSubmit={formik.handleSubmit}>
        	    <Flex className="reports__refine-menu" justify="space-between" style={{maxWidth:"100%",minWidth:300}}>
					<LabelledComponent label="Car parks">
						<MultiSelect
							style={{width: "250px"}}
							multi = {false}
							className="reports__refine-menu__multi-select"
							options={localSearchSites ? localSearchSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) })) : []}
							values={selectedSites}
							onChange={onSiteChange}
						/>
					</LabelledComponent>
					<LabelledComponent label="VRM Search Type">
						<MultiSelect
							placeholder="Select VRM Search Type"
							disabled={!selectedSites[0]}
							style={{width: "250px",marginLeft:'-6px'}}
							multi = {false}
							className="reports__refine-menu__multi-select"
							options={vrmOptions.map((type) => ({ value: type, label: type }))}
							values={vrmType}
							onChange={vrmTypeChange}
						/>
					</LabelledComponent>
					<LabelledComponent label="Date range">
						<DatePicker
							disabled={!selectedSites[0] || !vrmType[0]}
							onChange={onDateChange}
							onCalendarChange={onCalendarChange}
							maxDate={maxDate}
							minDate={minDate}
							values={fromDate && toDate && [moment(fromDate), moment(toDate)]}
							style={{maxWidth:"250px"}}
							onOpenChange={handleOpenChange}
						/>
					</LabelledComponent>
					<LabelledComponent label="VRM">
						<InputText
							disabled={!vrmType[0] || !selectedSites[0] || !fromDate || !toDate || vrmType[0] === "No VRM"}
							id="vrm"
							name="vrm"
							placeholder="Min 3 characters"
							onChange={formik.handleChange}
							onBlur={() => formik.setFieldTouched("vrm")}
							value={formik.values.vrm}
							minLength={3}
						/>
					</LabelledComponent>
					{ 
						insightAccess ? 
							<React.Fragment>
								<LabelledComponent label="Make">
									<AutoComplete
										disabled={!selectedSites[0] || !fromDate || !toDate || !vrmType[0]}
										id="make"
										options={[...makeList, ""]}
										value={formik.values.make}
										sx={{ width: "250px"}}
										onInputChange={(e: any) => {
											if(e){
												formik.setFieldValue("make", e?.target?.outerText || "");
												formik.setFieldValue("model", "");
											}
										}}
										renderInput={(params) => <TextField {...params} label={null} name="make" />}
									/>
								</LabelledComponent>
								<LabelledComponent label="Model">
									<AutoComplete
										disabled={!selectedSites[0] || !formik.values.make || !fromDate || !toDate || !vrmType[0]}
										id="model"
										options={[...modelList,""]}
										sx={{ width: "250px"}}
										value={formik.values.model}
										onInputChange={(e: any) => {
											if(e){
												formik.setFieldValue("model", e?.target?.outerText || "")
											}
										}}
										renderInput={(params) => <TextField {...params} label={null} name="model" />}
									/>
								</LabelledComponent>
								<LabelledComponent label="Colour">
									<AutoComplete
										disabled={!selectedSites[0] || !fromDate || !toDate || !vrmType[0]}
										id="color"
										options={[...colorList, ""]}
										sx={{ width: "250px"}}
										value={formik.values.color[0]}
										onInputChange={(e: any) => {
											if(e){
												formik.setFieldValue("color", [e?.target?.outerText,e?.target?.outerText.toUpperCase()] || "")
											}
										}}
										renderInput={(params) => <TextField {...params} label={null} name="color" />}
									/>
								</LabelledComponent>
							</React.Fragment>
						: ""
					}
					<Flex justify="start">
						<LabelledComponent className="dashboard__refine-menu__search" label="Actions">
							<Button
								text="Search"
								type="submit" 
								loading={loading}
								disabled={!selectedSites[0] || !vrmType[0] || !(formik.values.vrm || formik.values.make || formik.values.model || formik.values.color) || !fromDate || !toDate}
								buttonStyle={{ display: "inline-block",marginRight: 8, minWidth: 80,  maxWidth: 80}}
							/>
							<Button
								text="Reset"
								buttonStyle={{ display: "inline-block",marginRight: 8, minWidth: 80,  maxWidth: 80 }}
								onClick={cancelSearch}
							/>
						</LabelledComponent>
						<LabelledComponent label="Download formats">
							<Button
								text="CSV"
								variant="filled"
								disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate) || downloadingCSV}
								icon={<CSVIcon />}
								loading={downloadingCSV}
								buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
								onClick={() => onCSVClick(formik.values)}
							/>
						</LabelledComponent>
					</Flex>
				</Flex>
			</Form>
			<Divider />
			<DataTable 
				title="Search Data" 
				columns={columns} 
				data={searchData} 
				loading={loading} 
				pagination={true} 
				count={searchCount} 
				handleChangePage={async(page:any) => await handleChangePage(page)} 
				page={formik.values.page} 
				rowsPerPage={rowsPerPage} 
			/>
        </React.Fragment>
    );
};