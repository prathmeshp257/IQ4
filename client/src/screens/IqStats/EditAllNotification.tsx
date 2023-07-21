import React, { FC, useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, MultiSelect, Flex } from "../../components";
import { FormikValues, useFormik } from "formik";
import { AddSchema } from "../../validationScheemas/IqNotificationSchema";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";

interface AddProps {
  editAllOpen: boolean;
  closeEditAllDialog: any;
  setEditAllNotificationTab:any;
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

export const EditAllNotification: FC<AddProps> = ({
    editAllOpen,
    closeEditAllDialog,
    setEditAllNotificationTab
    
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
  const [thresholdError, setThresholdError] = useState<any>("");
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
    const matchAlertAccess =
      userData.matchRateAlertAccess && matchRateSites && matchRateSites[0];
    const types = [];
    const matchedIqSites = selectedSites[0]
      ? iqStatSites.filter((val: any) => selectedSites.includes(val))
      : [];
    const matchedMatchRateSites = selectedSites[0]
      ? matchRateSites.filter((val: any) => selectedSites.includes(val))
      : [];
    if (userLoginType === "Admin" || (iqAccess && !selectedSites[0])) {
      types.push(
        "Time Sync",
        "Heartbeat",
        "Frame Count",
        "Reboot Log",
        "VRM Count Notification"
      );
    } else if (
      iqAccess &&
      selectedSites[0] &&
      selectedSites.length === matchedIqSites.length
    ) {
      types.push(
        "Time Sync",
        "Heartbeat",
        "Frame Count",
        "Reboot Log",
        "VRM Count Notification"
      );
    }

    if (userLoginType === "Admin" || (matchAlertAccess && !selectedSites[0])) {
      types.push("Match Rate");
    } else if (
      matchAlertAccess &&
      selectedSites[0] &&
      selectedSites.length === matchedMatchRateSites.length
    ) {
      types.push("Match Rate");
    }
    if(userLoginType === "Admin"){
      types.push("Occupancy24h Alert","Basic Occupancy Alert","Occupancy Pro Alert")
    }else{
    if(userData.basicOccupancyAccess){
      types.push("Basic Occupancy Alert")
    }
    if(userData.occupancy24hAccess){
      types.push("Occupancy24h Alert")
    }
    if(userData.occupancyProAccess){
      types.push("Occupancy Pro Alert")
    }}
    setNotificationTypes(types);
    // eslint-disable-next-line
  }, [selectedSites]);

  const handleSubmit = async (values: FormikValues) => {
    try {
      values.createdBy = email;
      values.userType = userLoginType;
      values.emailTemplateHeader = emailTemplateHeader;
      values.emailTemplateFooter = emailTemplateFooter;
      values.emailContacts = values.emailContacts.filter(
        (val: any) => val !== ""
      );
      values.notificationType = values.notificationType[0];
      if (
        values.notificationType.includes("Heartbeat") &&
        (!values.heartbeatMinutes || !(values.heartbeatMinutes > 0))
      ) {
        formik.setFieldError("heartbeatMinutes", "Please insert valid Minutes");
        return;
      }
      if (
        values.notificationType.includes("Occupancy24h Alert") &&
        (!values.occupancy24hThreshold || !(values.occupancy24hThreshold > 0))
      ) {
        formik.setFieldError("occupancy24hThreshold", "Please insert threshold for occupancy 24h");
        return;
      }
      if (
        values.notificationType.includes("Basic Occupancy Alert") &&
        (!values.basicOccupancyThreshold || !(values.basicOccupancyThreshold > 0))
      ) {
        formik.setFieldError("basicOccupancyThreshold", "Please insert threshold for basic occupancy");
        return;
      }
      if (
        values.notificationType.includes("Occupancy Pro Alert") &&
        (!values.occupancyProThreshold || !(values.occupancyProThreshold > 0))
      ) {
        formik.setFieldError("occupancyProThreshold", "Please insert threshold for occupancy pro");
        return;
      }
      if (
        values.notificationType.includes("Frame Count") &&
        (!values.traceCountThreshold || !(values.traceCountThreshold > 0)) &&
        (!values.seenCountThreshold || !(values.seenCountThreshold > 0))
      ) {
        setThresholdError(
          "Please insert minimum one threshold for frame count"
        );
        return;
      }
      if (
        values.notificationType.includes("Match Rate") &&
        !(
          values.exactThreshold ||
          values.exactClusterThreshold ||
          values.exactClusterApproxThreshold
        )
      ) {
        setThresholdError("Please insert minimum one threshold for match rate");
        return;
      }
      if (
        values.notificationType.includes("VRM Count Notification") &&
        (!values.vrmCounter || !(values.vrmCounter > 0))
      ) {
        setThresholdError(
          "Please insert minimum one threshold for VRM Count Notification"
        );
        return;
      }
      await axios.post("/api/iqStats/editMultipleNotification", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      enqueueSnackbar("Notification added successfully.");
      cancelAdd();
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
    setThresholdError("");
    closeEditAllDialog();
    setEditAllNotificationTab(false);
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
      notificationType: [] as any,
      sites: [] as any,
      emailTemplateHeader: "",
      emailTemplateFooter: "",
      emailContacts: [] as any,
      receiver: "",
      heartbeatMinutes: "",
      traceCountThreshold: "",
      minimumDecodes:'',
      seenCountThreshold: "",
      exactThreshold: "",
      exactClusterThreshold: "",
      exactClusterApproxThreshold: "",
      occupancy24hThreshold:'',
      basicOccupancyThreshold:'',
      occupancyProThreshold:'',
      vrmCounter: "",
      disableFrom: "",
      disableTo: "",
    },
    validationSchema: AddSchema,
    onSubmit: handleSubmit,
  });
  const getSites = async ()=>{
    const {data} = await axios.get(`/api/iqStats/fetchNotificationSites?type=${selectedNotificationType.join()}&userType=${userLoginType}&email=${email}`,{
      headers: { authorization: "Bearer " + localStorage.getItem("token") }
    })


    setNotificationSettingAccessSites(data);
    
  }

