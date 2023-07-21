import { FormikValues, useFormik } from "formik";
import React, { FC, useEffect, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useSnackbar } from "notistack";
import { AuthContext, SiteContext } from "../../context";
import Tooltip from '@mui/material/Tooltip';
import { Formatter } from "../../utils";





interface Props {
    editOpen: any;
    closeDialog: any;
    site: any;
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

export const EditCameraUrl: FC<Props> = ({ editOpen, closeDialog, site }) => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useContext(AuthContext)
    const userType = userData.userType
    const [cameraData, setCameraData] = useState<any>([])


    const handleSubmit = async (values: FormikValues) => {
        try {
            let notValidNumber = false;
            let notValidURl = false;

            for (const eachCameraData of cameraData) {

                for (const eachcamera of eachCameraData.cameraData) {

                    if ((eachcamera.isChecked === true  && (isNaN(parseInt(eachcamera.interval)) || parseInt(eachcamera.interval) <= 0))) {
                        notValidNumber = true
                        if (notValidNumber) {
                            break
                        }

                    }
               
                    if ((!isNaN(parseInt(eachcamera.interval)) && eachcamera.isChecked === false )) {
                        notValidURl = true;
                        break;

                    }

                }
                if (notValidNumber || notValidURl ) {
                    break;
                }

            }

            if (notValidNumber) {
                enqueueSnackbar("Please enter a valid interval.", {
                    variant: "error",
                });
                return;
            }
            if (notValidURl) {
                enqueueSnackbar("Please check the corresponding checkbox.", {
                    variant: "error",
                });
                return;
            }

            values.cameraDetails = cameraData;
            values.cameraApiAccess = true;

            await axios.put("/api/sites", values, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            });

            enqueueSnackbar("URL updated successfully.", {
                variant: "success",
            });

        } catch (e: any) {
            enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
                variant: "error",
            });
        }
        cancelEdit();
    };


    useEffect(() => {
        setCameraData(site.cameraDetails);

    }, [site])


    const cancelEdit = () => {
        formik.resetForm();
        closeDialog();
        setCameraData([])
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: site ? site._id : '',
            operatorId: site ? site.operatorId : ''
        },
        onSubmit: handleSubmit,
    });


    const setUrl = (e: any, key: any, index: any, value: any) => {
        const modifiedCameraRows = [...cameraData];
        modifiedCameraRows[key].cameraData[index] = {
            ...modifiedCameraRows[key].cameraData[index],
            url: value.url,
            title: value.title,
            username: value.username,
            interval:value.interval,
            password: value.password,
            isChecked: e.target.checked
        }
        setCameraData(modifiedCameraRows)
    }


    const setInterval = (e: any, key: any, index: any) => {
        const modifiedCameraRows = [...cameraData];
        const interval = parseInt(e.target.value)
        modifiedCameraRows[key].cameraData[index] = { ...modifiedCameraRows[key].cameraData[index], interval: interval }
        setCameraData(modifiedCameraRows)

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
                <DialogTitle>{`EDIT CAMERA URL`}</DialogTitle>
                <DialogContent>
                    <Flex direction="row" justify="center" wrap="wrap">

                        {
                            (userType === "Admin") &&
                            cameraData && cameraData.map((cameraRow: any, key: any) => (

                                cameraRow.camera === site.camera && <div style={{ width: "455px" }} className="--margin-bottom-large" key={key}>
                                    <div className="--margin-bottom-large" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex' }}>
                                            <Label style={{ marginRight: "10px" }}>Camera Name :</Label>
                                            <Tooltip title={`MAC Address: ${cameraRow.MAC}`} arrow placement="top">
                                                <b style={{fontSize:'12px'}}>{cameraRow.camera}</b>
                                            </Tooltip>

                                        </div>


                                    </div>
                                    {
                                        cameraRow && cameraRow.cameraData && cameraRow.cameraData.map((urlRow: any, index: any) => (
                                                <div style={{ display: 'flex', justifyContent: 'space-between',width: "100%", marginBottom: '10px' }} key={key} >
                                                    <div  style={{display: 'flex',justifyContent: 'start', width: '260px' }}>
                                                        <input
                                                            id={`url${key}${index}url`}
                                                            style={{ marginRight: '10px'}}
                                                            type='checkbox'
                                                            key={key}
                                                            checked={urlRow.isChecked}
                                                            onChange={(e) => { setUrl(e, key, index, urlRow) }}
                                                            name={`url${key}${index}url`}
                                                        />
                                                        <label style={{ alignSelf:'center', color: '#595858', fontSize: '12px'}}>{urlRow.title === "Input health" ? "Input voltage" : urlRow.title}</label>

                                                    </div>
                                                    <div>
                                                        <label style={{ color: '#595858', fontSize: '12px', marginRight: '10px' }}>Interval (hrs)</label>

                                                        <input
                                                            style={{
                                                                minWidth: "70px",
                                                                height: '20px',
                                                                maxWidth: '70px',
                                                                borderRadius: '5px',
                                                                boxShadow: "inset 1px 1px 2px #14141469",
                                                                border: "none",
                                                                fontSize: "13px",
                                                                letterSpacing: "1.1px",
                                                                backgroundColor: " #f4f2f6",
                                                                paddingLeft: '10px'
                                                            }}
                                                            type="number"
                                                            key={key}
                                                            value={urlRow.interval}
                                                            onChange={(e) => { setInterval(e, key, index) }}
                                                            name={`url${key}${index}interval`}
                                                        />

                                                    </div>

                                                </div>



                                                /* <div style={{ width: cameraRow.cameraData.length > 1 ? '20%' : '10%', display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>

                                                {(cameraRow.cameraData.length - 1) === index && <button
                                                    className="button--filled"
                                                    type="button"
                                                    style={URLbuttonsStyle}
                                                    onClick={() => addURLRow(key, index)}
                                                > + </button>}
                                                {cameraRow.cameraData.length > 1 &&
                                                    <button
                                                        className="button--filled"
                                                        type="button"
                                                        style={URLbuttonsStyle}
                                                        onClick={() => deleteURLRow(key, index)}
                                                    > - </button>}
                                            </div> */
                                            
                                        ))
                                    }


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
