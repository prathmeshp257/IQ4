import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from "../../components";
import { AddEmailGroup } from "./AddEmailGroup";
import { EditEmailGroup } from "./EditEmailGroup";
import { DeleteEmailGroup } from "./DeleteEmailGroup";
import { ButtonGroup } from "@material-ui/core";
import ProgressBar from "../Reports/ProgressBar";
import Tooltip from '@mui/material/Tooltip';

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
});

export const EmailGroups: FC = () => {
	const { userData } = useContext(AuthContext);
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [emailGroups, setEmailGroups] = useState([]);
    const [selectedEmailGroup, setSelectedEmailGroup] = useState<any>({})

	const handleToggleAdd = () => {
		setAddOpen(!addOpen);
	};
	const handleCloseEdit = () => {
		setEditOpen(!editOpen);
		setSelectedEmailGroup({});
	};
	const handleCloseDelete = () => {
		setDeleteOpen(!deleteOpen);
		setSelectedEmailGroup({});
	};

	const getActions = (data:any) =>{
		return (
			<ButtonGroup>
				<Button text="Edit" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedEmailGroup(data); setEditOpen(true);}} />
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedEmailGroup(data); setDeleteOpen(true);}} />
			</ButtonGroup>
		)
	}

	const getEmailGroups = async () => {
		setLoading(true)
		try {
			const {data} = await axios.get(`/api/voi/fetchEmailGroups?createdBy=${userData.email}&userType=${userData.userType}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			
			setEmailGroups(data);
		} catch (e) {
			console.log("Error in listing email groups", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false)
	}

	useEffect(() => {
		if(userData && userData.email && userData.userType){
			getEmailGroups()
		}
	}, [userData])
	

	return (
	<React.Fragment>
		<Paper className={classes.root}>
            <div style={{display:'flex', justifyContent:'end'}}>
                <Button 
                    text='+Add Group' 
                    fullWidth={false} 
                    variant='outline'
                    loading={loading}
                    buttonStyle={{ marginBottom:'10px', display:'inline-block' }} 
                    onClick={ () => handleToggleAdd() }
                />
            </div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Group Name</TableCell>
							<TableCell>Email Contacts</TableCell>
							<TableCell>Action</TableCell>
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
							emailGroups && emailGroups.length > 0 && emailGroups.map((eachGroup:any) => {
								return (
									<TableRow>
										<TableCell>{eachGroup.name || "NA"}</TableCell>
										<TableCell><Tooltip title={eachGroup.emails.join(',\n')} arrow placement="top"><p>{eachGroup.emails && eachGroup.emails.length > 0 ? `${eachGroup.emails.length} ${eachGroup.emails.length > 1 ? "emails" :'email'}` : 'NA'}</p></Tooltip></TableCell>
										<TableCell>{getActions(eachGroup)}</TableCell> 
									</TableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
    	<AddEmailGroup addOpen={addOpen} closeDialog={handleToggleAdd} refreshData={getEmailGroups}/>
    	<EditEmailGroup editOpen={editOpen} closeDialog={handleCloseEdit} editData={selectedEmailGroup} refreshData={getEmailGroups}/>
    	<DeleteEmailGroup deleteOpen={deleteOpen} closeDialog={handleCloseDelete} deleteData={selectedEmailGroup} refreshData={getEmailGroups}/>
	</React.Fragment>
	);
};
