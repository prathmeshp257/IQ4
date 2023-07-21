import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { VOISchema } from "../../validationScheemas/VOISchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext, AuthContext, SiteContext } from "../../context";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { TextField } from "@material-ui/core";
import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

interface Props {
  addOpen:any;
  closeDialog:any;
  refreshData:any;
  emailGroups: any;
  voiType?: any;
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

const TextArea = styled.textarea`
	display: flex;
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

export const AddVOI: FC<Props> = ({addOpen, closeDialog, refreshData, emailGroups, voiType}) => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const userLoginType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [selectedSites, setSelectedSites] = useState<any>([]);
	const [selectedListType, setSelectedListType] = useState<any>([]);
	const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
	const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
	const [hasSMSAccess, setSMSAccess] = useState<any>(false);
	const [permitableSMSAccessSites, setPermitableSMSAccessSites] = useState<any>([]);
	const [selectedSMSSites, setSelectedSMSSites] = useState<any>([]);
	const [voiSettingAccessSites, setVoiSettingAccessSites] = useState<any>([]);
	const [selectedEmailGroup, setSelectedEmailGroup] = useState<any>([''])
	const { sites } = useContext(UserContext);
	const voiSettingSites = voiType === 'private' ? userData.voiPrivateAccessSites : userData.voiSettingAccessSites;
	const listTypes = ['VIP', 'BLACKLIST', 'OTHER'];
	const [selectedStartDate, setSelectedStartDate] = useState(new Date());
	const [selectedEndDate, setSelectedEndDate] = useState(new Date());

	useEffect(() => {
		if(userLoginType !== "Admin" && voiSettingSites){
			let accessSites = voiSettingSites;
			for(const eachSite of voiSettingSites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setVoiSettingAccessSites(accessSites);
		}
		else if(userLoginType === "Admin"){
			setVoiSettingAccessSites(sites);
		}
		else{
			setVoiSettingAccessSites([])
		}
		// eslint-disable-next-line
	},[sitesData])
    
	const handleStartDateChange = (date: any) => {
		setSelectedStartDate(date);
	};
	const handleEndDateChange = (date: any) => {
		setSelectedEndDate(date);
	};

	const handleSubmit = async (values: FormikValues) => {
		try {
			values.user = userData.email;
			values.userType = userData.userType;
			values.emailTemplateHeader = emailTemplateHeader;
			values.emailTemplateFooter = emailTemplateFooter;
			values.vrms = values.vrms ? ((values.vrms).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.emailContacts = values.emailContacts ? (((values.emailContacts).replace(/\s/g, "")).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.smsContacts = values.smsContacts ? ((values.smsContacts).replace(/\s/g, "").split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.whatsappContacts = values.whatsappContacts ? ((values.whatsappContacts).replace(/\s/g, "").split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			const unmatchSites = values.sites.filter((val:any)=>!values.smsNotifySites.includes(val));
			values.email_group_id = selectedEmailGroup[0]
			if(voiType === 'private' ? false :values.emailNotify === 'false' && (values.smsNotify === 'false' || (values.smsNotify === 'true' && unmatchSites[0]))) throw new EvalError('Please select at least one notify method for every site.');
			if(values.smsNotify === 'true' && values.smsContacts.length < 1) throw new EvalError('Please insert at least one SMS contact.');
			if(values.emailNotify === 'true' && (values.emailContacts.length < 1 && (!values.email_group_id || values.email_group_id.length < 1))) throw new EvalError('Please insert at least one email contact.');

			values.emailNotify = values.emailNotify === 'true' ? true : false;
			values.smsNotify = values.smsNotify === 'true' ? true : false;
			values.whatsappNotify = values.whatsappNotify === 'true' ? true : false;
			if(voiType === 'private'){
				values.isPrivate = true
				values.sendToSpreadsheet = values.sendToSpreadsheet === 'true' ? true : false;
			    values.noExpiryTime = values.noExpiryTime === 'true' ? true : false;
			    values.startTime = dayjs(selectedStartDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ') 
			    values.expiryTime = dayjs(selectedEndDate).isValid() ? dayjs(selectedEndDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ') : ""
			}else{
				values.isPrivate = false
			}

			await axios.post("/api/voi", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Vehicle of interest list created successfully.");
			cancelAdd();
			refreshData();

		} catch (e:any) {
			console.log("Error in add voi list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
			cancelAdd();
		}
	};
 
	const cancelAdd = () => {
		formik.resetForm(); 
		setEmailTemplateHeader("");
		setEmailTemplateFooter("");
		setSelectedSites([]);
		setSelectedListType([]);
		setSelectedSMSSites([]);
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
			listName: "",
			listType: "",
			sites: [] as any,
			emailNotify:"false",
			smsNotify:"false",
			whatsappNotify:"false",
			vrms: "",
            emailTemplateHeader: "",
            emailTemplateFooter: "",
			emailContacts:"",
			email_group_id: "",
			smsContacts:"",
			whatsappContacts:"",
			sender:"",
			smsNotifySites: [] as any,
			sendToSpreadsheet:"false",
			noExpiryTime:"true",
			startTime: "",
			expiryTime: ""
		},
		validationSchema: VOISchema,
		onSubmit: handleSubmit
	});

	useEffect(() => {
		const localSMSAccess = userData.voiSMSNotifyAccess || undefined;
		const localSMSAccessSites = userData.voiSMSNotifyAccessSites || undefined;
		const hasSMSNotifyAccess = userLoginType === "Admin" ||
			((userLoginType === "Operator" || userLoginType === "Retailer") && localSMSAccess && localSMSAccessSites && localSMSAccessSites[0]);
		const permitableSMSSites = userLoginType === "Admin" && sites && selectedSites ? sites.filter((ele: string) => selectedSites.includes(Formatter.normalizeSite(ele))) : 
			(userLoginType === "Operator" || userLoginType === "Retailer") && localSMSAccessSites && selectedSites ? localSMSAccessSites.filter((ele: string) => selectedSites.includes(ele)) : [];
		setSMSAccess(hasSMSNotifyAccess);
		setPermitableSMSAccessSites(permitableSMSSites);
		// eslint-disable-next-line
	},[selectedSites])

	return (
        <Dialog open={addOpen} onClose={ () => cancelAdd()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'md'}>
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
				{`Add Vehicle Of Interest List`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
					<Label>List name</Label>
					<InputText
						id="listName"
						name="listName"
						type="text"
						autoComplete="nope"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("listName")}
						value={formik.values.listName}
					/>
					{formik.touched.listName && formik.errors.listName && (
						<Error>{formik.touched.listName && formik.errors.listName}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
                    <Label>List Type</Label>
					<MultiSelect
						placeholder='Please select VOI list Type'
						multi={false}
						style={{width:"285px", height:'44px'}}
						options={listTypes.map((list:string) => ({ value: list, label: list }))}
						values={selectedListType}
						onChange={async(values) => {
							await setSelectedListType(values);
							formik.setFieldValue("listType",values[0])
						}}
					/>
					{formik.touched.listType && formik.errors.listType && (
						<Error>{formik.touched.listType && formik.errors.listType}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
					<Label>Sites</Label>
					<MultiSelect
						multi={true}
						style={{width:`${isMobile ? "260px" : "285px"}`, height:'44px'}}
						options={voiSettingAccessSites.map((site:string) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
						values={selectedSites}
						onChange={async(values) => {
							const normalizedSites = Formatter.normalizeSites(values);
							await setSelectedSites(normalizedSites);
							formik.setFieldValue("sites",normalizedSites)
						}}
					/>
					{formik.touched.sites && formik.errors.sites && (
						<Error>{formik.touched.sites && formik.errors.sites}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
					<Label>Email Notification</Label>
					<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group" 
						onChange={(e:any) => {
							if(e.target.value !== 'true'){
								formik.setFieldValue("emailTemplateHeader", "");
								formik.setFieldValue("emailTemplateFooter", "");
								formik.setFieldValue("emailContacts", "");
								setEmailTemplateFooter("");
								setEmailTemplateHeader("");
							}
							formik.handleChange(e);
						}} 
					>
						<label style={{cursor:"pointer"}}>
							<input type="radio" defaultChecked={true} name="emailNotify" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} type="radio" name="emailNotify" value="true" id="true" />
							TRUE 
						</label>
					</div>
				</div>
				<div className="--margin-bottom-large">
					<Label>Email Template Header</Label>
					<InputText 
						type="file" 
						name="emailTemplateHeader" 
						id="emailTemplateHeader" 
						accept="image/*"
						disabled={formik.values.emailNotify === 'false'}
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
						disabled={formik.values.emailNotify === 'false'}
						onChange={(e) =>{ 
							imageChange(e, "emailTemplateFooter"); 
							formik.handleChange(e)
						}}
						onBlur={() => formik.setFieldTouched("emailTemplateFooter")}
						value={formik.values.emailTemplateFooter}
					/>
				</div>
				<div className="--margin-bottom-large">
					<Label>Email Contacts</Label>
					<TextArea
						rows={2}
						id="emailContacts"
						name="emailContacts"
						autoComplete="nope"
						disabled={formik.values.emailNotify === 'false'}
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("emailContacts")}
						value={formik.values.emailContacts}
					/>
					{formik.touched.emailContacts && formik.errors.emailContacts && (
						<Error>{formik.touched.emailContacts && formik.errors.emailContacts}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
					<Label>Email Group</Label>
					<MultiSelect
						multi={false}
						disabled={formik.values.emailNotify === 'false'}
						style={{width:`${isMobile ? "260px" : "285px"}`, height:'44px'}}
						options={emailGroups.map((group:any) => ({ value: group._id, label: group.name }))}
						values={selectedEmailGroup}
						placeholder="Please select email group"
						onChange={async(values) => {
							await setSelectedEmailGroup(values);
							formik.setFieldValue("email_group_id",values[0])
						}}
					/>
					{formik.touched.email_group_id && formik.errors.email_group_id && (
						<Error>{formik.touched.email_group_id && formik.errors.email_group_id}</Error>
					)}
				</div>
				{
					hasSMSAccess && permitableSMSAccessSites && permitableSMSAccessSites[0] ?
						<div className="--margin-bottom-large">
							<Label>SMS Notification</Label>
							<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group" 
								onChange={(e:any) => {
									if(e.target.value !== 'true'){
										formik.setFieldValue("smsContacts", "");
										formik.setFieldValue("sender", "");
									}
									formik.handleChange(e);
								}} 
							>
								<label style={{cursor:"pointer"}}>
									<input type="radio" defaultChecked={true} name="smsNotify" value="false" id="false" style={{marginRight:"5px"}} />
									FALSE 
								</label>
								<label style={{cursor:"pointer"}}>
									<input style={{marginLeft:"50px", marginRight:"5px"}} type="radio" name="smsNotify" value="true" id="true" />
									TRUE 
								</label>
							</div>
						</div>
					:""
				}
				{
					hasSMSAccess && permitableSMSAccessSites && permitableSMSAccessSites[0] ?
						<div className="--margin-bottom-large">
							<Label>SMS Notification Sites</Label>
							<MultiSelect
								multi={true}
								disabled={formik.values.smsNotify !== "true"}
								style={{width:`${isMobile ? "260px" : "285px"}`, height:'44px'}}
								options={permitableSMSAccessSites.map((site:string) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
								values={selectedSMSSites}
								onChange={async(values) => {
									const normalizedSites = Formatter.normalizeSites(values);
									await setSelectedSMSSites(normalizedSites);
									formik.setFieldValue("smsNotifySites",normalizedSites)
								}}
							/>
							{formik.touched.smsNotifySites && formik.errors.smsNotifySites && (
								<Error>{formik.touched.smsNotifySites && formik.errors.smsNotifySites}</Error>
							)}
						</div>
					:""
				}
				{
					hasSMSAccess && permitableSMSAccessSites && permitableSMSAccessSites[0] ?
						<React.Fragment>
							<div className="--margin-bottom-large">
								<Label>SMS Contacts</Label>
								<TextArea
									rows={2}
									id="smsContacts"
									name="smsContacts"
									disabled={formik.values.smsNotify !== 'true' || !selectedSMSSites || !selectedSMSSites[0]}
									autoComplete="nope"
									onChange={(e:any) => {
										const re = /^[0-9,+\b]+$/;					
										if (e.target.value === '' || re.test(e.target.value)) {
											formik.handleChange(e);
										}
										else{
											formik.setFieldError('smsContacts', 'Only numbers and comma are acceptable')
										}
									}}
									onBlur={() => formik.setFieldTouched("smsContacts")}
									value={formik.values.smsContacts}
								/>
								{formik.touched.smsContacts && formik.errors.smsContacts && (
									<Error>{formik.touched.smsContacts && formik.errors.smsContacts}</Error>
								)}
							</div>
							<div className="--margin-bottom-large">
								<Label>Sender Name</Label>
								<InputText
									id="sender"
									name="sender"
									type="text"
									disabled={formik.values.smsNotify !== 'true' || !selectedSMSSites || !selectedSMSSites[0]}
									autoComplete="nope"
									onChange={formik.handleChange}
									onBlur={() => formik.setFieldTouched("sender")}
									value={formik.values.sender}
									maxLength={11}
								/>
								{formik.touched.sender && formik.errors.sender && (
									<Error>{formik.touched.sender && formik.errors.sender}</Error>
								)}
							</div>
						</React.Fragment>
					:""
				}
				<div className="--margin-bottom-large" style={{display:'none'}}>
					<Label>Whatsapp Notification</Label>
					<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group"
						onChange={(e:any) => {
							if(e.target.value !== 'true'){
								formik.setFieldValue("whatsappContacts", "");
							}
							formik.handleChange(e);
						}} 
					>
						<label style={{cursor:"pointer"}}>
							<input type="radio" defaultChecked={true} name="whatsappNotify" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} type="radio" name="whatsappNotify" value="true" id="true" />
							TRUE 
						</label>
					</div>
				</div>
				<div className="--margin-bottom-large" style={{display:'none'}}>
					<Label>Whatsapp Contacts</Label>
					<TextArea
						rows={2}
						id="whatsappContacts"
						name="whatsappContacts"
						autoComplete="nope"
						disabled={formik.values.whatsappNotify === 'false'}
						onChange={(e:any) => {
							const re = /^[0-9,+\b]+$/;					
							if (e.target.value === '' || re.test(e.target.value)) {
								formik.handleChange(e);
							}
							else{
								formik.setFieldError('whatsappContacts', 'Only numbers and comma are acceptable')
							}
						}}
						onBlur={() => formik.setFieldTouched("whatsappContacts")}
						value={formik.values.whatsappContacts}
					/>
					{formik.touched.whatsappContacts && formik.errors.whatsappContacts && (
						<Error>{formik.touched.whatsappContacts && formik.errors.whatsappContacts}</Error>
					)}
				</div>
				{ voiType == 'private' ?
				<>
				<div className="--margin-bottom-large">
					<Label>Send To Spreadsheet</Label>
					<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group" 
						onChange={(e:any) => {
							formik.handleChange(e);
						}} 
					>
						<label style={{cursor:"pointer"}}>
							<input type="radio" defaultChecked={formik.values.sendToSpreadsheet !== 'true'} name="sendToSpreadsheet" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} defaultChecked={formik.values.sendToSpreadsheet === 'true'} type="radio" name="sendToSpreadsheet" value="true" id="true" />
							TRUE 
						</label>
					</div>
				</div>			
				<div className="--margin-bottom-large" >
				    <LocalizationProvider dateAdapter={AdapterDateFns}>

					<DateTimePicker
                      label="Select start date and time"
                      value={selectedStartDate}
					  disabled={formik.values.sendToSpreadsheet === 'false'}
                      onChange={(date:any)=>setSelectedStartDate(date)}
                      minDateTime={new Date()}
                      renderInput={(params:any) =>( < TextField {...params} />)}
                     />
				    </LocalizationProvider>
				</div>
				<div className="--margin-bottom-large">
				    <LocalizationProvider dateAdapter={AdapterDateFns}>

					<DateTimePicker
                      label="Select expiry date and time"
                      value={selectedEndDate}
					  disabled={formik.values.sendToSpreadsheet === 'false' || formik.values.noExpiryTime === 'true'}
                      onChange={(date:any)=>setSelectedEndDate(date)}
                      minDateTime={new Date(selectedStartDate)}
                      renderInput={(params:any) =>( < TextField {...params} />)}
                     />
				    </LocalizationProvider>
				</div>
				<div className="--margin-bottom-large">
					<Label>No Expiry Date</Label>
					<div style={{marginLeft:"0", minWidth: isMobile ? "260px" : "285px", marginTop:"15px"}} role="group" 
						onChange={(e:any) => {
							formik.handleChange(e);
						}} 
					>
						<label style={{cursor:"pointer"}}>
							<input type="radio" defaultChecked={formik.values.noExpiryTime !== 'true'} name="noExpiryTime" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} defaultChecked={formik.values.noExpiryTime === 'true'} type="radio" name="noExpiryTime" value="true" id="true" />
							TRUE 
						</label>
					</div>
				</div></>:<></>
                }			
				<div className="--margin-bottom-large" style={{width:'100%'}}>
					<Label>VRM List</Label>
					<TextArea
						rows={3}
						id="vrms"
						name="vrms"
						style={{display:'block',width:'100%', minWidth:'none', maxWidth:'none'}}
						autoComplete="nope"
						onChange={(e:any) => {
							const re = /^[0-9A-Z,\b]+$/;					
							if (e.target.value === '' || re.test(e.target.value)) {
								formik.handleChange(e);
							}
							else{
								formik.setFieldError('vrms', 'Only numbers, capital letters and comma are acceptable')
							}
						}}
						onBlur={() => formik.setFieldTouched("vrms")}
						value={formik.values.vrms}
					/>
					{formik.touched.vrms && formik.errors.vrms && (
						<Error>{formik.touched.vrms && formik.errors.vrms}</Error>
					)}
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
