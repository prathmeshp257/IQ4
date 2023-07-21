import React, { FC,useEffect,useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button } from "../../components";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import dayjs from "dayjs";
import ProgressBar from "../Reports/ProgressBar";

interface viewNotesProps {
  openDialog: boolean;
  closeDialog: any;
  viewNoteData:any;
  filterType:any;
  setviewNoteData:any;
  
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    overFlowY: "scroll",
  },
  dialogPaper: {
    maxHeight: "75vh",
  },
});

const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;

export const ViewNotes: FC<viewNotesProps> = ({
  openDialog,
  closeDialog,
  viewNoteData,
  filterType,
  setviewNoteData

}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading,setLoading] = useState(false);
  const [notes,setNotes] =  useState<any>([]);

  const getNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/iqStats/listNotes?notification_id=${viewNoteData._id}&notificationType=${viewNoteData.type}&filterType=${filterType}`,
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setNotes(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  }

  useEffect(()=>{
    if(Object.keys(viewNoteData).length>0){
      getNotes();
    }
  },[viewNoteData])

  const close = () =>{
    setviewNoteData({});
    closeDialog();
  }
  


  return (
    <Dialog
      open={openDialog}
      onClose={() => close()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"md"}
    >
      
        <DialogTitle>{`View Notes`}</DialogTitle>
        <DialogContent>
        <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell style={{width:"70%",textAlign:'center'}}>Content</TableCell>
                                <TableCell>Added by</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                            loading ? 
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar/> </div>
                                    </TableCell>
                                </TableRow>
                            : notes[0] ? notes.map((note:any)=>{
                              return <TableRow>
                                        <TableCell>{dayjs(note.when).format("DD-MM-YYYY HH:mm")}</TableCell>
                                        <TableCell style={{textAlign:'justify'}}>{note.notesData}</TableCell>
                                        <TableCell>{note.createdBy}</TableCell>
                                     </TableRow>
                            }):<TableRow>
                            <TableCell colSpan={3}>
                                <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> No notes available ! </div>
                            </TableCell>
                        </TableRow>
                          }
              
                            
                        </TableBody>
                    </Table>
                </TableContainer>
        </DialogContent>
        <DialogActions>
      
          <Button text="Close" onClick={() => close()} color="secondary" />
        </DialogActions>
    
    </Dialog>
  );
};
