import React, { FC, useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, MultiSelect, Flex } from "../../components";
import { FormikValues, useFormik } from "formik";
import { EditSchema } from "../../validationScheemas/CameraNotificationSchema";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import { type } from "os";

interface EditProps {
    editOpen: boolean;
    closeDialog: any;
    editData: any;
    refreshData: any;
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
  min-width: ${isMobile ? "260px" : "285px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "285px"};
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
  :disabled {
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  display: flex;
  width: 100%;
  min-width: ${isMobile ? "260px" : "285px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "285px"};
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

export const EditCameraNotification: FC<EditProps> = ({
    editOpen,
    closeDialog,
    refreshData,
    editData

}) => {
    const classes = useStyles();
    const { userData } = useContext(AuthContext);
    const userLoginType = userData.userType;
    const { enqueueSnackbar } = useSnackbar();
    const [selectedNotificationType, setSelectedNotificationType] = useState<any>(
        []
    );
    const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
    const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
   
        useState<any>([]);
    
    const [thresholdError, setThresholdError] = useState<any>("");
    const { email } = useContext(UserContext);
   
  


    const handleSubmit = async (values: FormikValues) => {
        try {
            values._id = editData._id;
            values.safEnabled = values.safEnabled === "true" ? true : false;
            values.sdReadOnly = values.sdReadOnly === "true" ? true : false;
            values.limitedSpace = values.limitedSpace === "true" ? true : false;
            values.createdBy = email;
            values.userType = userLoginType;
            values.emailTemplateHeader = emailTemplateHeader;
            values.emailTemplateFooter = emailTemplateFooter;
            values.emailContacts = values.emailContacts.filter((val: any) => val !== "");

            if (
                values.notificationType ==="SaF 1 Unsent" &&
                (!values.unsent1 || !(values.unsent1 > 0))
            ) {
                formik.setFieldError("unsent1", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="SaF 2 Unsent" &&
                (!values.unsent2 || !(values.unsent2 > 0))
            ) {
                formik.setFieldError("unsent2", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="SaF 3 Unsent" &&
                (!values.unsent3 || !(values.unsent3 > 0))
            ) {
                formik.setFieldError("unsent3", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="SaF 4 Unsent" &&
                (!values.unsent4 || !(values.unsent4 > 0))
            ) {
                formik.setFieldError("unsent4", "Current must be greater than zero");
                return;
            }
            
            if (
                values.notificationType ==="IR Current 1" &&
                (!values.lowAmp1 || !(values.lowAmp1 > 0))
            ) {
                formik.setFieldError("lowAmp1", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="IR Current 1" &&
                (!values.highAmp1 || !(values.highAmp1 > 0))
            ) {
                formik.setFieldError("highAmp1", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType.includes("IR Current 1") &&
                (!values.frequencyIRCurrent1 || !(values.frequencyIRCurrent1 > 0 && values.frequencyIRCurrent1 <= 5 ))
            ) {
                formik.setFieldError("frequencyIRCurrent1", "Request frequency must be in range of 1-5");
                return;
            }




            if (
                values.notificationType ==="IR Current 2" &&
                (!values.lowAmp2 || !(values.lowAmp2 > 0))
            ) {
                formik.setFieldError("lowAmp2", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="IR Current 2" &&
                (!values.highAmp2 || !(values.highAmp2 > 0))
            ) {
                formik.setFieldError("highAmp2", "Current must be greater than zero");
                return;
            }

            if (
                values.notificationType.includes("IR Current 2") &&
                (!values.frequencyIRCurrent2 || !(values.frequencyIRCurrent2 > 0 && values.frequencyIRCurrent2 <= 5 ))
            ) {
                formik.setFieldError("frequencyIRCurrent2", "Request frequency must be in range of 1-5");
                return;
            }

            if (
                values.notificationType ==="PoE voltage"&&
                (!values.lowVoltage || !(values.lowVoltage > 0))
            ) {
                formik.setFieldError("lowVoltage", "Voltage must be greater than zero");
                return;
            }

            if (
                values.notificationType ==="PoE voltage" &&
                (!values.highVoltage || !(values.highVoltage > 0))
            ) {
                formik.setFieldError("highVoltage", "Voltage must be greater than zero");
                return;
            }

            if (
                values.notificationType.includes("PoE voltage") &&
                (!values.frequencyPoEvoltage || !(values.frequencyPoEvoltage > 0 && values.frequencyPoEvoltage <= 5 ))
            ) {
                formik.setFieldError("frequencyPoEvoltage", "Request frequency must be in range of 1-5");
                return;
            }


            await axios.put("/api/iqStats/editCameraNotification", values, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            });

            enqueueSnackbar("Notification added successfully.");
            cancelEdit();
            refreshData();
        } catch (e: any) {
            console.log("e", e);

            enqueueSnackbar(
                e?.response?.data?.message || e.message || "Something Went Wrong",
                { variant: "error" }
            );
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        formik.resetForm();
        setEmailTemplateHeader("");
        setEmailTemplateFooter("");
        setSelectedNotificationType([]);
        setThresholdError("");
        closeDialog();
    };

    

    const imageChange = (event: any, type: string) => {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            if (type === "emailTemplateHeader") {
                setEmailTemplateHeader(
                    reader.result?.toString().split("base64,").pop()
                );
            } else if (type === "emailTemplateFooter") {
                setEmailTemplateFooter(
                    reader.result?.toString().split("base64,").pop()
                );
            }
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
    };

   

  

    

    const formik = useFormik({
        initialValues: {
            type: "",
            notificationType: "",
            site: "",
            emailTemplateHeader: "",
            emailTemplateFooter: "",
            emailContacts: [] as any,
            receiver: "",
            safEnabled: "false",
            sdReadOnly: "false",
            limitedSpace: "false",
            unsent1: '',
            state1: 'Disabled',
            lowVoltage:'',
            highVoltage:'',
            frequencyPoEvoltage: '',
            frequencyIRCurrent1:'',
            frequencyIRCurrent2:'',
            lowAmp1: '',
            highAmp1: '',
            lowAmp2: "",
            highAmp2: "",
            unsent2: '',
            state2: 'Disabled',
            unsent3: '',
            state3: 'Disabled',
            unsent4: '',
            state4: 'Disabled',
            disableFrom: "",
            disableTo: "",
        },
        validationSchema: EditSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
      if (editData) {
        formik.setValues({
          type: editData.type || "",
          site: editData.site ? editData.site : '',
          notificationType: editData.notificationType ? editData.notificationType : '' ,
          emailTemplateHeader: "",
          emailTemplateFooter: "",
          safEnabled: editData.safEnabled === true ? "true" : "false",
          sdReadOnly: editData.sdReadOnly === true ? "true" : "false",
          limitedSpace: editData.limitedSpace === true ? 'true' : "false",
          unsent1: editData.unsent1 ? editData.unsent1 : '',
          state1: editData.state1 ? editData.state1 : 'Disabled',
          lowVoltage: editData.lowVoltage ? editData.lowVoltage : '',
          highVoltage: editData.highVoltage ? editData.highVoltage : '',
          lowAmp1: editData.lowAmp1 ? editData.lowAmp1 : '',
          frequencyPoEvoltage: editData.totalCount ? editData.totalCount : '',
          frequencyIRCurrent1: editData.totalCount ? editData.totalCount : '',
          frequencyIRCurrent2: editData.totalCount ? editData.totalCount : '',
          highAmp1: editData.highAmp1 ? editData.highAmp1 : '',
          lowAmp2: editData.lowAmp2 ? editData.lowAmp2 : "",
          highAmp2: editData.highAmp2 ? editData.highAmp2 : "",
          unsent2: editData.unsent2 ? editData.unsent2 : '',
          state2: editData.state2 ? editData.state2 : 'Disabled',
          unsent3: editData.unsent3 ? editData.unsent3 : '',
          state3: editData.state3 ? editData.unsent3 : 'Disabled',
          unsent4: editData.unsent4 ? editData.unsent4 : '',
          state4: editData.state4 ? editData.state4 :'Disabled',
          emailContacts: editData.emailContacts || [],
          receiver: editData.receiver || "",
         
      disableFrom:editData.disableFrom || "",
      disableTo:editData.disableTo || ""
        });
      }
      // eslint-disable-next-line
    }, [editData]);



    return (
        <Dialog
            open={editOpen}
            onClose={() => cancelEdit()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={"md"}
        >
            <Form onSubmit={formik.handleSubmit}>
                <DialogTitle>{`Edit Camera Notification`}</DialogTitle>
                <DialogContent>
                    <Flex direction="row" justify="space-between" wrap="wrap">
                        <div className="--margin-bottom-large">
                            <Label>Sites</Label>
                            <InputText
                            disabled
                                type="text"
                                name="site"
                                id="site"
                                value={formik.values.site}
                            />
                        </div>
                        <div className="--margin-bottom-large">
                            <Label>Type</Label>
                            <InputText
                            disabled
                                type="text"
                                name="type"
                                id="type"
                                value={formik.values.type === "Input health" ? "Input voltage" : formik.values.type}
                            />
                          
                        </div>

                        <div className="--margin-bottom-large">
                            <Label>Notification Type</Label>
                            <InputText
                            disabled
                                type="text"
                                name="type"
                                id="type"
                                value={formik.values.notificationType}
                            />
                           
                        </div>
                        <div className="--margin-bottom-large">
                            <Label>Email Template Header</Label>
                            <InputText
                                type="file"
                                name="emailTemplateHeader"
                                id="emailTemplateHeader"
                                accept="image/*"
                                onChange={(e) => {
                                    imageChange(e, "emailTemplateHeader");
                                    formik.handleChange(e);
                                }}
                                onBlur={() => formik.setFieldTouched("emailTemplateHeader")}
                                value={formik.values.emailTemplateHeader}
                            />
                        </div>
                        <div className="--margin-bottom-large">
                            <Label>Email Template Footer</Label>
                            <InputText
                                type="file"
                                name="emailTemplateFooter"
                                id="emailTemplateFooter"
                                accept="image/*"
                                onChange={(e) => {
                                    imageChange(e, "emailTemplateFooter");
                                    formik.handleChange(e);
                                }}
                                onBlur={() => formik.setFieldTouched("emailTemplateFooter")}
                                value={formik.values.emailTemplateFooter}
                            />
                        </div>
                        <div className="--margin-bottom-large">
                            <Label>Email Contacts</Label>
                            <TextArea
                                rows={2}
                                id="emailContacts"
                                name="emailContacts"
                                autoComplete="nope"
                                onChange={(e) => {
                                    formik.setFieldValue(
                                        "emailContacts",
                                        e.target.value.split(",")
                                    );
                                }}
                                onBlur={() => formik.setFieldTouched("emailContacts")}
                                value={(formik.values.emailContacts || []).join()}
                            />
                            {formik.touched.emailContacts && formik.errors.emailContacts && (
                                <Error>
                                    {formik.touched.emailContacts && formik.errors.emailContacts}
                                </Error>
                            )}
                        </div>
                        <div className="--margin-bottom-large">
                            <Label>Receiver Name</Label>
                            <InputText
                                id="receiver"
                                name="receiver"
                                autoComplete="nope"
                                onChange={formik.handleChange}
                                onBlur={() => formik.setFieldTouched("receiver")}
                                value={formik.values.receiver}
                            />
                            {formik.touched.receiver && formik.errors.receiver && (
                                <Error>
                                    {formik.touched.receiver && formik.errors.receiver}
                                </Error>
                            )}
                        </div>


                        { formik.values.notificationType === "SaF Enabled"? (
                            <div className="--margin-bottom-large">
                                <Label>SaF Enabled</Label>
                                <select
                                    name="safEnabled"
                                    id="safEnabled"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("safEnabled")}
                                >
                                    <option selected={formik.values.safEnabled === "true"} value="true">True</option>
                                    <option selected={formik.values.safEnabled === "false"} value='false'>False</option>
                                </select>
                                {formik.touched.safEnabled &&
                                    formik.errors.safEnabled && (
                                        <Error>
                                            {formik.touched.safEnabled &&
                                                formik.errors.safEnabled}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}
                        {formik.values.notificationType === "SD Card Health"? (
                            <div className="--margin-bottom-large">
                                <Label>SD Card Health</Label>
                                <select
                                    name="sdReadOnly"
                                    id="sdReadOnly"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("sdReadOnly")}
                                >
                                    <option selected={formik.values.sdReadOnly === "true"} value="true">True</option>
                                    <option selected={formik.values.sdReadOnly === "false"} value='false'>False</option>
                                </select>
                                {formik.touched.sdReadOnly &&
                                    formik.errors.sdReadOnly && (
                                        <Error>
                                            {formik.touched.sdReadOnly &&
                                                formik.errors.sdReadOnly}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "Limited Space" ? (
                            <div className="--margin-bottom-large">
                                <Label>Limited Space</Label>
                                <select
                                    name="limitedSpace"
                                    id="limitedSpace"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("limitedSpace")}
                                >
                                    <option selected={formik.values.limitedSpace === "true"} value="true">True</option>
                                    <option selected={formik.values.limitedSpace === "false"} value='false'>False</option>
                                </select>
                                {formik.touched.limitedSpace &&
                                    formik.errors.limitedSpace && (
                                        <Error>
                                            {formik.touched.limitedSpace &&
                                                formik.errors.limitedSpace}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}



                        { formik.values.notificationType === "SaF 1 Unsent"? (
                            <div className="--margin-bottom-large">
                                <Label>SaF 1 Unsent</Label>
                                <InputText
                                    name="unsent1"
                                    id="unsent1"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={() => formik.setFieldTouched("unsent1")}
                                    value={formik.values.unsent1}
                                />
                                {formik.touched.unsent1 &&
                                    formik.errors.unsent1 && (
                                        <Error>
                                            {formik.touched.unsent1 &&
                                                formik.errors.unsent1}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 1 Status" ? (
                            <div className="--margin-bottom-large">
                                <Label>SaF 1 Status</Label>
                                <select
                                    name="state1"
                                    id="state1"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("state1")}
                                >
                                   
                                    <option selected={formik.values.state1 === "Active"} value="Active">Active</option>
                                    <option selected={formik.values.state1 === "Disabled"} value='Disabled'>Disabled</option>
                                </select>
                                {formik.touched.state1 &&
                                    formik.errors.state1 && (
                                        <Error>
                                            {formik.touched.state1 &&
                                                formik.errors.state1}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 2 Unsent"? (

                            <div className="--margin-bottom-large">
                                <Label>SaF 2 Unsent</Label>
                                <InputText
                                    name="unsent2"
                                    id="unsent2"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={() => formik.setFieldTouched("unsent2")}
                                    value={formik.values.unsent2}
                                />
                                {formik.touched.unsent2 &&
                                    formik.errors.unsent2 && (
                                        <Error>
                                            {formik.touched.unsent2 &&
                                                formik.errors.unsent2}
                                        </Error>
                                    )}
                            </div>


                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 2 Status" ? (
                            <div className="--margin-bottom-large">
                                <Label>SaF 2 Status</Label>
                                <select
                                    name="state2"
                                    id="state2"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("state2")}
                                >
                                    <option selected={formik.values.state2 === "Active"} value="Active">Active</option>
                                    <option selected={formik.values.state2 === "Disabled"} value='Disabled'>Disabled</option>
                                </select>
                                {formik.touched.state2 &&
                                    formik.errors.state2 && (
                                        <Error>
                                            {formik.touched.state2 &&
                                                formik.errors.state2}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        { formik.values.notificationType === "SaF 3 Unsent" ? (

                            <div className="--margin-bottom-large">
                                <Label>SaF 3 Unsent</Label>
                                <InputText
                                    name="unsent3"
                                    id="unsent3"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={() => formik.setFieldTouched("unsent3")}
                                    value={formik.values.unsent3}
                                />
                                {formik.touched.unsent3 &&
                                    formik.errors.unsent3 && (
                                        <Error>
                                            {formik.touched.unsent3 &&
                                                formik.errors.unsent3}
                                        </Error>
                                    )}
                            </div>


                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 3 Status" ? (
                            <div className="--margin-bottom-large">
                                <Label>SaF 3 Status</Label>
                                <select
                                    name="state3"
                                    id="state3"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("state3")}
                                > 
                                    <option selected={formik.values.state3 === "Active"} value="Active">Active</option>
                                    <option selected={formik.values.state3 === "Disabled"} value='Disabled'>Disabled</option>
                                </select>
                                {formik.touched.state3 &&
                                    formik.errors.state3 && (
                                        <Error>
                                            {formik.touched.state3 &&
                                                formik.errors.state3}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 4 Unsent" ? (

                            <div className="--margin-bottom-large">
                                <Label>SaF 4 Unsent</Label>
                                <InputText
                                    name="unsent4"
                                    id="unsent4"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={() => formik.setFieldTouched("unsent4")}
                                    value={formik.values.unsent4}
                                />
                                {formik.touched.unsent4 &&
                                    formik.errors.unsent4 && (
                                        <Error>
                                            {formik.touched.unsent4 &&
                                                formik.errors.unsent4}
                                        </Error>
                                    )}
                            </div>


                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "SaF 4 Status" ? (
                            <div className="--margin-bottom-large">
                                <Label>SaF 4 Status</Label>
                                <select
                                    name="state4"
                                    id="state4"
                                    style={{
                                        width: `${isMobile ? "260px" : "285px"}`,
                                        height: "44px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                    onChange={(e: any) => {
                                        formik.handleChange(e);
                                    }}
                                    onBlur={() => formik.setFieldTouched("state4")}
                                > 
                                    <option selected={formik.values.state4 === "Active"} value="Active">Active</option>
                                    <option selected={formik.values.state4 === "Disabled"} value='Disabled'>Disabled</option>
                                </select>
                                {formik.touched.state4 &&
                                    formik.errors.state4 && (
                                        <Error>
                                            {formik.touched.state4 &&
                                                formik.errors.state4}
                                        </Error>
                                    )}
                            </div>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "IR Current 1" ? (
                            <React.Fragment>
                                <div className="--margin-bottom-large">
                                    <Label>Low Threshold (IR Current 1)</Label>
                                    <InputText
                                        name="lowAmp1"
                                        id="lowAmp1"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("lowAmp1")}
                                        value={formik.values.lowAmp1}
                                    />
                                    {formik.touched.lowAmp1 &&
                                        formik.errors.lowAmp1 && (
                                            <Error>
                                                {formik.touched.lowAmp1 &&
                                                    formik.errors.lowAmp1}
                                            </Error>
                                        )}
                                </div>
                                <div className="--margin-bottom-large">
                                    <Label>High Threshold (IR Current 1)</Label>
                                    <InputText
                                        name="highAmp1"
                                        id="highAmp1"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("highAmp1")}
                                        value={formik.values.highAmp1}
                                    />
                                    {formik.touched.highAmp1 &&
                                        formik.errors.highAmp1 && (
                                            <Error>
                                                {formik.touched.highAmp1 &&
                                                    formik.errors.highAmp1}
                                            </Error>
                                        )}
                                </div>

                                <div className="--margin-bottom-large">
                                    <Label>Request Frequency (IR Current 1)</Label>
                                    <InputText
                                        name="frequencyIRCurrent1"
                                        id="frequencyIRCurrent1"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("frequencyIRCurrent1")}
                                        value={formik.values.frequencyIRCurrent1}
                                    />
                                    {formik.touched.frequencyIRCurrent1 &&
                                        formik.errors.frequencyIRCurrent1 && (
                                            <Error>
                                                {formik.touched.frequencyIRCurrent1 &&
                                                    formik.errors.frequencyIRCurrent1}
                                            </Error>
                                        )}
                                </div>
                            </React.Fragment>
                        ) : (
                            ""
                        )}

                        {formik.values.notificationType === "IR Current 2" ? (
                            <React.Fragment>
                                <div className="--margin-bottom-large">
                                    <Label>Low Threshold (IR Current 2)</Label>
                                    <InputText
                                        name="lowAmp2"
                                        id="lowAmp2"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("lowAmp2")}
                                        value={formik.values.lowAmp2}
                                    />
                                    {formik.touched.lowAmp2 &&
                                        formik.errors.lowAmp2 && (
                                            <Error>
                                                {formik.touched.lowAmp2 &&
                                                    formik.errors.lowAmp2}
                                            </Error>
                                        )}
                                </div>
                                <div className="--margin-bottom-large">
                                    <Label>High Threshold (IR Current 2)</Label>
                                    <InputText
                                        name="highAmp2"
                                        id="highAmp2"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("highAmp2")}
                                        value={formik.values.highAmp2}
                                    />
                                    {formik.touched.highAmp2 &&
                                        formik.errors.highAmp2 && (
                                            <Error>
                                                {formik.touched.highAmp2 &&
                                                    formik.errors.highAmp2}
                                            </Error>
                                        )}
                                </div>

                                <div className="--margin-bottom-large">
                                    <Label>Request Frequency (IR Current 2)</Label>
                                    <InputText
                                        name="frequencyIRCurrent2"
                                        id="frequencyIRCurrent2"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("frequencyIRCurrent2")}
                                        value={formik.values.frequencyIRCurrent2}
                                    />
                                    {formik.touched.frequencyIRCurrent2 &&
                                        formik.errors.frequencyIRCurrent2 && (
                                            <Error>
                                                {formik.touched.frequencyIRCurrent2 &&
                                                    formik.errors.frequencyIRCurrent2}
                                            </Error>
                                        )}
                                </div>
                            </React.Fragment>
                        ) : (
                            ""
                        )}

{formik.values.notificationType === "PoE voltage" ? (
                            <React.Fragment>
                                <div className="--margin-bottom-large">
                                    <Label>Input health (Low)</Label>
                                    <InputText
                                        name="lowVoltage"
                                        id="lowVoltage"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("lowVoltage")}
                                        value={formik.values.lowVoltage}
                                    />
                                    {formik.touched.lowVoltage &&
                                        formik.errors.lowVoltage && (
                                            <Error>
                                                {formik.touched.lowVoltage &&
                                                    formik.errors.lowVoltage}
                                            </Error>
                                        )}
                                </div>
                                <div className="--margin-bottom-large">
                                    <Label>Input health (High)</Label>
                                    <InputText
                                        name="highVoltage"
                                        id="highVoltage"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("highVoltage")}
                                        value={formik.values.highVoltage}
                                    />
                                    {formik.touched.highVoltage &&
                                        formik.errors.highVoltage && (
                                            <Error>
                                                {formik.touched.highVoltage &&
                                                    formik.errors.highVoltage}
                                            </Error>
                                        )}
                                </div>

                                <div className="--margin-bottom-large">
                                    <Label>Request Frequency (PoE voltage)</Label>
                                    <InputText
                                        name="frequencyPoEvoltage"
                                        id="frequencyPoEvoltage"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={() => formik.setFieldTouched("frequencyPoEvoltage")}
                                        value={formik.values.frequencyPoEvoltage}
                                    />
                                    {formik.touched.frequencyPoEvoltage &&
                                        formik.errors.frequencyPoEvoltage && (
                                            <Error>
                                                {formik.touched.frequencyPoEvoltage &&
                                                    formik.errors.frequencyPoEvoltage}
                                            </Error>
                                        )}
                                </div>
                            </React.Fragment>
                        ) : (
                            ""
                        )}




                        <div className="--margin-bottom-large">
                            <Label style={{ marginBottom: "10px" }}>
                                Disable Notification
                            </Label>
                            <TextField
                                name="disableFrom"
                                label="From"
                                type="time"
                                onChange={formik.handleChange}
                                value={formik.values.disableFrom}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                                sx={{ width: 140, marginRight: "10px" }}
                                className="--margin-bottom-large"
                            />

                            <TextField
                                name="disableTo"
                                label="To"
                                type="time"
                                onChange={formik.handleChange}
                                value={formik.values.disableTo}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                                sx={{ width: 140 }}
                            />
                        </div>
                        {selectedNotificationType.includes("Match Rate") ||
                            selectedNotificationType.includes("Frame Count") ? (
                            <div style={{ width: "100%" }}>
                                {thresholdError && <Error>{thresholdError}</Error>}
                            </div>
                        ) : (
                            ""
                        )}
                    </Flex>
                </DialogContent>
                <DialogActions className="pr-4">
                    <Button text="Cancel" onClick={() => cancelEdit()} color="secondary" />
                    <Button text="Submit" type="submit" loading={formik.isSubmitting} />
                </DialogActions>
            </Form>
        </Dialog>
    );
};
