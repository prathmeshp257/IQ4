import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useState, useEffect } from "react";
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
import { UserContext, AuthContext } from "../../context";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@material-ui/core";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { date } from "yup";
import dayjs from "dayjs";

interface Props {
  editOpen:any;
  closeDialog:any;
  editData:any;
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

export const EditVOI: FC<Props> = ({editOpen, closeDialog, editData, refreshData, emailGroups, voiType}) => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [selectedSites, setSelectedSites] = useState<any>([]);
	const [selectedListType, setSelectedListType] = useState<any>([]);
	const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
	const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
	const [selectedEmailGroup, setSelectedEmailGroup] = useState<any>([''])
	const { sites } = useContext(UserContext);
	const voiSettingSites = voiType === 'private' ? userData.voiPrivateAccessSites : userData.voiSettingAccessSites;
	const voiSettingAccessSites = (userLoginType === "Retailer" || userLoginType === "Operator") && voiSettingSites ? voiSettingSites : userLoginType === "Admin" ? sites : [];
	const listTypes = ['VIP', 'BLACKLIST', 'OTHER'];
	const editListSites = editData.site ? (editData.site).split(',') : [];
	const editListType = editData.listType ? (editData.listType).split(',') : [];
	const localSMSAccess = userData.voiSMSNotifyAccess || undefined;
	const localSMSAccessSites = userData.voiSMSNotifyAccessSites || undefined;
	const [selectedStartDate, setSelectedStartDate] = useState('');
	const [selectedEndDate, setSelectedEndDate] = useState('');
console.log(editData)
	
	
	const handleSubmit = async (values: FormikValues) => {
		try {
			values.emailTemplateHeader = emailTemplateHeader;
			values.emailTemplateFooter = emailTemplateFooter;
			values.vrms = values.vrms ? ((values.vrms).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.emailContacts = values.emailContacts ? (((values.emailContacts).replace(/\s/g, "")).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.smsContacts = values.smsContacts ? ((values.smsContacts).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.whatsappContacts = values.whatsappContacts ? ((values.whatsappContacts).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];

			if(voiType === 'private' ? false : values.emailNotify === 'false' && values.smsNotify === 'false') throw new EvalError('Please select at least one notify method.');
			if(values.emailNotify === 'true' && (values.emailContacts.length < 1 && (!values.email_group_id || values.email_group_id.length < 1))) throw new EvalError('Please insert at least one email contact.');
			if(values.smsNotify === 'true' && values.smsContacts.length < 1) throw new EvalError('Please insert at least one SMS contact.');

			values.emailNotify = values.emailNotify === 'true' ? true : false;
			values.smsNotify = values.smsNotify === 'true' ? true : false;
			values.whatsappNotify = values.whatsappNotify === 'true' ? true : false;
			values._id = editData._id || "";
			values.site = values.sites[0] || "";
			values.email_group_id = selectedEmailGroup[0]
			if(voiType === 'private'){
				values.isPrivate = true;
				values.sendToSpreadsheet = values.sendToSpreadsheet === 'true' ? true : false;
				values.noExpiryTime = values.noExpiryTime === 'true' ? true : false;
				values.startTime = dayjs(selectedStartDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ') 
				values.expiryTime = dayjs(selectedEndDate).isValid() ? dayjs(selectedEndDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ') : ""
			}
			
			
			await axios.put("/api/voi", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Vehicle of interest list updated successfully.");
			cancelEdit();
			refreshData();

		} catch (e:any) {
			console.log("Error in edit voi list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
			cancelEdit();
		}
	};

	const cancelEdit = () => {
		formik.resetForm(); 
		setEmailTemplateHeader("");
		setEmailTemplateFooter("");
		setSelectedSites([]);
		setSelectedListType([]);
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

	const handleStartDateChange = (date: any) => {
		setSelectedStartDate(date);
	  };
	  const handleEndDateChange = (date: any) => {
		setSelectedEndDate(date);
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
			sendToSpreadsheet:"false",
			noExpiryTime:"true",
			
		},
		validationSchema: VOISchema,
		onSubmit: handleSubmit
	});

	useEffect(() => {
		formik.setValues({
			listName: editData.listName ? editData.listName : "",
			listType: editData.listType ? editData.listType : "",
			sites: editListSites ? editListSites : [],
			emailNotify: editData.emailNotify ? String(editData.emailNotify) : "false",
			smsNotify: editData.smsNotify ? String(editData.smsNotify) : "false",
			whatsappNotify: editData.whatsappNotify ? String(editData.whatsappNotify) : "false",
			vrms: editData.vrms && (editData.vrms).length > 0 ? (editData.vrms).join(",") : "",
            emailTemplateHeader: "",
            emailTemplateFooter: "",
			emailContacts: editData.emailNotify && editData.emailContacts && (editData.emailContacts).length > 0 ? (editData.emailContacts).join(",") : "",
			email_group_id: editData.emailNotify && editData.email_group_id ? editData.email_group_id : "",
			smsContacts: editData.smsNotify && editData.smsContacts && (editData.smsContacts).length > 0 ? (editData.smsContacts).join(",") : "",
			whatsappContacts: editData.whatsappNotify && editData.whatsappContacts && (editData.whatsappContacts).length > 0 ? (editData.whatsappContacts).join(",") : "",
			sender: editData.smsNotify && editData.sender ? editData.sender : "",
			sendToSpreadsheet: editData.sendToSpreadsheet ? String(editData.sendToSpreadsheet) : "false",
			noExpiryTime: editData.noExpiryTime ? String(editData.noExpiryTime) : "false",
			
        });
		setSelectedStartDate(editData.startTime)
		setSelectedEndDate(editData.expiryTime)
		if(editData.emailNotify && editData.email_group_id){
			setSelectedEmailGroup([editData.email_group_id])
		}
		// eslint-disable-next-line
	},[editData]);

	useEffect(() => {
		const setInitialSites = () => {
			setSelectedSites(editListSites);
			setSelectedListType(editListType);
		}
		setInitialSites();
		// eslint-disable-next-line
	}, [editData]);
	

	return (
        <Dialog open={editOpen} onClose={ () => cancelEdit()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'md'}>
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
				{`Edit Vehicle Of Interest List`}
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
						disabled={true}
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
						disabled={true}
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
							<input type="radio" defaultChecked={formik.values.emailNotify !== 'true'} name="emailNotify" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} defaultChecked={formik.values.emailNotify === 'true'} type="radio" name="emailNotify" value="true" id="true" />
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
					userLoginType === "Admin" || (localSMSAccess && localSMSAccessSites && localSMSAccessSites.includes(selectedSites[0])) ?
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
									<input type="radio" defaultChecked={formik.values.smsNotify !== 'true'} name="smsNotify" value="false" id="false" style={{marginRight:"5px"}} />
									FALSE 
								</label>
								<label style={{cursor:"pointer"}}>
									<input style={{marginLeft:"50px", marginRight:"5px"}} defaultChecked={formik.values.smsNotify === 'true'} type="radio" name="smsNotify" value="true" id="true" />
									TRUE 
								</label>
							</div>
						</div>
					:""
				}
				{
					userLoginType === "Admin" || (localSMSAccess && localSMSAccessSites && localSMSAccessSites.includes(selectedSites[0])) ?
						<React.Fragment>
							<div className="--margin-bottom-large">
								<Label>SMS Contacts</Label>
								<TextArea
									rows={2}
									id="smsContacts"
									name="smsContacts"
									disabled={formik.values.smsNotify === 'false'}
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
									disabled={formik.values.smsNotify === 'false'}
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
							<input type="radio" defaultChecked={formik.values.whatsappNotify !== 'true'} name="whatsappNotify" value="false" id="false" style={{marginRight:"5px"}} />
							FALSE 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} defaultChecked={formik.values.whatsappNotify === 'true'} type="radio" name="whatsappNotify" value="true" id="true" />
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
				{ editData.isPrivate == true ?
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
                      onChange={(date:any)=>handleStartDateChange(date)}
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
                      onChange={handleEndDateChange}
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
				</div>			
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
				</div></>:<></>}
				
			</Flex>

            </DialogContent>

            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={ () => cancelEdit() } color='secondary' />
				<Button text="Submit" type="submit" loading={formik.isSubmitting} />
            </DialogActions>
          </Form>
        </Dialog>
	);
};
