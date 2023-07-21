import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { AddScheduledReportSchema } from "../../validationScheemas/ScheduledReportSchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext, AuthContext, SiteContext } from "../../context";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";

interface Props {
  addOpen:any;
  closeDialog:any;
  refreshData:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));

const Form = styled.form`
	width: 100%;
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
	min-width: ${isMobile ? "260px" : "285px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "285px"};
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

export const AddScheduledReport: FC<Props> = ({addOpen, closeDialog, refreshData}) => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const classes = useStyles();
	const userLoginType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [selectedSites, setSelectedSites] = useState<any>([]);
	const [selectedScheduleFrequency, setSelectedScheduleFrequency] = useState<any>([]);
	const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
	const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
	const [scheduledReportingAccessSites, setScheduledReportingAccessSites] = useState<any>([]); 
	const { sites } = useContext(UserContext);
	const scheduledReportingSitesLocal = userData.scheduledReportingAccessSites || undefined;
	const insightAccess = userData.insightAccess;
	const insightAccessSites = userData.insightAccessSites || [];
	const hasAccessToInsights = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites[0]);
	const scheduleFrequency = ['WEEKLY', 'MONTHLY'];

	useEffect(() => {
		if(userLoginType !== "Admin" && scheduledReportingSitesLocal){
			let accessSites = scheduledReportingSitesLocal;
			for(const eachSite of scheduledReportingSitesLocal){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setScheduledReportingAccessSites(accessSites);
		}
		else if(userLoginType === "Admin"){
			setScheduledReportingAccessSites(sites);
		}
		else{
			setScheduledReportingAccessSites([])
		}
		// eslint-disable-next-line
	},[sitesData])

	const handleSubmit = async (values: FormikValues) => {
		try {
			values.user = userData.email;
			values.userType = userData.userType;
			values.emailTemplateHeader = emailTemplateHeader;
			values.emailTemplateFooter = emailTemplateFooter;
			values.insightsData = values.insightsData === 'true' ? true : false;

			await axios.post("/api/scheduledReports", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Report Schedule created successfully.");
			cancelAdd();
			refreshData();

		} catch (e:any) {
			console.log("Error in add report schedule list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
			cancelAdd();
		}
	};

	const cancelAdd = () => {
		formik.resetForm(); 
		setEmailTemplateHeader("");
		setEmailTemplateFooter("");
		setSelectedSites([]);
		setSelectedScheduleFrequency([]);
		closeDialog(); 
	}

	const imageChange = (event:any, type:string) => {
		let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = function () {
			if(type === "emailTemplateHeader"){
				setEmailTemplateHeader(reader.result?.toString().split("base64,").pop())
			}
			else if(type === "emailTemplateFooter"){
				setEmailTemplateFooter(reader.result?.toString().split("base64,").pop())
			}
		};
		reader.onerror = function (error) {
		  console.log('Error: ', error);
		};
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			scheduleFrequency: "",
			sites: [],
			insightsData:"false",
            emailTemplateHeader: "",
            emailTemplateFooter: "",
		},
		validationSchema: AddScheduledReportSchema,
		onSubmit: handleSubmit
	});

	return (
        <Dialog open={addOpen} onClose={ () => cancelAdd()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'md'}>
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
				{`Add Report Schedule`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
					<Label>Email</Label>
					<InputText
						id="email"
						name="email"
						type="email"
						autoComplete="nope"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("email")}
						value={formik.values.email}
					/>
					{formik.touched.email && formik.errors.email && (
						<Error>{formik.touched.email && formik.errors.email}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
                    <Label>Schedule Frequency</Label>
					<MultiSelect
						placeholder='Please select schedule frequency'
						multi={false}
						style={{width:"285px", height:'44px'}}
						options={scheduleFrequency.map((list:string) => ({ value: list, label: list }))}
						values={selectedScheduleFrequency}
						onChange={async(values) => {
							await setSelectedScheduleFrequency(values);
							formik.setFieldValue("scheduleFrequency",values[0])
						}}
					/>
					{formik.touched.scheduleFrequency && formik.errors.scheduleFrequency && (
						<Error>{formik.touched.scheduleFrequency && formik.errors.scheduleFrequency}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
					<Label>Sites</Label>
					<MultiSelect
						multi={true}
						style={{width:`${isMobile ? "260px" : "285px"}`, height:'44px'}}
						options={scheduledReportingAccessSites.map((site:string) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
						values={selectedSites}
						onChange={async(values) => {
							const normalizedSites = Formatter.normalizeSites(values);
							await setSelectedSites(normalizedSites);
							formik.setFieldValue("sites", normalizedSites)
						}}
					/>
					{formik.touched.sites && formik.errors.sites && (
						<Error>{formik.touched.sites && formik.errors.sites}</Error>
					)}
				</div>
				{
					hasAccessToInsights && (userLoginType === 'Admin' || insightAccessSites.includes(selectedSites[0])) ? 
						<React.Fragment>
							<div className="--margin-bottom-large">
								<Label>Insights Data</Label>
								<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group" onChange={formik.handleChange} >
									<label style={{cursor:"pointer"}}>
										<input type="radio" defaultChecked={true} name="insightsData" value="false" id="false" style={{marginRight:"5px"}} />
										FALSE 
									</label>
									<label style={{cursor:"pointer"}}>
										<input style={{marginLeft:"50px", marginRight:"5px"}} type="radio" name="insightsData" value="true" id="true" />
										TRUE 
									</label>
								</div>
							</div>
						</React.Fragment>
					: ""
				}
				<div className="--margin-bottom-large">
					<Label>Email Template Header</Label>
					<InputText 
						type="file" 
						name="emailTemplateHeader" 
						id="emailTemplateHeader" 
						accept="image/*"
						onChange={(e) =>{ 
							imageChange(e, "emailTemplateHeader"); 
							formik.handleChange(e)
						}}
						onBlur={() => formik.setFieldTouched("emailTemplateHeader")}
						value={formik.values.emailTemplateHeader}
					/>
				</div>
				<div className="--margin-bottom-large">
					<Label>Email Template Footer</Label>
					<InputText 
						type="file" 
						name="emailTemplateFooter" 
						id="emailTemplateFooter" 
						accept="image/*"
						onChange={(e) =>{ 
							imageChange(e, "emailTemplateFooter"); 
							formik.handleChange(e)
						}}
						onBlur={() => formik.setFieldTouched("emailTemplateFooter")}
						value={formik.values.emailTemplateFooter}
					/>
				</div>
			</Flex>

            </DialogContent>

            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={ () => cancelAdd() } color='secondary' />
				<Button text="Submit" type="submit" loading={formik.isSubmitting} />
            </DialogActions>
          </Form>
        </Dialog>
	);
};
