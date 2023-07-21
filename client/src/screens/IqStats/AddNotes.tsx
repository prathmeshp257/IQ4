import React, { FC, useContext } from "react";
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
import { FormikValues, useFormik } from "formik";
import * as Yup from 'yup';
import { AuthContext } from "../../context";

interface AddNotesProps {
  openDialog: boolean;
  closeDialog: any;
  addNoteData:any;
  filterType:any;
  
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    minHeight: 200,
    maxHeight: 400,
    overFlowY: "scroll",
  },
  dialogPaper: {
    maxHeight: "75vh",
  },
});

const Form = styled.form`
  width: 100%;
`;

const TextArea = styled.textarea`
 width:100%;
height:100px;
margin-bottom:5px;
border: 1px solid #2a2a39;
border-radius:2px;
`;

const Error = styled.div`
width:'100%';
  font-size: 12px;
  color: red;
  display: ${(e) => (e ? "block" : "none")};
  margin-top: 10px;
`;


export const AddNotes: FC<AddNotesProps> = ({
  openDialog,
  closeDialog,
  addNoteData,
  filterType

}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {userData} = useContext(AuthContext);

  const AddnotesSchema = Yup.object().shape({
    notesData: Yup.string().required(`Sorry you can't add empty notes`)
     
  });
  

  
  const handleSubmit = async (values: FormikValues) => {
    try {
     
     values.user_id=userData._id;
     values.email=userData.email;
     values.userType = userData.userType;
     values.notification_id=addNoteData._id;
     values.notificationType=addNoteData.type;
     values.filterType= filterType;

      await axios.post("/api/iqStats/addNotes", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });
      formik.resetForm();
      cancelAdd();
      enqueueSnackbar("Notes added successfully.");

  
    } catch (e: any) {
      enqueueSnackbar(
        e?.response?.data?.message || e.message || "Something Went Wrong",
        { variant: "error" }
      );
   
    }
  };
  const formik = useFormik({
    initialValues: {
      notesData:'',
    },
    onSubmit: handleSubmit,
    validationSchema:AddnotesSchema
  });

  const cancelAdd = () => {
    formik.resetForm();
 
    closeDialog();
 
  };


  return (
    <Dialog
      open={openDialog}
      onClose={() => closeDialog()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"sm"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Add Notes`}</DialogTitle>
        <DialogContent>
          <TextArea
          id="notesData"
          name="notesData"
          value={formik.values.notesData}
          onChange={formik.handleChange}
          />
          {formik.touched.notesData && formik.errors.notesData && (
                <Error>{formik.touched.notesData && formik.errors.notesData}</Error>
              )}
          
        </DialogContent>
        <DialogActions style={{marginRight:'15px'}}>
          <Button text="Add" type="submit"  color="secondary" />
          <Button text="Cancel" onClick={() => cancelAdd()} color="secondary" />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
