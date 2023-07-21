import React, { FC, useState } from "react";
import { Button, Flex } from "../../components";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { useSnackbar } from "notistack";

interface Props {
  openDialog:any;
  closeDialog:any;
  correctData:any;
  setCorrectData:any;
  closeAndGetData:any;
  stopTimer:any
  time:any;
  setTime:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));

export const CorrectApproxVRM: FC<Props> = ({openDialog, closeDialog,correctData,setCorrectData,closeAndGetData,stopTimer,time,setTime}) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event:any) => {
        event.preventDefault();
		setLoading(true)
		try {
            correctData.vrmCorrectionTimeTaken = time ;

            const {data} = await axios.post(`/api/vrmCorrection/editVrm`, correctData, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            })

            close();
        
            for(const eachResponse of data.response){
                
                if(eachResponse.status === 200){
                    enqueueSnackbar(`VRM data sent succefully to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "success" });
                  }else{
                    enqueueSnackbar(`VRM Corrected but VRM sending failed to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "error" });
                  }
            }
		
           
			setLoading(false)

		} catch (e:any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
			setLoading(false)
		}
		
	};

    const close = ()=>{
        closeAndGetData()
        setCorrectData({})
        clearInterval(stopTimer);
    setTime(0);
    }

	const cancelDelete = () => {
		closeDialog(false); 
        setCorrectData({})
        setLoading(false)
        clearInterval(stopTimer);
    setTime(0);
	}

	return (
        <Dialog open={openDialog} onClose={ () => cancelDelete()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'sm'}>
		  <form onSubmit={(e) => handleSubmit(e)}>
            <DialogTitle>
				{`Correct VRM`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    {`Are you sure this is the correct VRM ?`}
				</div>
			</Flex>
            </DialogContent>
            <DialogActions className="pr-4">
				<Button text="Yes" type="submit" loading={loading} />
				<Button text="Cancel" onClick={ () => cancelDelete() } color='secondary'   />
            </DialogActions>
          </form>
        </Dialog>
	);
};
