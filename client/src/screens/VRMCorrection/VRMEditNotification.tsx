import React, { FC, useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, Flex, MultiSelect } from "../../components";
import { FormikValues, useFormik } from "formik";
import { EditSchema } from "../../validationScheemas/VRMNotificationSchema";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../../context/AuthContext";
import { SiteContext } from "../../context/SitesContext";
import { UserContext } from "../../context/UserContext";

interface EditProps {
  editOpen: boolean;
  closeDialog: any;
  refreshData: any;
  editData: any;
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

export const EditNotification: FC<EditProps> = ({
  editOpen,
  closeDialog,
  refreshData,
  editData,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
  const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const [selectedSites, setSelectedSites] = useState<any>([]);

  const userLoginType = userData.userType;

  const [notificationSettingAccessSites, setNotificationSettingAccessSites] =
    useState<any>([]);
    const { sites, email } = useContext(UserContext);
    const iqStatSites =
      userLoginType === "Admin" ? sites : userData.iqStatAccessSites;
    const matchRateSites =
      userLoginType === "Admin" ? sites : userData.matchRateAlertAccessSites;
    const allSites = iqStatSites
      .concat(matchRateSites)
      .filter((val: any) => val !== "" && val !== undefined && val !== null);
    const uniqSites = allSites.filter(
      (val: any, pos: any) => allSites.indexOf(val) === pos
    );

    useEffect(() => {
        if (userLoginType !== "Admin" && uniqSites) {
          let accessSites = uniqSites;
          for (const eachSite of uniqSites) {
            const expired = sitesData.filter(
              (val: any) => val.id === eachSite && val.contractExpired
            );
            if (expired[0]) {
              accessSites = accessSites.filter((val: any) => val !== eachSite);
            }
          }
          setNotificationSettingAccessSites(accessSites);
        } else if (userLoginType === "Admin") {
          setNotificationSettingAccessSites(sites);
        } else {
          setNotificationSettingAccessSites([]);
        }
        // eslint-disable-next-line
      }, [sitesData]);

  const handleSubmit = async (values: FormikValues) => {
    
    try {
      values._id = editData._id;
      values.userType = editData.userType;
      values.createdBy = editData.createdBy;
  
      await axios.put("/api/vrmCorrection/editReportNotification", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      enqueueSnackbar("Notification edited successfully.");
      cancelEdit();
      refreshData();
    } catch (e: any) {
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
     
        emailContacts: [] as any,
        type: "",
        receiver: "",
        sites: [] as any,
        emailTemplateHeader: "",
        emailTemplateFooter: "",

        disableFrom: "",
        disableTo: "",
        dataForDays:""
    },
    validationSchema: EditSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (editData) {
        let site = []
        if (editData.sites && editData.sites.length > 1 ){
            for( let eachSite of editData.sites ){
                site.push(Formatter.normalizeSite(eachSite))
            }
        }
      formik.setValues({
        
        
        type: editData.type ? editData.type : "",
        sites: site ? site : "",
        emailTemplateHeader: "",
        emailTemplateFooter: "",
        emailContacts: editData.emailContacts ? editData.emailContacts : [],
        receiver: editData.receiver ? editData.receiver : "",
		    disableFrom: editData.disableFrom ?editData.disableFrom : "",
		    disableTo: editData.disableTo ? editData.disableTo : "",
        dataForDays: editData.dataForDays ? editData.dataForDays : ""
      });
    }    // eslint-disable-next-line
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
        <DialogTitle>{`Edit Notification`}</DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="space-between" wrap="wrap">
            <div className="--margin-bottom-large">
              <Label>Site</Label>
              <MultiSelect
                place="popUp"
                multi={true}
                style={{
                  width: `${isMobile ? "260px" : "285px"}`,
                  height: "44px",
                }}
                options={notificationSettingAccessSites.map((site: string) => ({
                  value: Formatter.normalizeSite(site),
                  label: Formatter.capitalizeSite(site),
                }))}
                values={formik.values.sites}
                onChange={async (values) => {
                  const normalizedSites = Formatter.normalizeSites(values);
                  await setSelectedSites(normalizedSites);
                  formik.setFieldValue("sites", normalizedSites);
                }}
              />
              {formik.touched.sites && formik.errors.sites && (
                <Error>{formik.touched.sites && formik.errors.sites}</Error>
              )}
            </div>
            <div className="--margin-bottom-large">
              <Label> Type</Label>
              <InputText
                type="text"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                disabled
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
            <div className="--margin-bottom-large">
                      <Label>Send data for last number of days</Label>
                      <select
                        name="dataForDays"
                        id="days"
                        style={{
                          minWidth: "285px", maxWidth: '285px',
                          height: "44px",
                          borderRadius: "10px",
                          textAlign: "center",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.dataForDays}

                        onBlur={() => formik.setFieldTouched("days")}
                      >
                        <option
                          value="1"
                          selected={formik.values.dataForDays === "1"}
                        >
                          1 Day
                        </option>
                        <option
                          value="3"
                          selected={formik.values.dataForDays === "3"}
                        >
                          3 Days
                        </option>
                        <option
                          value="7"
                          selected={formik.values.dataForDays === "7"}
                        >
                          7 Days
                        </option>
                        <option
                          value="15"
                          selected={formik.values.dataForDays === "15"}
                        >
                          15 Days
                        </option>
                        <option
                          value="30"
                          selected={formik.values.dataForDays === "30"}
                        >
                          30 Days
                        </option>
                      </select>
                      {formik.touched.dataForDays && formik.errors.dataForDays && (
                        <Error>
                          {formik.touched.dataForDays && formik.errors.dataForDays}
                        </Error>
                      )}
                    
                  </div>
            
          </Flex>
        </DialogContent>
        <DialogActions className="pr-4">
          <Button
            text="Cancel"
            onClick={() => cancelEdit()}
            color="secondary"
          />
          <Button text="Submit" type="submit" loading={formik.isSubmitting} />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