  useEffect(()=>{
    if(selectedNotificationType[0]){

      getSites();
    }
    else{
      setNotificationSettingAccessSites([]);
    }
    
    
  },[selectedNotificationType])

  return (
    <Dialog
      open={editAllOpen}
      onClose={() => cancelAdd()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"md"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit  IQ Stats Notification`}</DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="space-between" wrap="wrap">
          
            <div className="--margin-bottom-large">
              <Label>Notification Type</Label>
              <MultiSelect
                placeholder="Please select notification type"
                multiplePlaceholder="notification types selected"
                allPlaceholder="All notification types selected"
                multi={false}
                style={{ width: "285px", height: "44px" }}
                options={notificationTypes.map((type: string) => ({
                  value: type,
                  label: type,
                }))}
                values={selectedNotificationType}
                onChange={async (values) => {
                setSelectedNotificationType(values);
                  formik.setFieldValue("notificationType", values);
                  
                }}
              />
              {formik.touched.notificationType &&
                formik.errors.notificationType && (
                  <Error>
                    {formik.touched.notificationType &&
                      formik.errors.notificationType}
                  </Error>
                )}
            </div>

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
                onChange={(values) => {
                  const normalizedSites = Formatter.normalizeSites(values);
                  setSelectedSites(normalizedSites);
                  formik.setFieldValue("sites", normalizedSites);
                }}
              />
              {formik.touched.sites && formik.errors.sites && (
                <Error>{formik.touched.sites && formik.errors.sites}</Error>
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
                <Error>setThresholdError
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
            {selectedNotificationType.includes("Heartbeat") ? (
              <div className="--margin-bottom-large">
                <Label>Min No. of Minutes Heartbeats Not Received</Label>
                <InputText
                  name="heartbeatMinutes"
                  id="heartbeatMinutes"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("heartbeatMinutes")}
                  value={formik.values.heartbeatMinutes}
                />
                {formik.touched.heartbeatMinutes &&
                  formik.errors.heartbeatMinutes && (
                    <Error>
                      {formik.touched.heartbeatMinutes &&
                        formik.errors.heartbeatMinutes}
                    </Error>
                  )}
              </div>
            ) : (
              ""
            )}

{selectedNotificationType.includes("Occupancy24h Alert") ? (
              <div className="--margin-bottom-large">
                <Label>Occupancy 24h Threshold(%)</Label>
                <InputText
                  name="occupancy24hThreshold"
                  id="occupancy24hThreshold"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("occupancy24hThreshold")}
                  value={formik.values.occupancy24hThreshold}
                />
                {formik.touched.occupancy24hThreshold &&
                  formik.errors.occupancy24hThreshold && (
                    <Error>
                      {formik.touched.occupancy24hThreshold &&
                        formik.errors.occupancy24hThreshold}
                    </Error>
                  )}
              </div>
            ) : (
              ""
            )}

{selectedNotificationType.includes("Basic Occupancy Alert") ? (
              <div className="--margin-bottom-large">
                <Label>Basic Occupancy Threshold(%)</Label>
                <InputText
                  name="basicOccupancyThreshold"
                  id="basicOccupancyThreshold"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("basicOccupancyThreshold")}
                  value={formik.values.basicOccupancyThreshold}
                />
                {formik.touched.basicOccupancyThreshold &&
                  formik.errors.basicOccupancyThreshold && (
                    <Error>
                      {formik.touched.basicOccupancyThreshold &&
                        formik.errors.basicOccupancyThreshold}
                    </Error>
                  )}
              </div>
            ) : (
              ""
            )}
            {selectedNotificationType.includes("Occupancy Pro Alert") ? (
              <div className="--margin-bottom-large">
                <Label>Occupancy Pro Threshold(%)</Label>
                <InputText
                  name="occupancyProThreshold"
                  id="occupancyProThreshold"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("occupancyProThreshold")}
                  value={formik.values.occupancyProThreshold}
                />
                {formik.touched.occupancyProThreshold &&
                  formik.errors.occupancyProThreshold && (
                    <Error>
                      {formik.touched.occupancyProThreshold &&
                        formik.errors.occupancyProThreshold}
                    </Error>
                  )}
              </div>
            ) : (
              ""
            )}
            {selectedNotificationType.includes("Frame Count") ? (
              <React.Fragment>
                <div className="--margin-bottom-large">
                  <Label>Trace Count Threshold</Label>
                  <InputText
                    name="traceCountThreshold"
                    id="traceCountThreshold"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("traceCountThreshold")}
                    value={formik.values.traceCountThreshold}
                  />
                  {formik.touched.traceCountThreshold &&
                    formik.errors.traceCountThreshold && (
                      <Error>
                        {formik.touched.traceCountThreshold &&
                          formik.errors.traceCountThreshold}
                      </Error>
                    )}
                </div>
                <div className="--margin-bottom-large">
                  <Label>Seen Count Threshold</Label>
                  <InputText
                    name="seenCountThreshold"
                    id="seenCountThreshold"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("seenCountThreshold")}
                    value={formik.values.seenCountThreshold}
                  />
                  {formik.touched.seenCountThreshold &&
                    formik.errors.seenCountThreshold && (
                      <Error>
                        {formik.touched.seenCountThreshold &&
                          formik.errors.seenCountThreshold}
                      </Error>
                    )}
                </div>
                <div className="--margin-bottom-large">
                  <Label>Minimum Decodes</Label>
                  <InputText
                    name="minimumDecodes"
                    id="minimumDecodes"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("minimumDecodes")}
                    value={formik.values.minimumDecodes}
                  />
                  {formik.touched.minimumDecodes &&
                    formik.errors.minimumDecodes && (
                      <Error>
                        {formik.touched.minimumDecodes &&
                          formik.errors.minimumDecodes}
                      </Error>
                    )}
                </div>
              </React.Fragment>
            ) : (
              ""
            )}

            
            {selectedNotificationType.includes("Match Rate") ? (
              <React.Fragment>
                <div className="--margin-bottom-large">
                  <Label>Exact Threshold(%)</Label>
                  <InputText
                    name="exactThreshold"
                    id="exactThreshold"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("exactThreshold")}
                    value={formik.values.exactThreshold}
                  />
                  {formik.touched.exactThreshold &&
                    formik.errors.exactThreshold && (
                      <Error>
                        {formik.touched.exactThreshold &&
                          formik.errors.exactThreshold}
                      </Error>
                    )}
                </div>
                <div className="--margin-bottom-large">
                  <Label>Exact + Cluster Threshold(%)</Label>
                  <InputText
                    name="exactClusterThreshold"
                    id="exactClusterThreshold"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() =>
                      formik.setFieldTouched("exactClusterThreshold")
                    }
                    value={formik.values.exactClusterThreshold}
                  />
                  {formik.touched.exactClusterThreshold &&
                    formik.errors.exactClusterThreshold && (
                      <Error>
                        {formik.touched.exactClusterThreshold &&
                          formik.errors.exactClusterThreshold}
                      </Error>
                    )}
                </div>
                <div className="--margin-bottom-large">
                  <Label>Exact + Cluster + Approx Threshold(%)</Label>
                  <InputText
                    name="exactClusterApproxThreshold"
                    id="exactClusterApproxThreshold"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={() =>
                      formik.setFieldTouched("exactClusterApproxThreshold")
                    }
                    value={formik.values.exactClusterApproxThreshold}
                  />
                  {formik.touched.exactClusterApproxThreshold &&
                    formik.errors.exactClusterApproxThreshold && (
                      <Error>
                        {formik.touched.exactClusterApproxThreshold &&
                          formik.errors.exactClusterApproxThreshold}
                      </Error>
                    )}
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
            {selectedNotificationType.includes("VRM Count Notification") ? (
              <div className="--margin-bottom-large">
                <Label>Min No. of VRM Count Threshold(%)</Label>
                <InputText
                  name="vrmCounter"
                  id="vrmCounter"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("vrmCounter")}
                  value={formik.values.vrmCounter}
                />
                {formik.touched.vrmCounter && formik.errors.vrmCounter && (
                  <Error>
                    {formik.touched.vrmCounter && formik.errors.vrmCounter}
                  </Error>
                )}
              </div>
            ) : (
              ""
            )}
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
          <Button text="Cancel" onClick={() => cancelAdd()} color="secondary" />
          <Button text="Submit" type="submit" loading={formik.isSubmitting} />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
