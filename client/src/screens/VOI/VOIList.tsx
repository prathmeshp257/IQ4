import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { UserContext, AuthContext } from "../../context";
import { Formatter } from "../../utils";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, MultiSelect } from "../../components";
import { AddVOI } from "./AddVOI";
import { EditVOI } from "./EditVOIList";
import { DeleteVOI } from "./DeleteVOIList";
import { AddOrRemoveVehicle } from "./AddOrRemoveVehicle";
import { ButtonGroup } from "@material-ui/core";
import ProgressBar from "../Reports/ProgressBar";
import dayjs from 'dayjs';
import { isMobile } from "react-device-detect";
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Label } from "@material-ui/icons";


const useStyles = makeStyles({
	root: {
		width: '100%',
		padding: 0,
		boxShadow: 'none'
	},
	container: {
	  	minHeight: 200,
		maxHeight: 400,
	},
	dialogPaper: {
		maxHeight: "75vh",
	  },
});

export const VOIList: FC = () => {
	const { userData } = useContext(AuthContext);
	const classes = useStyles();
	const userLoginType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [addVOIOpen, setAddVOIOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [archiveOpen, setArchiveOpen] = useState(false);
	

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addRemoveVehicleOpen, setAddRemoveVehicleOpen] = useState(false);
	const [voiLists, setVOILists] = useState<any>({});
	const [selectedVOIList, setSelectedVOIList] = useState<any>({});
	const [singleArchiveData, setSingleArchiveData] = useState<any>({});

	const [selectedSortType1, setSelectedSortType1] = useState<any>([])
	const [selectedSortType2, setSelectedSortType2] = useState<any>([])
	const [emailGroups, setEmailGroups] = useState<any>([]);
	const { sites } = useContext(UserContext);
	const voiSettingSites = userData.voiSettingAccessSites || undefined;
	const voiViewOnlyAccessSites = userData.voiViewOnlyAccessSites?.filter((val: any) => val !== "" && val !== undefined && val !== null) || [];
	const voiSettingAccessSites = (userLoginType === "Retailer" || userLoginType === "Operator") && voiSettingSites ? voiSettingSites.filter((val: any) => val !== "" && val !== undefined && val !== null) : userLoginType === "Admin" ? sites : [];
	const allVoiSites = (voiViewOnlyAccessSites.concat(voiSettingAccessSites)).filter((val: any) => val !== "" && val !== undefined && val !== null);
	const uniqVoiSites = allVoiSites.filter((val: any, pos: any) => allVoiSites.indexOf(val) === pos);

	const getData = async () => {
		setLoading(true);
		try {
			const {data} = await axios.post(`/api/voi/all`,{sites:(Formatter.normalizeSites(uniqVoiSites)).join(','),userType:userLoginType,email:userData.email}, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			
			const unarchivedData=data.listData.filter((val:any)=>{
				if(val.status=="unarchived"||!val.status){
					return val
				}
			})
			data.listData=unarchivedData
			
			setVOILists(data);
		} catch (e) {
			console.log("Error in listing voi", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false);
	};

	

	useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, []);

	const handleToggleAdd = () => {
		setAddVOIOpen(!addVOIOpen);
	};
	const handleCloseEdit = () => {
		setEditOpen(!editOpen);
		setSelectedVOIList({});
	};
	const handleCloseDelete = () => {
		setDeleteOpen(!deleteOpen);
		setSelectedVOIList({});
	};
	const toggleAddRemoveVehicles = () => {
		setAddRemoveVehicleOpen(!addRemoveVehicleOpen);
	}
    
	
	const archiveData = async (data1:any,type:any) => {
		try {
			
			const {data} = await axios.post(`/api/voi/archiveNotification`,{type,notificationId:data1._id}, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			
			setArchiveOpen(false)
			getData()
			
		} catch (e) {
			console.log("Error in listing voi", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		
	};


	const archiveConfirmation=async(data:any)=>{
		setSingleArchiveData(data)
		setArchiveOpen(true)
	}
	
	
	

	const getActions = (data:any) =>{
		return (
			<ButtonGroup>
				<Button text="Edit" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedVOIList(data); setEditOpen(true);}} />
                <Button text="Archive" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {archiveConfirmation(data)}} />
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}}  onClick={() => { setSelectedVOIList(data); setDeleteOpen(true);}} />
			</ButtonGroup>
		)
	}

	

	useEffect(()=>{
		let voiList = {} as any;
		setLoading(true)
		
		if(voiLists && voiLists.listData && voiLists.listData[0] && voiLists.listData.length > 0){
        let sortedList  = voiLists.listData.sort((a:any,b:any)=>{
			if(selectedSortType1[0] === "Added On" && selectedSortType2[0] === 'Newest to oldest'){
				return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
			}else if(selectedSortType1[0] === "Added On" && selectedSortType2[0] === 'Oldest to newest'){
				return Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
			}else if(selectedSortType1[0] === "Modified On" && selectedSortType2[0] === 'Newest to oldest'){
				return Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))
			}else if(selectedSortType1[0] === "Modified On" && selectedSortType2[0] === 'Oldest to newest'){
				
				return Number(new Date(a.updatedAt)) - Number(new Date(b.updatedAt))
			}
		})

		

		voiList.listData = sortedList;
		setVOILists(voiList);
		setLoading(false)
	}
	},[selectedSortType2,selectedSortType1])

	const getEmailGroups = async () => {
		try {
			const {data} = await axios.get(`/api/voi/fetchEmailGroups?createdBy=${userData.email}&userType=${userData.userType}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			const groups = [{_id: '', name: 'Please select email group'} , ...data]
			setEmailGroups(groups);
		} catch (e) {
			console.log("Error in listing email groups", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
	}

	useEffect(() => {
		if(userData && userData.email && userData.userType){
			getEmailGroups()
		}
	}, [userData])
	

	return (

	<React.Fragment>
		{archiveOpen && <Dialog
			open={archiveOpen}
			fullWidth={true}
			classes={{ paper: classes.dialogPaper }}
			maxWidth={"sm"}
		  >
		    <DialogTitle>{`Archive Vehicle Of Interest`}</DialogTitle>
			<DialogContent>
			    <div className="--margin-bottom-large">
                    {`Are you sure you want to archive this VOI list "${singleArchiveData.listName}" of site "${singleArchiveData.site}"`}
				</div>
				</DialogContent>
			
				<DialogActions>
		        <Button 
				        color="secondary"
					    text='Yes' 
						fullWidth={false} 
						variant='outline'
						loading={loading}
						buttonStyle={{ marginBottom:'10px', display:'inline-block', marginLeft:'300px' }} 
						onClick={ () => archiveData(singleArchiveData,"archived") }
						/>
                <Button 
						text='No' 
						fullWidth={false} 
						variant='outline'
						loading={loading}
						buttonStyle={{ marginBottom:'10px', display:'inline-block', marginLeft:'10px'}} 
						onClick={ () => setArchiveOpen(false) }
						/>
			</DialogActions>
		  </Dialog>}
		<Paper className={classes.root}>
			{
				userLoginType === 'Admin' || (voiSettingAccessSites && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0]) ?
					<div style={{display:'flex', justifyContent:'end'}}>
						<MultiSelect
							fullWidth={!!isMobile}
							multi={false}
							placeholder="Sort By"
							className="insights__refine-menu__multi-select"
							options={["Added On", "Modified On"].map((site: any) => ({ value: site, label: site}))}
							values={selectedSortType1}
							style={{ marginRight:'10px', display:'inline-block' }}
							onChange={(values) => {
								setSelectedSortType1(values);
							
							}}
						/>
						<MultiSelect
							fullWidth={!!isMobile}
							disabled={selectedSortType1.length===0}
							multi={false}
							placeholder="Sort By"
							className="insights__refine-menu__multi-select"
							options={["Newest to oldest", "Oldest to newest"].map((site: any) => ({ value: site, label: site}))}
							values={selectedSortType2}
							style={{ marginRight:'10px', display:'inline-block' }}
							onChange={(values) => {
								setSelectedSortType2(values);
							}}
						/>
						
						<Button 
							text='+Add List' 
							fullWidth={false} 
							variant='outline'
							loading={loading}
							buttonStyle={{ marginBottom:'10px', display:'inline-block' }} 
							onClick={ () => handleToggleAdd() }
						/>
						<Button 
							text='Add/Remove Vehicles' 
							fullWidth={false} 
							variant='outline'
							loading={loading}
							buttonStyle={{ margin:'0 0 10px 10px', display:'inline-block', padding:'0 10px' }} 
							onClick={ () => toggleAddRemoveVehicles() }
						/>
					</div>
				: ""
			}
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Site</TableCell>
							<TableCell>List Name</TableCell>
							<TableCell>List Type</TableCell>
							<TableCell>Added On</TableCell>
							<TableCell>Modified On</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>SMS</TableCell>
							<TableCell>Email Contacts</TableCell>
							<TableCell>SMS Contacts</TableCell>
							<TableCell>Sender</TableCell>
							<TableCell>VRM's</TableCell>
							{
								userLoginType === 'Admin' || (allVoiSites && allVoiSites.length > 0 && allVoiSites[0] && voiSettingAccessSites && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0]) ? <TableCell>Action</TableCell> : ""
							}
						</TableRow>
					</TableHead>
					<TableBody>
						{
							loading ? 
								<TableCell colSpan={10}>
										<div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
										<ProgressBar/>
										</div>
								</TableCell>
							: 
							voiLists && voiLists.listData && voiLists.listData.map((eachList:any) => {
								let emailGroupData = [] as any;
								let emailGroupCount = 0;
								emailGroups.map((val:any) => {
									if (val._id == eachList.email_group_id){
										emailGroupCount = val.emails ? val.emails.length : 0;
										emailGroupData = val.emails && val.emails.length > 0 ? val.emails : []
									}
								})
								
								
								return (
									<TableRow>
										<TableCell>{Formatter.capitalizeSite(eachList.site) || "NA"}</TableCell>
										<TableCell>{eachList.listName || "NA"}</TableCell>
										<TableCell>{eachList.listType || "NA"}</TableCell>
										<TableCell>{dayjs(eachList.createdAt).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
										<TableCell>{dayjs(eachList.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
										<TableCell>{Formatter.capitalize(String(eachList.emailNotify)) || "False"}</TableCell>
										<TableCell>{Formatter.capitalize(String(eachList.smsNotify)) || "False"}</TableCell>
										<TableCell>
											<Tooltip title={eachList.emailContacts.length > 0 && emailGroupData.length > 0 ? [...eachList.emailContacts,...emailGroupData].join(',\n') : eachList.emailContacts.length > 0 ? eachList.emailContacts.join(',\n') : emailGroupData.length > 0 ? emailGroupData.join(',\n') : 'NA'} arrow placement="top">
											<p>{eachList.emailNotify && eachList.emailContacts && eachList.emailContacts.length > 0 && emailGroupCount > 0 ? `${eachList.emailContacts.length + emailGroupCount} emails` :
											eachList.emailNotify && eachList.emailContacts && eachList.emailContacts.length > 0 ? `${eachList.emailContacts.length} ${eachList.emailContacts.length > 1 ? "emails" :'email'}` : eachList.emailNotify && emailGroupCount > 0 ? `${emailGroupCount} ${emailGroupCount > 1 ? "emails" : "email"}` : "NA"}</p>
											</Tooltip>
										</TableCell>
										<TableCell>{eachList.smsNotify && eachList.smsContacts && (eachList.smsContacts).length > 0 ? (eachList.smsContacts).join(',\n') : 'NA'}</TableCell>
										<TableCell>{eachList.sender || "NA"}</TableCell>
										<TableCell>{eachList.vrms && (eachList.vrms).length > 0 ? (eachList.vrms).join(',\n') : 'NA'}</TableCell>
										{
											userLoginType === 'Admin' || (allVoiSites && allVoiSites.length > 0 && allVoiSites[0] && voiSettingAccessSites && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0]) ? 
												<TableCell>{ (userLoginType === 'Admin' || (voiSettingAccessSites && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0] && voiSettingAccessSites.includes(eachList.site))) ? getActions(eachList) : "NA" }</TableCell> 
											: ""
										}
									</TableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
    	<AddVOI addOpen={addVOIOpen} closeDialog={handleToggleAdd} refreshData={getData} emailGroups={emailGroups}/>
    	<EditVOI editOpen={editOpen} closeDialog={handleCloseEdit} editData={selectedVOIList} refreshData={getData} emailGroups={emailGroups}/>
    	<DeleteVOI deleteOpen={deleteOpen} closeDialog={handleCloseDelete} deleteData={selectedVOIList} refreshData={getData}/>
    	<AddOrRemoveVehicle addRemoveVehicleOpen={addRemoveVehicleOpen} closeDialog={toggleAddRemoveVehicles} listData={voiLists.listData} refreshData={getData}/>
	</React.Fragment>
	);
};
