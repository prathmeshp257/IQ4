import { FormikValues, useFormik } from "formik";
import React, { FC, useEffect, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex } from "../../components";
import { colors } from "../../utils/constants";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useSnackbar } from "notistack";



interface Props {
    site: any;
    editOpen: any;
    closeDialog: any;
    email:any;
    userType:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: "75vh",
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
  min-width: ${isMobile ? "260px" : "455px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "455px"};
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

export const EditUrl: FC<Props> = ({ editOpen, closeDialog, site,email,userType}) => {
   
   
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [urlRows, setUrlRows] = useState<any>(['']);
    const [errorUrl,setErrorUrl] =  useState<any>([])


    const handleSubmit = async (values: FormikValues) => {
        try {
       
        if(errorUrl.includes(false)){
            enqueueSnackbar("Invalid Url",{
                variant: "error",
            });
            return ; 
        }
        if(urlRows.at(-1)===""){
            enqueueSnackbar("Please fill in a valid URL",{
                variant: "error",
            });
            return ; 
        }
        
         
          values.replaceUrl = urlRows;
          values.email=email;
          values.type=userType;
          values.sites= [site._id];
          await axios.post("/api/sites/editUrl", values, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            });

            enqueueSnackbar("URL updated successfully.",{
                variant: "success",
            });
            setUrlRows([''])
        
        } catch (e: any) {
            enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
                variant: "error",
            });
        }
        cancelEdit();
    };

  

    useEffect(() => {
        if (site.forwardUrl && site.forwardUrl[0]) {
            setUrlRows(site.forwardUrl)
        }
    }, [site])


    const cancelEdit = () => {
        formik.resetForm();
        setUrlRows([''])
        closeDialog();
        setErrorUrl([])
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            replaceUrl: [],

        },
        onSubmit: handleSubmit,
    });

    const addURLRow = () => {
        const modifiedUrlRows = [...urlRows];
        if(urlRows[urlRows.length-1]!=="" && !errorUrl.includes(false)){
            modifiedUrlRows.push('');

            setUrlRows(modifiedUrlRows);
        }else{
            enqueueSnackbar("Please fill in a valid URL", {
                variant: "error",
            });
        }
       
    }


    const deleteURLRow = (key: any) => {
        var modifiedUrlRows = [...urlRows];
        modifiedUrlRows = modifiedUrlRows.filter((value, index) => key !== index)
        let newurl = modifiedUrlRows.map((string:any)=>{
            
            let url;
            try {
              url = new URL(string);
            } catch (_) {
              return false;  
            }
          
            return url.protocol === "http:" || url.protocol === "https:";
          
     })
        setErrorUrl(newurl)
        setUrlRows(modifiedUrlRows);
    }

    const setUrl = (e: any, key: any) => {
        const modifiedUrlRows = [...urlRows];
        const value = e.target.value;
        modifiedUrlRows[key] = value.trim();

        let newurl = modifiedUrlRows.map((string:any)=>{
            
            let url;
            try {
              url = new URL(string);
            } catch (_) {
              return false;  
            }
          
            return url.protocol === "http:" || url.protocol === "https:";
          
     })
        setErrorUrl(newurl)
        setUrlRows(modifiedUrlRows);
    }



    const URLbuttonsStyle = {
        alignSelf: 'center',
        width: '40px',
        height: '40px',
        marginTop: '15px',
        cursor: 'pointer',
    }

  
      

    return (
        <Dialog
            open={editOpen}
            onClose={() => cancelEdit()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={"sm"}
        >
            <Form onSubmit={formik.handleSubmit}>
                <DialogTitle>{`Edit URL`}</DialogTitle>
                <DialogContent>
                    <Flex direction="row" justify="center" wrap="wrap">

                        {

                            urlRows.map((urlRow: any, key: any) => (

                                <div style={{ display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>
                                    <div>
                                        <Label>URL</Label>
                                        <InputText
                                            style={{ minWidth: "280px", maxWidth: '280px' }}
                                            type="text"
                                            key={key}
                                            value={urlRows[key]}
                                            onChange={(e) => { setUrl(e, key) }}
                                            name="replaceUrl"
                                        />
                                        {errorUrl[key] === false && (
                                     <Error>Invalid URl</Error>
                                         )}
                                    </div>

                                    <button
                                        type="button"
                                        style={URLbuttonsStyle}
                                        onClick={() => addURLRow()}
                                    > + </button>
                                    {urlRows.length > 1 &&
                                        <button
                                            type="button"
                                            style={URLbuttonsStyle}
                                            onClick={() => deleteURLRow(key)}
                                        > - </button>}
                                </div>))
                        }

                    </Flex>
                </DialogContent>

                <Flex direction="row" justify="center" wrap="wrap">
                    <DialogActions className="pr-4">
                        <Button
                            text="Cancel"
                            onClick={() => cancelEdit()}
                            color="secondary"
                        />
                        <Button text="Submit" type="submit" loading={formik.isSubmitting} />
                    </DialogActions>
                </Flex>
            </Form>
        </Dialog>
    );
};
