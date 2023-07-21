import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import { Button, Flex } from "../../components";
import { UserContext, AuthContext } from "../../context";
import { useSnackbar } from "notistack";
import { DataTable } from "../../components";
import { ButtonGroup } from "@material-ui/core";
import { AddNotification } from "./AddNotification";
import { EditNotification } from "./EditNotification";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formatter } from "../../utils";
import { EditAllNotification } from "./EditAllNotification";

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

export const NotificationSettings: FC = () => {
	const { userData } = useContext(AuthContext);
    const classes = useStyles();
	const userType = userData.userType;
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [editAllOpen, setEditAllOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<any>({});
    const [notificationData, setNotificationData] = useState<any>([]);
    const [formattedData, setFormattedData] = useState<any>([]);
    const [addNotficationTab,setAddNotificationTab] =  useState(false);
    const [editAllNotificationTab,setEditAllNotificationTab] =  useState(false);

    const getNotificationData = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get(`/api/iqStats/notifications?userType=${userType}&createdBy=${email}`, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setNotificationData(data);
        } catch (e) {
            console.log('error-iqstats-notificatio-data', e)
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
            getNotificationData();
        }
        getData()
        // eslint-disable-next-line
    }, []);

	const getActions = (data:any) =>{
		return (
			<ButtonGroup>
                <Button text="Edit" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedNotification(data); setEditOpen(true)}} />
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedNotification(data); setDeleteOpen(true)}} />
			</ButtonGroup>
		)
	}

    const closeDialog = () =>{
        setAddOpen(false);
    }
    const closeEditAllDialog = () =>{
        setEditAllOpen(false);
    }

    const closeEditDialog = () =>{
        setSelectedNotification({});
        setEditOpen(false);
    }

    const closeDeleteDialog = () =>{
        setSelectedNotification({});
        setDeleteOpen(false);
    }

    const refreshData = () =>{
        setSelectedNotification({});
        setPage(0);
        getNotificationData();
    }

    useEffect(() => {
        if(notificationData && notificationData[0]){
            let dataArr = [];
            for(const eachData of notificationData){
                dataArr.push({
                    Site: Formatter.capitalizeSite(eachData.site),
                    "Notification Type": eachData.type,
                    "Email Contacts": eachData.emailContacts.join(',\n'),
                    "Receiver Name": eachData.receiver,
                    Actions: getActions(eachData)
                })
            }
            setFormattedData(dataArr);
        }else{
            setFormattedData([]);
        }
    },[notificationData])
    const addNotification = ()=>{
        setAddOpen(true);
        setAddNotificationTab(true);
        setEditAllNotificationTab(false);
    }
    const editAllNotification = ()=>{
        setEditAllOpen(true);
        setEditAllNotificationTab(true);
        setAddNotificationTab(false);
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end' , marginBottom:'15px'}}>
                    <Button text="+ Add Notification" variant={addNotficationTab?"filled":"outline"} onClick={addNotification}  buttonStyle={{ marginRight: '10px' }}></Button>
                    <Button text="Edit Notification" variant={editAllNotificationTab?"filled":"outline"} onClick={editAllNotification}></Button>
                </div>
                <DataTable 
                    columns={["Site", "Notification Type", "Email Contacts", "Receiver Name", "Actions"]} 
                    data={formattedData || []} 
                    loading={loading} 
                    pagination={true} 
                    count={formattedData.length} 
                    handleChangePage={async(page:any) => await handleChangePage(page)} 
                    page={page} 
                    rowsPerPage={formattedData.length} 
                />
            </Paper>
            <AddNotification addOpen={addOpen} closeDialog={closeDialog} refreshData={refreshData} setAddNotificationTab={setAddNotificationTab} />
            <EditNotification editOpen={editOpen} closeDialog={closeEditDialog} refreshData={refreshData} editData={selectedNotification} />
            <EditAllNotification editAllOpen={editAllOpen} closeEditAllDialog={closeEditAllDialog} setEditAllNotificationTab={setEditAllNotificationTab}/>
            <DeleteNotification deleteOpen={deleteOpen} closeDialog={closeDeleteDialog} refreshData={refreshData} deleteData={selectedNotification} />
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
			await axios.delete(`/api/iqStats/notification?id=${deleteData._id}`, {
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
				{`Delete IQ Stats Notification`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    {`Are you sure you want to delete notification for site "${Formatter.capitalizeSite(deleteData.site)}" with type "${deleteData.type}"`}
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

