import React, { FC, useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, MultiSelect, Flex } from "../../components";
import { FormikValues, useFormik } from "formik";
import { AddSchema } from "../../validationScheemas/VRMNotificationSchema";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import { type } from "os";
import { MenuItem, Select } from "@mui/material";


interface AddProps {
  addOpen: boolean;
  closeDialog: any;
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

export const AddNotification: FC<AddProps> = ({
  addOpen,
  closeDialog,
  refreshData,
  
}) => {
  const classes = useStyles();
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const userLoginType = userData.userType;
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSites, setSelectedSites] = useState<any>([]);
  const [selectedNotificationType, setSelectedNotificationType] = useState<any>(
    []
  );
  

  const [emailTemplateHeader, setEmailTemplateHeader] = useState<any>("");
  const [emailTemplateFooter, setEmailTemplateFooter] = useState<any>("");
  const [notificationSettingAccessSites, setNotificationSettingAccessSites] =
    useState<any>([]);
  const [notificationTypes, setNotificationTypes] = useState<any[]>([]);
  
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

  useEffect(() => {
    const iqAccess = userData.iqStatAccess && iqStatSites && iqStatSites[0];
    
    const types = [];
    const matchedIqSites = selectedSites[0]
      ? iqStatSites.filter((val: any) => selectedSites.includes(val))
      : [];
    const matchedMatchRateSites = selectedSites[0]
      ? matchRateSites.filter((val: any) => selectedSites.includes(val))
      : [];
    if (userLoginType === "Admin" || (iqAccess && !selectedSites[0])) {
      types.push(
        "Approx Data Report"
      );
    } else if (
      iqAccess &&
      selectedSites[0] &&
      selectedSites.length === matchedIqSites.length
    ) {
      types.push(
        "Approx Data Report"
      );
    }
    setNotificationTypes(types);
    // eslint-disable-next-line
  }, [selectedSites]);


  const handleSubmit = async (values: FormikValues) => {
    try {
      values.createdBy = email;
      values.userType = userLoginType;
      

      await axios.post("/api/vrmCorrection/addReportNotification", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      enqueueSnackbar("Notification added successfully.");
      cancelAdd();
      refreshData();
    } catch (e: any) {
      enqueueSnackbar(
        e?.response?.data?.message || e.message || "Something Went Wrong",
        { variant: "error" }
      );
      cancelAdd();
    }
  };

  const cancelAdd = () => {
    formik.resetForm();
    setEmailTemplateHeader("");
    setEmailTemplateFooter("");
    setSelectedSites([]);
    setSelectedNotificationType([]);
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
      type: [] as any,
      receiver: "",
      sites: [] as any,
      emailTemplateHeader: "",
      emailTemplateFooter: "",
      disableFrom: "",
      disableTo: "",
      dataForDays:1
    },
    validationSchema: AddSchema,
    onSubmit: handleSubmit,
  });
  
  return (
    <Dialog
      open={addOpen}
      onClose={() => cancelAdd()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"md"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Add Notification`}</DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="space-between" wrap="wrap">
            <div className="--margin-bottom-large">
              <Label>Sites</Label>
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
                values={selectedSites}
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
              <Label>Notification Type</Label>
              <MultiSelect
                placeholder="Please select notification type"
                multiplePlaceholder="notification types selected"
                allPlaceholder="All notification types selected"
                multi={true}
                style={{ width: "285px", height: "44px" }}
                options={notificationTypes.map((type: any) => ({
                  value: type,
                  label: type,
                }))}
                values={selectedNotificationType}
                onChange={async (values) => {
                  await setSelectedNotificationType(values);
                  formik.setFieldValue("type", values);
                }}
              />
              {formik.touched.type &&
                formik.errors.type && (
                  <Error>
                    {formik.touched.type &&
                      formik.errors.type}
                  </Error>
                )}
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
            
              
            {/* <div className="--margin-bottom-large">
              <Label>Number Of Days</Label>
              <Select
                placeholder="Please select Number of days"
                style={{ width: "285px", height: "44px",borderRadius:"10px"}}
                name="days"
                id="days"
                value={formik.values.days}
                onChange={formik.handleChange}
                
              >

                 <MenuItem value={1}>Daily</MenuItem>
                 <MenuItem value={3}>3 Days</MenuItem>
                 <MenuItem value={7}>7 Days</MenuItem>
                 <MenuItem value={15}>15 Days</MenuItem>
                 <MenuItem value={30}>30 Days</MenuItem>


              </Select>
              
                
            </div> */}
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
                        onBlur={() => formik.setFieldTouched("days")}
                      >
                        <option
                          value={1}
                          selected={formik.values.dataForDays === 1}
                        >
                          1 Day
                        </option>
                        <option
                          value={3}
                          selected={formik.values.dataForDays === 3}
                        >
                          3 Days
                        </option>
                        <option
                          value={7}
                          selected={formik.values.dataForDays === 7}
                        >
                          7 Days
                        </option>
                        <option
                          value={15}
                          selected={formik.values.dataForDays === 15}
                        >
                          15 Days
                        </option>
                        <option
                          value={30}
                          selected={formik.values.dataForDays === 30}
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
          <Button text="Cancel" onClick={() => cancelAdd()} color="secondary" />
          <Button text="Submit" type="submit" loading={formik.isSubmitting} />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
