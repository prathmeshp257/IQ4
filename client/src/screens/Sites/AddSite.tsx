import { FormikValues, useFormik } from "formik";
import React, { FC, useEffect, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex } from "../../components";
import { colors } from "../../utils/constants";
import { AddSchema } from "../../validationScheemas/SiteSchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import { AuthContext, SiteContext } from "../../context";
import { DatePicker } from '@mui/lab';
import moment from 'moment';
import { TextField } from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs from "dayjs";

interface Props {
	addOpen: any;
	closeDialog: any;
}

const useStyles = makeStyles((theme) => ({
	dialogPaper: {
		maxHeight: '75vh',
	},
}));

const Form = styled.form`
	width: 100%;
    text-align: center;
`;

const Label = styled.label`
	font-size: 12px;
	display: flex;
	margin-bottom: 4px;
	color: ${colors.darkGray};
`;

const Error = styled.label`
	font-size: 12px;
	color: red;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
`;

const InputText = styled.input`
	display: flex;
	height: 44px;
	width: 100%;
	min-width: ${isMobile ? "260px" : "455px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "455px"};
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

export const AddSite: FC<Props> = ({ addOpen, closeDialog }) => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const { reloadSitesData } = useContext(SiteContext);
	const userType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [operators, setOperators] = useState<any>([]);
	const [minDate, setMinDate] = useState<any>(null);
	const [maxDate, setMaxDate] = useState<any>(null);
	const [priorityList, setPriorityList] = useState<any>();
	const [urlRows, setUrlRows] = useState<any>(['']);
	const [errorUrl, setErrorUrl] = useState<any>([])
	const [urlSpreadsheet, setUrlSpreadsheet] = useState("");
	const [errorSpreadsheetURL, setErrorSpreadsheetURL] = useState(false);




	useEffect(() => {
		const getOperators = async () => {
			const { data } = await axios.get("/api/users/operators", {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setOperators(data);
		}
		getOperators()

		setPriorityList(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
	}, [userType]);

	const handleSubmit = async (values: FormikValues) => {
		try {
			if ((values.contractStart && !values.contractEnd) || (!values.contractStart && values.contractEnd)) {
				formik.setFieldError("contractEnd", "both contract dates are required")
				return
			}
			let filteredUrl = urlRows.filter((url: any) => url != "")

			values.id = Formatter.normalizeSite(values.name);
			values.name = Formatter.capitalize(values.name);
			if (values.contractStart && values.contractEnd) {
				values.contractStart = moment(values.contractStart).format('DD-MM-YYYY');
				values.contractEnd = moment(values.contractEnd).format('DD-MM-YYYY');
			}
			values.forwardUrl = filteredUrl;
			values.spreadsheetUrl = urlSpreadsheet

			if (values.approxMatchVrmCorrectionAccess === "true") {
				values.approxMatchVrmCorrectionAccess = true
			}
			else {
				values.approxMatchVrmCorrectionAccess = false
			}
			if (values.vrmCorrectionPrefixAccess === true && !values.vrmCorrectionPrefix) {
				formik.setFieldError('vrmCorrectionPrefix', 'Please Enter Prefix Value');
				return;
			}

			if (values.vrmCorrectionPrefixAccess === true && !values.prefixDataForDays) {
				formik.setFieldError('prefixDataForDays', 'Please select days');
				return;
			}

			if (values.prefixDataForDays) {
				values.prefixDataForDays = Number(values.prefixDataForDays)
			}
            values.plateTrack = values.plateTrack === "true" ? true : false 
             

			await axios.post("/api/sites", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			enqueueSnackbar("Site created successfully.");
			reloadSitesData();
			setUrlRows(['']);


		} catch (e: any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
		}
		cancelAdd();
	};

	const cancelAdd = () => {
		formik.resetForm();
		setUrlRows(['']);
		setErrorUrl([])
		closeDialog();
	}

	const formik = useFormik({
		initialValues: {
			name: "",
			capacity: 0,
			operatorId: "",
			status: "ONBOARDING",
			contractStart: null,
			contractEnd: null,
			expiryTime: 0,
			postcode: "",
			apiAccess: false,
			priority: "",
			siteType: 'ENTRY',
			basicOccupancyCount: '',
			manualCorrectionAccess: false,
			cameraApiAccess: false,
			vrmCorrectionAccess: false,
			vrmCorrectionPrefixAccess: false,
			vrmCorrectionPrefix: '',
			basicOccupancyDate: '',
			approxMatchVrmCorrectionAccess: "false",
			maxDurationApproxMatch: '',
			prefixDataForDays: '',
			spreadsheetUrl: '',
			plateTrack: "false"
		},
		validationSchema: AddSchema,
		onSubmit: handleSubmit
	});


	const handleDateChange = (type: any, value: any) => {
		if (type === 'start') {
			formik.setFieldValue('contractEnd', null);
			if (value) {
				formik.setFieldValue('contractStart', moment(value).toDate());
			}
			else {
				formik.setFieldValue('contractStart', null)
			}
		}
		if (type === 'end') {
			if (value) {
				formik.setFieldValue('contractEnd', moment(value).toDate());
			}
			else {
				formik.setFieldValue('contractEnd', null)
			}
		}
	}

	useEffect(() => {
		setMinDate(moment(formik.values.contractStart).toDate());
		setMaxDate(moment(formik.values.contractStart).add(3, 'year').toDate());
	}, [formik.values.contractStart]);









	const addURLRow = () => {
		const modifiedUrlRows = [...urlRows];
		if (urlRows[urlRows.length - 1] !== "" && !errorUrl.includes(false)) {
			modifiedUrlRows.push('');
			setUrlRows(modifiedUrlRows);
		} else {
			enqueueSnackbar("Please fill in valid URL", {
				variant: "error",
			});
		}

	}


	const deleteURLRow = (key: any) => {
		var modifiedUrlRows = [...urlRows];
		modifiedUrlRows = modifiedUrlRows.filter((value, index) => key !== index)
		let newurl = modifiedUrlRows.map((string: any) => {

			let url;
			try {
				url = new URL(string);
			} catch (_) {
				return false;
			}

			return url.protocol === "http:" || url.protocol === "https:";

		})
		setErrorUrl(newurl)
		setUrlRows(modifiedUrlRows);
	}
	const setUrl = (e: any, key: any) => {
		const modifiedUrlRows = [...urlRows];
		const value = e.target.value;
		modifiedUrlRows[key] = value.trim();

		let newurl = modifiedUrlRows.map((string: any) => {

			let url;
			try {
				url = new URL(string);
			} catch (_) {
				return false;
			}

			return url.protocol === "http:" || url.protocol === "https:";

		})
		setErrorUrl(newurl)
		setUrlRows(modifiedUrlRows);
	}

	const cameraIPbuttonStyle = {
		//alignSelf: 'center',
		width: '40px',
		height: '40px',
		//marginTop: '15px',
		cursor: 'pointer',
	}


	return (
		<Dialog open={addOpen} onClose={() => cancelAdd()}
			fullWidth={true}
			classes={{ paper: classes.dialogPaper }}
			maxWidth={'sm'}>
			<Form onSubmit={formik.handleSubmit}>
				<DialogTitle>
					{`Add Site`}
				</DialogTitle>
				<DialogContent>
					<Flex direction="row" justify="center" wrap="wrap">
						<div className="--margin-bottom-large">
							<Label>Name</Label>
							<InputText
								id="name"
								name="name"
								type="text"
								autoComplete="nope"
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("name")}
								value={formik.values.name}
							/>
							{formik.touched.name && formik.errors.name && (
								<Error>{formik.touched.name && formik.errors.name}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>Capacity</Label>
							<InputText
								id="capacity"
								name="capacity"
								type="number"
								autoComplete="nope"
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("capacity")}
								value={formik.values.capacity}
							/>
							{formik.touched.capacity && formik.errors.capacity && (
								<Error>{formik.touched.capacity && formik.errors.capacity}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>Operator</Label>
							<select name="operatorId" id="operatorId"
								style={{ width: `${isMobile ? "260px" : "455px"}`, height: '44px', borderRadius: '10px', textAlign: 'center' }}
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("operatorId")}
							>
								<option value="">Please Select Operator</option>
								{
									operators && operators.length > 0 && operators.map((eachOperator: any) => {
										return <option value={eachOperator._id}>{eachOperator.email}</option>
									})
								}
							</select>
							{formik.touched.operatorId && formik.errors.operatorId && <Error>{formik.touched.operatorId && formik.errors.operatorId}</Error>}
						</div>
						<div className="--margin-bottom-large">
							<Label>Status</Label>
							<select name="status" id="status"
								style={{ width: `${isMobile ? "260px" : "455px"}`, height: '44px', borderRadius: '10px', textAlign: 'center' }}
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("status")}
							>
								<option value="ONBOARDING">ONBOARDING</option>
								<option value="ONLINE">ONLINE</option>
								<option value="OFFLINE">OFFLINE</option>
							</select>
							{formik.touched.status && formik.errors.status && <Error>{formik.touched.status && formik.errors.status}</Error>}
						</div>
						<div className="--margin-bottom-large">
							<Label>Priority Status</Label>
							<select name="priority" id="priority"
								style={{ width: `${isMobile ? "260px" : "455px"}`, height: '44px', borderRadius: '10px', textAlign: 'center' }}
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("priority")}
							>
								{/* <option value="low">Low</option> */}
								{
									priorityList && priorityList.length > 0 && priorityList.map((priorityList: any) => {
										return <option value={priorityList}>{priorityList}</option>
									})
								}
							</select>
							{formik.touched.priority && formik.errors.priority && <Error>{formik.touched.priority && formik.errors.priority}</Error>}
						</div>

						<div className="--margin-bottom-large">
							<Label>Type</Label>
							<select
								name="siteType"
								id="siteType"
								style={{
									width: `${isMobile ? "260px" : "455px"}`,
									height: "44px",
									borderRadius: "10px",
									textAlign: "center",
								}}
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("siteType")}
							>
								<option
									value="ENTRY"
									selected={formik.initialValues.siteType === "ENTRY"}
								>
									Pay On Entry
								</option>
								<option
									value="EXIT"
									selected={formik.initialValues.siteType === "EXIT"}
								>
									Pay On Exit
								</option>
								<option
									value="Others"
									selected={formik.initialValues.siteType === "OTHER"}
								>
									Others
								</option>
							</select>
							{formik.touched.siteType && formik.errors.siteType && (
								<Error>
									{formik.touched.siteType && formik.errors.siteType}
								</Error>
							)}
						</div>

						<div className="--margin-bottom-large" style={{width:"455px"}}>		
							<Label>Store Plate Track</Label>
							<div style={{fontSize:"15px" ,textAlign:"left",marginTop:"10px"}} 
								onChange={(e) => {
									formik.handleChange(e)
								
								}}
							>
								<label style={{ cursor: "pointer" }}>
									<input type="radio" name="plateTrack" defaultChecked={formik.values.plateTrack !== "true"}  value="false" id="false" style={{ marginRight: "5px" }} />
									False
								</label>
								<label style={{ cursor: "pointer" }}>
									<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="plateTrack" value="true" id="true" />
									True
								</label>
							</div>
						</div>
						<div className="--margin-bottom-large">
							<Label>Postcode</Label>
							<InputText
								id="postcode"
								name="postcode"
								type="text"
								autoComplete="nope"
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("postcode")}
								value={formik.values.postcode}
							/>
							{formik.touched.postcode && formik.errors.postcode && (
								<Error>{formik.touched.postcode && formik.errors.postcode}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>Expiry Time in Hours</Label>
							<InputText
								id="expiryTime"
								name="expiryTime"
								type="number"
								autoComplete="nope"
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("capacity")}
								value={formik.values.expiryTime}
							/>
							{formik.touched.expiryTime && formik.errors.expiryTime && (
								<Error>{formik.touched.expiryTime && formik.errors.expiryTime}</Error>
							)}
						</div>

						<Flex
							direction="row"
							justify="space-between"
							align="flex-start"
							style={{ width: "455px" }}
						>
							<div className="--margin-bottom-large">
								<TextField
									label="Basic Occupancy Count"
									id="basicOccupancyCount"
									name="basicOccupancyCount"
									type="number"
									placeholder="Basic Occupancy Count"
									autoComplete="nope"
									InputLabelProps={{
										shrink: true,
									}}
									onChange={formik.handleChange}
									onBlur={() =>
										formik.setFieldTouched("basicOccupancyCount")
									}
									value={formik.values.basicOccupancyCount}
								/>
								{formik.touched.basicOccupancyCount &&
									formik.errors.basicOccupancyCount && (
										<Error>
											{formik.touched.basicOccupancyCount &&
												formik.errors.basicOccupancyCount}
										</Error>
									)}
							</div>

							<div className="--margin-bottom-large">
								<TextField
									label="Basic Occupancy Date/Time"
									id="basicOccupancyDate"
									type="datetime-local"
									name="basicOccupancyDate"
									onChange={formik.handleChange}
									onBlur={() =>
										formik.setFieldTouched("basicOccupancyDate")
									}
									sx={{ width: 200 }}
									InputLabelProps={{
										shrink: true,
									}}
									value={dayjs(formik.values.basicOccupancyDate).format("DD-MM-YYYYTHH:mm:ss")}
								/>
								{formik.touched.basicOccupancyDate &&
									formik.errors.basicOccupancyDate && (
										<Error>
											{formik.touched.basicOccupancyDate &&
												formik.errors.basicOccupancyDate}
										</Error>
									)}
							</div>
						</Flex>
						<div className="--margin-bottom-large" style={{ marginRight: 'auto', marginLeft: '8%' }}>
							<input
								id="apiAccess"
								name="apiAccess"
								type="checkbox"
								style={{ width: '12px', height: '12px' }}
								autoComplete="nope"
								onChange={formik.handleChange}
								checked={formik.values.apiAccess}
							/>
							<label htmlFor="apiAccess"> MMC/CO2/VAL Access</label>
						</div>

						<div className="--margin-bottom-large" style={{ marginRight: "auto", marginLeft: "8%" }}>
							<input
								id="manualCorrectionAccess"
								name="manualCorrectionAccess"
								type="checkbox"
								style={{ width: "12px", height: "12px" }}
								autoComplete="nope"
								onChange={formik.handleChange}
								defaultChecked={formik.values.manualCorrectionAccess}
							/>
							<label htmlFor="manualCorrectionAccess"> Manual Correction Access</label>
						</div>
						<div
							className="--margin-bottom-large"
							style={{ marginRight: "auto", marginLeft: "8%" }}
						>
							<input
								id="vrmCorrectionAccess"
								name="vrmCorrectionAccess"
								type="checkbox"
								style={{ width: "12px", height: "12px" }}
								autoComplete="nope"
								onChange={(e) => {
									formik.setFieldValue('vrmCorrectionAccess', e.target.checked);
									if (!e.target.checked) {
										formik.setFieldValue('approxMatchVrmCorrectionAccess', 'false')

									}
								}
								}
								defaultChecked={formik.values.vrmCorrectionAccess}
							/>
							<label htmlFor="vrmCorrectionAccess"> VRM Correction Access</label>
						</div>
						<div
							className="--margin-bottom-large"
							style={{ marginRight: "auto", marginLeft: "12%" }}
						>
							<input
								id="vrmCorrectionPrefixAccess"
								name="vrmCorrectionPrefixAccess"
								type="checkbox"
								style={{ width: "12px", height: "12px" }}
								autoComplete="nope"
								onChange={(e) => {
									formik.setFieldValue('vrmCorrectionPrefixAccess', e.target.checked);
									if (!e.target.checked) {
										formik.setFieldValue('vrmCorrectionPrefix', '')
										formik.setFieldValue('prefixDataForDays', '')
									}
								}
								}
								defaultChecked={formik.values.vrmCorrectionPrefixAccess}
							/>
							<label htmlFor="vrmCorrectionPrefixAccess"> VRM Correction Prefix Access</label>
						</div>

						<div
							className="--margin-bottom-large"
							style={{ marginRight: "auto", marginLeft: "8%" }}
						>
							<input
								id="cameraApiAccess"
								name="cameraApiAccess"
								type="checkbox"
								style={{ width: "12px", height: "12px" }}
								autoComplete="nope"
								onChange={formik.handleChange}
								defaultChecked={formik.values.cameraApiAccess}
							/>
							<label htmlFor="cameraApiAccess"> Camera API Call Access</label>
						</div>

						{
							formik.values.vrmCorrectionPrefixAccess === true &&

							<div style={{ display: "flex", justifyContent: 'space-between', width: "455px" }} >
								<div className="--margin-bottom-large">
									<Label>VRM Correction Prefix</Label>
									<InputText
										style={{ minWidth: "200px", maxWidth: '200px' }}
										id="vrmCorrectionPrefix"
										name="vrmCorrectionPrefix"
										type="text"
										autoComplete="nope"
										onChange={formik.handleChange}
										onBlur={() => formik.setFieldTouched("vrmCorrectionPrefix")}
										value={formik.values.vrmCorrectionPrefix}
									/>
									{formik.touched.vrmCorrectionPrefix && formik.errors.vrmCorrectionPrefix && (
										<Error>
											{formik.touched.vrmCorrectionPrefix && formik.errors.vrmCorrectionPrefix}
										</Error>
									)}
								</div>

								<div className="--margin-bottom-large">
									<Label>Send data for last number of days</Label>
									<select
										name="prefixDataForDays"
										id="prefixDataForDays"
										style={{
											minWidth: "200px", maxWidth: '200px',
											height: "44px",
											borderRadius: "10px",
											textAlign: "center",
										}}
										onChange={formik.handleChange}
										onBlur={() => formik.setFieldTouched("prefixDataForDays")}
									>
										<option
											value="1"
											selected={formik.values.prefixDataForDays === "1"}
										>
											1 Day
										</option>
										<option
											value="3"
											selected={formik.values.prefixDataForDays === "3"}
										>
											3 Days
										</option>
										<option
											value="7"
											selected={formik.values.prefixDataForDays === "7"}
										>
											7 Days
										</option>
										<option
											value="15"
											selected={formik.values.prefixDataForDays === "15"}
										>
											15 Days
										</option>
										<option
											value="30"
											selected={formik.values.prefixDataForDays === "30"}
										>
											30 Days
										</option>
									</select>
									{formik.touched.prefixDataForDays && formik.errors.prefixDataForDays && (
										<Error>
											{formik.touched.prefixDataForDays && formik.errors.prefixDataForDays}
										</Error>
									)}
								</div>
							</div>
						}
						{
							formik.values.vrmCorrectionAccess === true &&

							<div className="--margin-bottom-large">
								<Label>VRM Correction Approx Match</Label>
								<select
									name="approxMatchVrmCorrectionAccess"
									id="approxMatchVrmCorrectionAccess"
									style={{
										minWidth: "455px",
										maxWidth: '455px',
										height: "44px",
										borderRadius: "10px",
										textAlign: "center",
									}}
									onChange={formik.handleChange}
									onBlur={() => formik.setFieldTouched("approxMatchVrmCorrectionAccess")}
								>
									<option
										value="false"
										selected={formik.values.approxMatchVrmCorrectionAccess === 'false'}
									>
										FALSE
									</option>
									<option
										value="true"
										selected={formik.values.approxMatchVrmCorrectionAccess === 'true'}
									>
										TRUE
									</option>
								</select>
								{formik.touched.approxMatchVrmCorrectionAccess && formik.errors.approxMatchVrmCorrectionAccess && (
									<Error>
										{formik.touched.approxMatchVrmCorrectionAccess && formik.errors.approxMatchVrmCorrectionAccess}
									</Error>
								)}
							</div>

						}
						{formik.values.vrmCorrectionAccess === true && formik.values.approxMatchVrmCorrectionAccess === 'true' ?
							<div className="--margin-bottom-large">
								<Label>Approx Match Max Duration For VRM Correction (mins)</Label>
								<InputText
									type="number"
									value={formik.values.maxDurationApproxMatch}
									onChange={formik.handleChange}
									name="maxDurationApproxMatch"
								/>
								{formik.touched.maxDurationApproxMatch && formik.errors.maxDurationApproxMatch && (
									<Error>
										{formik.touched.maxDurationApproxMatch && formik.errors.maxDurationApproxMatch}
									</Error>
								)}
							</div> : ''}
						<Flex direction="row" justify="space-between" align="flex-start" style={{ width: "455px" }}  >
							<div className="--margin-bottom-large" style={{ width: `200px` }}>
								<Label>Contract Start Date</Label>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<div onBlur={() => formik.setFieldTouched("contractStart")}>
										<DatePicker
											label=""
											clearable={true}
											openTo="year"
											views={['year', 'month', 'day']}
											inputFormat="dd/MM/yyyy"
											value={formik.values.contractStart}
											allowSameDateSelection={true}
											onChange={(newValue) => handleDateChange('start', newValue)}
											renderInput={(params) => <TextField {...params} />}
										/>
									</div>
								</LocalizationProvider>
							</div>
							<div className="--margin-bottom-large" style={{ width: `200px` }}>
								<Label>Contract End Date</Label>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<div onBlur={() => formik.setFieldTouched("contractEnd")}>
										<DatePicker
											disabled={!!!formik.values.contractStart}
											label=""
											clearable={true}
											openTo="year"
											views={['year', 'month', 'day']}
											minDate={minDate}
											maxDate={maxDate}
											allowSameDateSelection={true}
											inputFormat="dd/MM/yyyy"
											value={formik.values.contractEnd}
											onChange={(newValue) => handleDateChange('end', newValue)}
											renderInput={(params) => <TextField {...params} />}
										/>
									</div>
								</LocalizationProvider>
							</div>
						</Flex>
						{
							(formik.touched.contractStart && formik.touched.contractEnd && formik.errors.contractEnd && formik.errors.contractStart && <Error>* contract start and end date are required</Error>) ||
							(formik.touched.contractStart && formik.errors.contractStart && <Error>{formik.touched.contractStart && formik.errors.contractStart}</Error>) ||
							(formik.touched.contractEnd && formik.errors.contractEnd && <Error>{formik.touched.contractEnd && formik.errors.contractEnd}</Error>)
						}



						{
							urlRows.map((urlRow: any, key: any) => (
								<div style={{ display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>
									<div>
										<Label>VRM Correction URL</Label>
										<InputText
											style={{ minWidth: urlRows.length > 1 ? "340px" : "380px", maxWidth: urlRows.length ? "340px" : "380px" }}
											type="text"
											key={key}
											value={urlRows[key]}
											onChange={(e) => { setUrl(e, key) }}
											name="url"

										/>
										{errorUrl[key] === false && (
											<Error>Invalid URl</Error>
										)}
									</div>
									<div style={{ width: urlRows.length > 1 ? '20%' : '10%', display: 'flex', justifyContent: 'space-between', marginTop: '22px' }}>
										<button
											type="button"
											style={cameraIPbuttonStyle}
											onClick={() => addURLRow()}
										> + </button>
										{urlRows.length > 1 &&
											<button
												type="button"
												style={cameraIPbuttonStyle}
												onClick={() => deleteURLRow(key)}
											> - </button>}</div>


								</div>

							))

						}
						<div>
							<Label>Spreadsheet URL</Label>
							<InputText
								id="spreadsheetUrl"
								name="spreadsheetUrl"
								type="text"
								autoComplete="nope"
								onChange={(e: any) => setUrlSpreadsheet(e.target.value)}
								onBlur={() => {
									const pattern = new RegExp(
										/^(https?:\/\/)?((([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{2,})|((\d{1,3}\.){3}\d{1,3}))(\/\S*)?$/
									);
									if (urlSpreadsheet === "" || pattern.test(urlSpreadsheet)) {
										setErrorSpreadsheetURL(false);
									} else {
										setErrorSpreadsheetURL(true);
									}
								}}

								value={urlSpreadsheet}
							/>
						</div>

						{errorSpreadsheetURL && (
							<Error>
								Enter a valid URL
							</Error>
						)}


					</Flex>



				</DialogContent>

				<Flex direction="row" justify="center" wrap="wrap">
					<DialogActions>
						<Button text="Cancel" onClick={() => cancelAdd()} color='secondary' />
						<Button text="Submit" type="submit" loading={formik.isSubmitting} />
					</DialogActions>
				</Flex>
			</Form>
		</Dialog>
	);
};
