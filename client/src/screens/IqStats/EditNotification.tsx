import React, { FC, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, Flex } from "../../components";
import { FormikValues, useFormik } from "formik";
import { EditSchema } from "../../validationScheemas/IqNotificationSchema";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";

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
  const [thresholdError, setThresholdError] = useState<any>("");

  const handleSubmit = async (values: FormikValues) => {
    try {
      values._id = editData._id;
      values.createdBy = editData.createdBy;
      values.userType = editData.userType;
      values.emailTemplateHeader = emailTemplateHeader;
      values.emailTemplateFooter = emailTemplateFooter;
      values.emailContacts = values.emailContacts.filter(
        (val: any) => val !== ""
      );
      if (
        values.type === "Heartbeat" &&
        (!values.heartbeatMinutes || !(values.heartbeatMinutes > 0))
      ) {
        formik.setFieldError("heartbeatMinutes", "Please insert valid Minutes");
        return;
      }
      if (
        values.type === "Frame Count" &&
        (!values.traceCountThreshold || !(values.traceCountThreshold > 0)) &&
        (!values.seenCountThreshold || !(values.seenCountThreshold > 0))
      ) {
        setThresholdError(
          "Please insert minimum one threshold for frame count"
        );
        return;
      }
      if (
        values.type === "Match Rate" &&
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
        values.type === "VRM Counter Notification" &&
        (!values.vrmCounter || !(values.vrmCounter > 0))
      ) {
        formik.setFieldError(
          "VRM Counter Notification",
          "Please insert valid %"
        );
        return;
      }

      await axios.put("/api/iqStats/editNotification", values, {
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
      type: "",
      site: "" as any,
      emailTemplateHeader: "",
      emailTemplateFooter: "",
      emailContacts: [] as any,
      receiver: "",
      heartbeatMinutes: "",
      traceCountThreshold: "",
      seenCountThreshold: "",
      minimumDecodes:'',
      exactThreshold: "",
      exactClusterThreshold: "",
      occupancy24hThreshold:'',
      basicOccupancyThreshold:'',
      occupancyProThreshold:'',
      exactClusterApproxThreshold: "",
      vrmCounter: "",
	  disableFrom:'',
	  disableTo:''
    },
    validationSchema: EditSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (editData) {
      formik.setValues({
        type: editData.type || "",
        site: editData.site ? Formatter.normalizeSite(editData.site) : "",
        emailTemplateHeader: "",
        emailTemplateFooter: "",
        emailContacts: editData.emailContacts || [],
        heartbeatMinutes: editData.heartbeatMinutes || "",
        receiver: editData.receiver || "",
        occupancy24hThreshold: editData.occupancy24hThreshold || '',
        basicOccupancyThreshold: editData.basicOccupancyThreshold ||'',
        occupancyProThreshold: editData.occupancyProThreshold || '',
        traceCountThreshold: editData.traceCountThreshold || "",
        seenCountThreshold: editData.seenCountThreshold || "",
        minimumDecodes:editData.minimumDecodes || '',
        exactThreshold: editData.exactThreshold || "",
        exactClusterThreshold: editData.exactClusterThreshold || "",
        exactClusterApproxThreshold: editData.exactClusterApproxThreshold || "",
        vrmCounter: editData.vrmCounter || "",
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
        <DialogTitle>{`Edit IQ Stats Notification`}</DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="space-between" wrap="wrap">
            <div className="--margin-bottom-large">
              <Label>Site</Label>
              <InputText
                type="text"
                name="site"
                value={formik.values.site}
                disabled
              />
            </div>
            <div className="--margin-bottom-large">
              <Label>Notification Type</Label>
              <InputText
                type="text"
                name="type"
                value={formik.values.type}
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
            {formik.values.type === "Heartbeat" ? (
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

{formik.values.type === "Occupancy24h Alert" ? (
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

{formik.values.type === "Basic Occupancy Alert" ? (
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
            {formik.values.type ==="Occupancy Pro Alert" ? (
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
            {formik.values.type === "Frame Count" ? (
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
            {formik.values.type === "Match Rate" ? (
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
            {formik.values.type === "VRM Counter Notification" ? (
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
            {formik.values.type === "Match Rate" ||
            formik.values.type === "Frame Count" ? (
              <div style={{ width: "100%" }}>
                {thresholdError && <Error>{thresholdError}</Error>}
              </div>
            ) : (
              ""
            )}
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
