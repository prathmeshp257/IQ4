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
import { Button } from "../../components";
import { AddScheduledReport } from "./AddScheduledReport";
import { EditScheduledReport } from "./EditScheduledReport";
import { DeleteScheduledReport } from "./DeleteScheduledReport";
import { ButtonGroup } from "@material-ui/core";
import ProgressBar from "./ProgressBar";

const useStyles = makeStyles({
	root: {
		width: '100%',
		padding: 10,
        borderRadius: '10px'
	},
	container: {
	  	minHeight: 200,
		maxHeight: 400,
	},
});

export const ScheduledReporting: FC = () => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [scheduledReportList, setScheduledReportList] = useState<any>({});
	const [selectedScheduledReport, setSelectedScheduledReport] = useState<any>({});
	const { sites } = useContext(UserContext);
	const scheduledReportingSitesLocal = userData.scheduledReportingAccessSites || undefined;
	const scheduledReportingAccessSites = (userLoginType === "Retailer" || userLoginType === "Operator") && scheduledReportingSitesLocal ? scheduledReportingSitesLocal : userLoginType === "Admin" ? sites : [];

	const getData = async () => {
		setLoading(true);
		try {
			const {data} = await axios.get(`/api/scheduledReports/all?sites=${(Formatter.normalizeSites(scheduledReportingAccessSites)).join(',')}&userType=${userLoginType}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setScheduledReportList(data);
		} catch (e) {
			console.log("Error in listing scheduled reports", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false);
	};

	useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, []);

	const handleToggleAdd = () => {
		setAddOpen(!addOpen);
	};
	const handleCloseEdit = () => {
		setEditOpen(!editOpen);
		setSelectedScheduledReport({});
	};
	const handleCloseDelete = () => {
		setDeleteOpen(!deleteOpen);
		setSelectedScheduledReport({});
	};

	const getActions = (data:any) =>{
		return (
			<ButtonGroup>
				<Button text="Edit" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedScheduledReport(data); setEditOpen(true);}} />
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => { setSelectedScheduledReport(data); setDeleteOpen(true);}} />
			</ButtonGroup>
		)
	}

	return (
	<React.Fragment>
		<Paper className={classes.root}>
			<Button 
				text='+Add Schedule' 
				fullWidth={false} 
				variant='outline'
				loading={loading}
				buttonStyle={{float:'right', marginBottom:'10px'}} 
				onClick={ () => handleToggleAdd() }
			/>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Email</TableCell>
							<TableCell>Schedule Frequency</TableCell>
							<TableCell>Insight Data</TableCell>
							<TableCell>Site</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							loading ? 
								<TableCell colSpan={5}>
										<div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
											<ProgressBar/>
										</div>
								</TableCell>
							: 
							scheduledReportList && scheduledReportList.scheduledReportData && scheduledReportList.scheduledReportData.map((eachSchedule:any) => {
								return (
									<TableRow>
										<TableCell>{eachSchedule.email || "NA"}</TableCell>
										<TableCell>{eachSchedule.scheduleFrequency || "NA"}</TableCell>
										<TableCell>{Formatter.capitalize(String(eachSchedule.insightsData)) || "False"}</TableCell>
										<TableCell>{Formatter.capitalizeSite(eachSchedule.site) || "NA"}</TableCell>
										<TableCell>{getActions(eachSchedule)}</TableCell>
									</TableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
    	<AddScheduledReport addOpen={addOpen} closeDialog={handleToggleAdd} refreshData={getData}/>
    	<EditScheduledReport editOpen={editOpen} closeDialog={handleCloseEdit} editData={selectedScheduledReport} refreshData={getData}/>
    	<DeleteScheduledReport deleteOpen={deleteOpen} closeDialog={handleCloseDelete} deleteData={selectedScheduledReport} refreshData={getData}/>
	</React.Fragment>
	);
};
