import React, { FC, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, Flex, MultiSelect } from "../../components";
import { FormikValues, useFormik } from "formik";
import { Formatter } from "../../utils";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { Col, notification, Row } from "antd";

interface MoveSnoozeProps {
  openSnooze: boolean;
  closeDialogSnooze: any;
  snoozeData: any;
  getNotificationData?: any;
  sites?: any;
  closeViwAllNotification?: any;
  type?: any;
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

export const MoveSnooze: FC<MoveSnoozeProps> = ({
  openSnooze,
  closeDialogSnooze,
  snoozeData,
  getNotificationData,
  sites,
  closeViwAllNotification,
  type,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [snoozeDays, setSnoozeDays] = useState<any>([1, 3, 7, 30]);
  const [selectedDay, setSelectedDay] = useState<any>("");
  const handleSubmit = async (values: FormikValues) => {
    try {
      if (values.snooze === "") {
        formik.setFieldError("snooze", "Please select one value");
        return;
      } else {
        var updateValues = {
          site: snoozeData.site,
          notification_id: snoozeData._id,
          status: "snooze",
          daysToSnooze: values.snooze[0],
          camera: snoozeData.camera,
          notificationType: snoozeData.type
            ? snoozeData.type
            : "Match Rate Alert",
          subNotification: snoozeData.notificationType ? snoozeData.notificationType : "NA",
        };

        const response = await axios.post(
          "/api/iqStats/allNotificationActionTaken",
          updateValues,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        getNotificationData(0);

        enqueueSnackbar("Notification moved to pending successfully.");
        formik.setFieldValue("snooze", "");
        close();
        if (type === "viewAllNotification") {
          closeViwAllNotification();
        }
      }
    } catch (e: any) {
      enqueueSnackbar(
        e?.response?.data?.message || e.message || "Something Went Wrong",
        { variant: "error" }
      );
      close();
      if (type === "viewAllNotification") {
        closeViwAllNotification();
      }
    }
  };

  const close = () => {
    closeDialogSnooze();
    formik.setFieldError("snooze", undefined);
  };

  const formik = useFormik({
    initialValues: {
      snooze: "",
    },
    // validationSchema: snoozeNotification,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={openSnooze}
      onClose={() => close()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"sm"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Snooze IQ Stats Notification`}</DialogTitle>
        <DialogContent>
          <Row className="--margin-bottom-large">
            <Col style={{ marginRight: "30px" }}>
              <Label style={{ fontSize: "16px" }}>
                How many days you want to snooze
              </Label>
            </Col>
            <Col>
              <MultiSelect
                placeholder="Please select days"
                options={
                  snoozeDays.map((day: any) => ({
                    value: day,
                    label: day + " Days",
                  })) || []
                }
                values={selectedDay}
                onChange={(values: any) => {
                  formik.setFieldValue("snooze", values);
                }}
                multi={false}
              />
            </Col>
            {formik.touched.snooze && formik.errors.snooze && (
              <Error>{formik.touched.snooze && formik.errors.snooze}</Error>
            )}
          </Row>
          <br />
          <Label
            style={{ fontSize: "16px" }}
          >{`You want to snooze this particular site or all the site?`}</Label>
        </DialogContent>
        <DialogActions className="pr-4">
          <Button text="Cancel" onClick={() => close()} color="secondary" />
          <Button text="Snooze" type="submit" />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
