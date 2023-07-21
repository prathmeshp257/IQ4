import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import { Button, Flex } from "../../components";
import { UserContext, AuthContext } from "../../context";
import { useSnackbar } from "notistack";
import { DataTable } from "../../components";
import { ButtonGroup } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formatter } from "../../utils";
import { AddNotification } from "./VRMAddNotification";
import { EditNotification } from "./VRMEditNotification"
// import { AddCameraNotification } from "./AddCameraNotification";
// import { EditCameraNotification } from "./EditCameraNotification";

interface DeleteProps {
  deleteOpen:any;
  closeDialog:any;
  deleteData:any;
  refreshData:any;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 200,
        maxHeight: 400,
        overFlowY: 'scroll'
    },
    dialogPaper: {
        maxHeight: '75vh',
    },
});

export const VRMCorrectionReport: FC = () => {
	const { userData } = useContext(AuthContext);
    const classes = useStyles();
	const userType = userData.userType;
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<any>({});
    const [reportsData, setReportsData] = useState<any>([]);
    const [formattedData, setFormattedData] = useState<any>([]);
    

    const getReportsData = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get(`/api/vrmCorrection/allReportListing?userType=${userType}&createdBy=${email}`, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setReportsData(data);
            
        } catch (e) {
            console.log('error-iqstats-reports-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };
    
    const handleChangePage = async(newPage:number) => {
        setPage(newPage);
    };

    useEffect(() => {
        const getData = async() =>{
            setPage(0);
            getReportsData();
        }
        getData()
        // eslint-disable-next-line
    }, []);

	const getActions = (data:any) =>{
		return (
			<ButtonGroup>
                <Button text="Edit" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedReport(data); setEditOpen(true)}} />
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedReport(data); setDeleteOpen(true)}} />
			</ButtonGroup>
		)
	}

    const closeDialog = () =>{
        setAddOpen(false);
    }

    const closeEditDialog = () =>{
        setSelectedReport({});
        setEditOpen(false);
    }

    const closeDeleteDialog = () =>{
        setSelectedReport({});
        setDeleteOpen(false);
    }

    const refreshData = () =>{
        setSelectedReport({});
        setPage(0);
        getReportsData();
    }

    useEffect(() => {
        if(reportsData && reportsData[0]){
            let dataArr = [];
            for(const eachData of reportsData){
                let site = []
                if (eachData.sites.length > 0){
                    for( let eachSite of eachData.sites ){
                        site.push(Formatter.capitalizeSite(eachSite))
                        
                    }
                }
                dataArr.push({
                    Sites: site.join(',\n'),
                    "Type":eachData.type ? eachData.type : "NA",
                    "Email Contacts": eachData.emailContacts.join(',\n'),
                    "Receiver Name": eachData.receiver,
                    "Generate Data For Number Of Days": eachData.dataForDays ? eachData.dataForDays : "NA" ,
                    Actions: getActions(eachData)
                })
            }
            setFormattedData(dataArr);
        }else{
            setFormattedData([]);
        }
    },[reportsData])
    const addNotification = ()=>{
        setAddOpen(true);
    }
  

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end' , marginBottom:'15px'}}>
                    <Button text="+ Add Notification" variant={"filled"} onClick={()=>addNotification()}  buttonStyle={{backgroundColor:'#141414',marginRight: '10px' }}></Button>
                </div>
                <DataTable 
                    columns={["Sites","Type", "Email Contacts", "Receiver Name", "Generate Data For Number Of Days","Actions"]} 
                    data={formattedData || []} 
                    loading={loading} 
                    pagination={true} 
                    count={formattedData.length} 
                    handleChangePage={async(page:any) => await handleChangePage(page)} 
                    page={page} 
                    rowsPerPage={formattedData.length} 
                />
            </Paper>
            <EditNotification editOpen={editOpen} closeDialog={closeEditDialog} refreshData={refreshData} editData={selectedReport} />
            <DeleteNotification deleteOpen={deleteOpen} closeDialog={closeDeleteDialog} refreshData={refreshData} deleteData={selectedReport} />
            <AddNotification addOpen={addOpen} closeDialog={closeDialog} refreshData={refreshData} />

        </React.Fragment>
    );
}



export const DeleteNotification: FC<DeleteProps> = ({deleteOpen, closeDialog, deleteData, refreshData}) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event:any) => {
        event.preventDefault();
		setLoading(true)
		try {
			await axios.delete(`/api/vrmcorrection/?id=${deleteData._id}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			enqueueSnackbar("Notification alert deleted successfully.");
			setLoading(false);
			refreshData();

		} catch (e:any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
			setLoading(false)
		}
		cancelDelete();
	};

	const cancelDelete = () => {
		closeDialog(); 
	}

	return (
        <Dialog open={deleteOpen} onClose={ () => cancelDelete()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'sm'}>
		  <form onSubmit={(e) => handleSubmit(e)}>
            <DialogTitle>
				{`Delete Notification`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    {`Are you sure you want to delete this notification ?`}
				</div>
			</Flex>
            </DialogContent>
            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={ () => cancelDelete() } color='secondary' />
				<Button text="Delete" type="submit" loading={loading} />
            </DialogActions>
          </form>
        </Dialog>
	);
};

