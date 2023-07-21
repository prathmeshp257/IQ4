import React, { FC } from "react";
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

interface viewVRMProps {
  dialogOpen: boolean;
  closeDialog: any;
  src: any;
  type:any;

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

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;

export const ViewVRM: FC<viewVRMProps> = ({
    dialogOpen,
    closeDialog,
    src,
    type

}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  

  

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => closeDialog(false)}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={type==="plate"?"sm":"md"}
    >
      <Form>
        <DialogTitle>{`View VRM`}</DialogTitle>
        <DialogContent>

            {type==="plate"?<img
            width="100%"
            height={200}
            style={{display: "block",
                marginLeft: "auto",
                marginRight: "auto"}}
            src={src}/>:<img
            width="100%"
            style={{display: "block",
                marginLeft: "auto",
                marginRight: "auto"}}
            src={src}/>}
         
        </DialogContent>
        <DialogActions>
        
          <Button text="Close" onClick={() => closeDialog(false)} color="secondary" />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
