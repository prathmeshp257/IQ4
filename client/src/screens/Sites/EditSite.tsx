import { FormikValues, setIn, useFormik } from "formik";
import React, { FC, useEffect, useState, useContext } from "react";
import { deviceDetect, isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex } from "../../components";
import { colors } from "../../utils/constants";
import {
  OperatorEditSchema,
  EditSchema,
} from "../../validationScheemas/SiteSchema";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import { AuthContext, SiteContext } from "../../context";
import { DatePicker } from "@mui/lab";
import moment from "moment";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import Tooltip from '@mui/material/Tooltip';
import { values } from "pdf-lib";
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

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

export const EditSite: FC<Props> = ({ editOpen, closeDialog, site }) => {
  const { userData } = useContext(AuthContext);
  const { reloadSitesData } = useContext(SiteContext);
  const userType = userData.userType;
  const email = userData.email;
  const siteToEdit = site;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [operators, setOperators] = useState<any>([]);
  const [minDate, setMinDate] = useState<any>(null);
  const [maxDate, setMaxDate] = useState<any>(null);
  const [priorityList, setPriorityList] = useState<any>();
  const [cameraData, setCameraData] = useState<any>([])
  const [urlRows, setUrlRows] = useState<any>([""]);
  const [errorUrl, setErrorUrl] = useState<any>([]);
  const [noUsername, setNoUserName] = useState(false)
  const [noPassword, setNoPassword] = useState(false);
  const [index, setIndex] = useState<any>()

  

  useEffect(() => {
    const getOperators = async () => {
      const { data } = await axios.get("/api/users/operators", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });
      setOperators(data);
    };
    getOperators();

    setPriorityList(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
  }, [userType]);


  const handleSubmit = async (values: FormikValues) => {
    try {
      values.plateTrack = values.plateTrack === "true" ? true : false 

      if (
        (values.contractStart && !values.contractEnd) ||
        (!values.contractStart && values.contractEnd)
      ) {
        formik.setFieldError("contractEnd", "both contract dates are required");
        return;
      }

      let notPassword = false;
      let notUsername = false;

      for (const [index, eachData] of cameraData.entries()) {

        if (eachData.username && !eachData.password) {
          notPassword = true;
          setIndex(index)
          setNoPassword(true)
          setNoUserName(false)
          break;
        }
        if (eachData.password && !eachData.username) {
          notUsername = true;
          setNoUserName(true);
          setNoPassword(false)
          setIndex(index)
          break;
        }
      
      }

      if (notUsername) {
        enqueueSnackbar("Please enter password for corresponding username.", {
          variant: "error",
        });
        return;
      }

      if (notPassword) {
        enqueueSnackbar("Please enter username for corresponding password.", {
          variant: "error",
        });
        return;
      }


      let filteredUrl = urlRows.filter((url: any) => url != "")
      values.id = Formatter.normalizeSite(siteToEdit._id);
      values.newId = Formatter.normalizeSite(values.name);
      values.name = Formatter.capitalize(values.name);
      values.cameraDetails = cameraData;
      values.forwardUrl = filteredUrl;
      if (values.contractStart && values.contractEnd) {
        values.contractStart = moment(values.contractStart).format(
          "DD-MM-YYYY"
        );
        values.contractEnd = moment(values.contractEnd).format("DD-MM-YYYY");
      }
    
      values.editedBy = userData.userType;
      values.spreadsheetUrl = values.spreadsheetUrl
      if (values.approxMatchVrmCorrectionAccess === "true") {
        values.approxMatchVrmCorrectionAccess = true
      }
      else {
        values.approxMatchVrmCorrectionAccess = false
      }
      if (values.vrmCorrectionPrefixAccess === true && !values.vrmCorrectionPrefix) {
        formik.setFieldError('vrmCorrectionPrefix', 'Please Enter Prefix Value');
        return;
      }

      if (values.vrmCorrectionPrefixAccess === true && !values.prefixDataForDays) {
        formik.setFieldError('prefixDataForDays', 'Please select days');
        return;
      }
      if(values.prefixDataForDays){
        values.prefixDataForDays = Number(values.prefixDataForDays)
      }
      

      await axios.put("/api/sites", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      enqueueSnackbar("Site updated successfully.");
      setCameraData([]);
      setUrlRows(['']);
      setNoUserName(false);
      setNoPassword(false);
      setIndex('');
      reloadSitesData();
    } catch (e: any) {
      enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
        variant: "error",
      });
    }
    cancelEdit();
  };


  const getcameraIP = async (siteData: any) => {
    const { data } = await axios.get(
      `/api/iqStats/getCamera?type=${userType}&email=${email}&site=${siteData._id}`,
      {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      }
    );


    let precamArray = [] as any;

    let hasPreviousCameraData = false;
    let previousCameraIp = [] as any;
    if (siteData.cameraDetails === undefined || siteData.cameraDetails.length === 0) {
      hasPreviousCameraData = false;
    }
    else {
      for (const eachCamera of siteData.cameraDetails) {
        previousCameraIp.push(eachCamera.cameraIP, eachCamera.username, eachCamera.password,eachCamera.isReversedMotion);
        hasPreviousCameraData = previousCameraIp.some((value: any) => value !== "")
      }
    }


    if (hasPreviousCameraData) {
      precamArray = siteData && siteData.cameraDetails ? siteData.cameraDetails : [{}];
      setCameraData(precamArray)

    } else {
      data.map((cam: any, index: any) => {
        precamArray.push({
          camera: cam._id.camera,
          MAC: cam._id.MAC,
          cameraIP: '',
          username: '',
          password: '',
          isReversedMotion:'false',
          cameraData: [{ url: '', interval: 'NA', title: "SaF status", username: '', password: '', isChecked: false },
          { url: '', interval: 'NA', title: "Camera health", username: '', password: '', isChecked: false },
          { url: '', interval: 'NA', title: "Led health", username: '', password: '', isChecked: false },
          { url: '', interval: 'NA', title: "Input health", username: '', password: '', isChecked: false }]
        })
      })
      setCameraData(precamArray)

    }
  }


  useEffect(() => {

    if (Object.keys(siteToEdit).length > 0) {
      getcameraIP(siteToEdit);
    }

    if (siteToEdit.forwardUrl && siteToEdit.forwardUrl[0]) {
      setUrlRows(site.forwardUrl)
    }

  }, [siteToEdit])


  const cancelEdit = () => {
    formik.resetForm();
    setCameraData([]);
    setUrlRows(['']);
    setErrorUrl([]);
    setIndex('');
    setNoUserName(false);
    setNoPassword(false)
    closeDialog();
  };

  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {

      name: siteToEdit && siteToEdit.name ? siteToEdit.name : "",
      capacity: siteToEdit && siteToEdit.capacity ? siteToEdit.capacity : 0,
      operatorId:
        siteToEdit && siteToEdit.operatorId
          ? siteToEdit.operatorId : "",
      status:
        siteToEdit && siteToEdit.status ? siteToEdit.status : "ONBOARDING",
      siteType: siteToEdit && siteToEdit.siteType ? siteToEdit.siteType : "ENTRY",
      contractStart:
        siteToEdit && siteToEdit.contractStart
          ? new Date(siteToEdit.contractStart)
          : null,
      contractEnd:
        siteToEdit && siteToEdit.contractEnd
          ? new Date(siteToEdit.contractEnd)
          : null,
      expiryTime:
        siteToEdit && siteToEdit.expiryTime ? siteToEdit.expiryTime : 0,
      postcode: siteToEdit && siteToEdit.postcode ? siteToEdit.postcode : "",
      apiAccess:
        siteToEdit && siteToEdit.apiAccess ? siteToEdit.apiAccess : false,
      manualCorrectionAccess: siteToEdit && siteToEdit.manualCorrectionAccess ? siteToEdit.manualCorrectionAccess : false,
      cameraApiAccess: siteToEdit && siteToEdit.cameraApiAccess ? siteToEdit.cameraApiAccess : false,
      vrmCorrectionAccess: siteToEdit && siteToEdit.vrmCorrectionAccess ? siteToEdit.vrmCorrectionAccess : false,
      vrmCorrectionPrefix: siteToEdit && siteToEdit.vrmCorrectionPrefix ? siteToEdit.vrmCorrectionPrefix : '',
      vrmCorrectionPrefixAccess: siteToEdit && siteToEdit.vrmCorrectionPrefixAccess ? siteToEdit.vrmCorrectionPrefixAccess : false,
      approxMatchVrmCorrectionAccess: siteToEdit && siteToEdit.approxMatchVrmCorrectionAccess && siteToEdit.approxMatchVrmCorrectionAccess === true ? "true" : "false",
      maxDurationApproxMatch: siteToEdit && siteToEdit.maxDurationApproxMatch ? siteToEdit.maxDurationApproxMatch : '',
      priority: siteToEdit && siteToEdit.priority ? siteToEdit.priority : "LOW",
      prefixDataForDays: siteToEdit && siteToEdit.prefixDataForDays ? String(siteToEdit.prefixDataForDays) : "",
      basicOccupancyCount:
        siteToEdit && siteToEdit.basicOccupancyCount
          ? siteToEdit.basicOccupancyCount
          : "",
      basicOccupancyDate:
        siteToEdit && siteToEdit.basicOccupancyDate
          ? dayjs(siteToEdit.basicOccupancyDate).tz('Europe/London').subtract(1, 'hour')
          : "",
      spreadsheetUrl: siteToEdit && siteToEdit.spreadsheetUrl ? siteToEdit.spreadsheetUrl :"",
      plateTrack: siteToEdit && siteToEdit.plateTrack  ? siteToEdit.plateTrack : false
    },
    validationSchema: userType === "Operator" ? OperatorEditSchema : EditSchema,
    onSubmit: handleSubmit,
  });
  
  const handleDateChange = (type: any, value: any) => {
    if (type === "start") {
      formik.setFieldValue("contractEnd", null);
      if (value) {
        formik.setFieldValue("contractStart", moment(value).toDate());
      } else {
        formik.setFieldValue("contractStart", null);
      }
    }
    if (type === "end") {
      if (value) {
        formik.setFieldValue("contractEnd", moment(value).toDate());
      } else {
        formik.setFieldValue("contractEnd", null);
      }
    }
  };
  useEffect(() => {
    setMinDate(moment(formik.values.contractStart).toDate());
    setMaxDate(moment(formik.values.contractStart).add(3, "year").toDate());
  }, [formik.values.contractStart]);


  const setCameraIP = (e: any, key: any) => {
    const modifiedCameraRows = [...cameraData];
    const value = e.target.value;
    modifiedCameraRows[key] = { ...modifiedCameraRows[key], cameraIP: value };
    setCameraData(modifiedCameraRows);
  }
  const setCameraUserName = (e: any, key: any) => {
    const modifiedCameraRows = [...cameraData];
    const value = e.target.value;
    let camData = modifiedCameraRows[key].cameraData.map((data: any) => {
      data.username = value
      return data
    })
    setIndex(key)
    cameraData.filter((data: any, index: any) => {
      if (index === key && !data.password && !value) {
        setNoPassword(false);
        setNoUserName(false)
      }
      if (index === key && (data.password && !value)) {
        setNoUserName(true)
      }

      if (index === key && (data.password && value)) {
        setNoPassword(false);
        setNoUserName(false)
      }
    })

    modifiedCameraRows[key] = { ...modifiedCameraRows[key], cameraData: camData, username: value };
    setCameraData(modifiedCameraRows);
  }

  const setReverseMotion = (e: any, key: any) => {
    const modifiedCameraRows = [...cameraData];
    const value = e.target.value;
    modifiedCameraRows[key] = { ...modifiedCameraRows[key], isReversedMotion: value };
    setCameraData(modifiedCameraRows);
  }

  const setCameraPassword = (e: any, key: any) => {
    const modifiedCameraRows = [...cameraData];
    const value = e.target.value;
    let camData = modifiedCameraRows[key].cameraData.map((data: any) => {
      data.password = value
      return data
    })
    modifiedCameraRows[key] = { ...modifiedCameraRows[key], cameraData: camData, password: value };

    setIndex(key)
    cameraData.filter((data: any, index: any) => {

      if (index === key && !data.username && !value) {
        setNoPassword(false);
        setNoUserName(false)
      }
      if (index === key && (data.username && !value)) {
        setNoPassword(true)
      }
      if (index === key && (data.username && value)) {
        setNoPassword(false);
        setNoUserName(false)
      }

    })
    


    setCameraData(modifiedCameraRows);
  }



  const URLbuttonsStyle = {
    display: "flex",
    height: "38px",
    cursor: "pointer",
    outline: "none",
    padding: "5px 0px",
    minWidth: "38px",
    borderRadius: "10px",
    justifyContent: "center",
    alignItems: "center",
    transition: "cubic-bezier(0.35, 0.94, 0.74, 0.39) 200ms",
  }

  const addURLRow = () => {
    const modifiedUrlRows = [...urlRows];
    if (urlRows[urlRows.length - 1] !== "" && !errorUrl.includes(false)) {
      modifiedUrlRows.push('');
      setUrlRows(modifiedUrlRows);
    } else {
      enqueueSnackbar("Please fill in valid URL", {
        variant: "error",
      });
    }

  }


  const deleteURLRow = (key: any) => {
    var modifiedUrlRows = [...urlRows];
    modifiedUrlRows = modifiedUrlRows.filter((value, index) => key !== index)
    let newurl = modifiedUrlRows.map((string: any) => {

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
    let newurl = modifiedUrlRows.map((string: any) => {

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

  



  return (
    <Dialog
      open={editOpen}
      onClose={() => cancelEdit()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"sm"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit Site`}</DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="center" wrap="wrap">
            <div className="--margin-bottom-large">
              <div className="--margin-bottom-large">
                <Label>Name</Label>
                <InputText
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="nope"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("name")}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <Error>{formik.touched.name && formik.errors.name}</Error>
                )}
              </div>

              <div className="--margin-bottom-large">
                <Label>Capacity</Label>
                <InputText
                  id="capacity"
                  name="capacity"
                  type="number"
                  autoComplete="nope"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("capacity")}
                  value={formik.values.capacity}
                />
                {formik.touched.capacity && formik.errors.capacity && (
                  <Error>
                    {formik.touched.capacity && formik.errors.capacity}
                  </Error>
                )}
              </div>

              <div className="--margin-bottom-large">
                <Label>Priority Status</Label>
                <select
                  name="priority"
                  id="priority"
                  style={{
                    width: `${isMobile ? "260px" : "455px"}`,
                    height: "44px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("priority")}
                >
                  {/* <option value="low">Low</option> */}
                  {priorityList &&
                    priorityList.length > 0 &&
                    priorityList.map((priorityList: any) => {
                      return (
                        <option
                          value={priorityList}
                          selected={
                            formik.initialValues.priority === priorityList
                          }
                        >
                          {priorityList}
                        </option>
                      );
                    })}
                </select>
                {formik.touched.priority && formik.errors.priority && (
                  <Error>
                    {formik.touched.priority && formik.errors.priority}
                  </Error>
                )}
              </div>
              <div className="--margin-bottom-large">
                <Label>Postcode</Label>
                <InputText
                  id="postcode"
                  name="postcode"
                  type="text"
                  autoComplete="nope"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("postcode")}
                  value={formik.values.postcode}
                />
                {formik.touched.postcode && formik.errors.postcode && (
                  <Error>
                    {formik.touched.postcode && formik.errors.postcode}
                  </Error>
                )}
              </div>
              <div >
                <Label>Expiry Time in Hours</Label>
                <InputText
                  id="expiryTime"
                  name="expiryTime"
                  type="number"
                  autoComplete="nope"
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("capacity")}
                  value={formik.values.expiryTime}
                />
                {formik.touched.expiryTime && formik.errors.expiryTime && (
                  <Error>
                    {formik.touched.expiryTime && formik.errors.expiryTime}
                  </Error>
                )}
              </div>
            </div>

            {userType === "Admin" ? (
              <div >

                <div className="--margin-bottom-large">
                  <Label>Operator</Label>
                  <select
                    name="operatorId"
                    id="operatorId"
                    style={{
                      width: `${isMobile ? "260px" : "455px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("operatorId")}
                  >
                    <option
                      value=""
                      selected={formik.initialValues.operatorId === ""}
                    >
                      Please Select Operator
                    </option>
                    {operators &&
                      operators.length > 0 &&
                      operators.map((eachOperator: any) => {
                        return (
                          <option
                            value={eachOperator._id}
                            selected={
                              formik.initialValues.operatorId ===
                              eachOperator._id
                            }
                          >
                            {eachOperator.email}
                          </option>
                        );
                      })}
                  </select>
                  {formik.touched.operatorId && formik.errors.operatorId && (
                    <Error>
                      {formik.touched.operatorId && formik.errors.operatorId}
                    </Error>
                  )}
                </div>
                <div className="--margin-bottom-large">
                  <Label>Status</Label>
                  <select
                    name="status"
                    id="status"
                    style={{
                      width: `${isMobile ? "260px" : "455px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("status")}
                  >
                    <option
                      value="ONBOARDING"
                      selected={formik.initialValues.status === "ONBOARDING"}
                    >
                      ONBOARDING
                    </option>
                    <option
                      value="ONLINE"
                      selected={formik.initialValues.status === "ONLINE"}
                    >
                      ONLINE
                    </option>
                    <option
                      value="OFFLINE"
                      selected={formik.initialValues.status === "OFFLINE"}
                    >
                      OFFLINE
                    </option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <Error>
                      {formik.touched.status && formik.errors.status}
                    </Error>
                  )}
                </div>

                <div className="--margin-bottom-large">
                  <Label>Previous Basic Occupancy Record</Label>
                  <select

                    name="previousBasicOccupancyRecord"
                    id="previousBasicOccupancyRecord"
                    style={{
                      width: `${isMobile ? "260px" : "455px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    {siteToEdit.basicOccupancyData ? siteToEdit.basicOccupancyData.map((data: any, index: any) => {
                      return <option value={index}>
                        {`Count: ${data.basicOccupancyCount}` + '\xa0\xa0\xa0\xa0\xa0' + `Date: ${dayjs(data.basicOccupancyDate).tz('Europe/London').format('DD-MM-YYYY HH:mm')}` + '\xa0\xa0\xa0\xa0\xa0' + `Updated On: ${dayjs(data.when).tz('Europe/London').format('DD-MM-YYYY HH:mm')}`}
                      </option>
                    }) : <option>No Previous Record</option>}

                  </select>
                </div>

                <div className="--margin-bottom-large">
                  <Label>Type</Label>
                  <select
                    name="siteType"
                    id="siteType"
                    style={{
                      width: `${isMobile ? "260px" : "455px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("siteType")}
                  >
                    <option
                      value="ENTRY"
                      selected={formik.initialValues.siteType === "ENTRY"}
                    >
                      Pay On Entry
                    </option>
                    <option
                      value="EXIT"
                      selected={formik.initialValues.siteType === "EXIT"}
                    >
                      Pay On Exit
                    </option>
                    <option
                      value="OTHER"
                      selected={formik.initialValues.siteType === "OTHER"}
                    >
                      Others
                    </option>
                  </select>
                  {formik.touched.siteType && formik.errors.siteType && (
                    <Error>
                      {formik.touched.siteType && formik.errors.siteType}
                    </Error>
                  )}
                </div>
  
              </div>
            ) : (
              ""
            )}
            
            <div className="--margin-bottom-large" style={{width:"455px"}}>	
							<Label>Store Plate Track</Label>
							<div style={{fontSize:"15px" ,textAlign:"left",marginTop:"10px"}} 
								onChange={(e) => {
									formik.handleChange(e)
								
								}}
							>
								<label style={{ cursor: "pointer" }}>
									<input type="radio" name="plateTrack" defaultChecked = {formik.values.plateTrack == false} value="false" id="false" style={{ marginRight: "5px" }} />
									False
								</label>
								<label style={{ cursor: "pointer" }}>
									<input style={{ marginLeft: "50px", marginRight: "5px" }} defaultChecked = {formik.values.plateTrack == true} type="radio" name="plateTrack" value="true" id="true" />
									True
								</label>
							</div>		
						</div>



            {(userType === "Admin" || (userData.siteInfoAccess && userData.siteInfoAccessSites.includes(siteToEdit._id))) &&
              <Flex
                direction="row"
                justify="space-between"
                align="flex-start"
                style={{ width: "455px" }}
                className="--margin-top-large"
              >
                <div className="--margin-bottom-large">
                  <TextField
                    label="Basic Occupancy Count"
                    id="basicOccupancyCount"
                    name="basicOccupancyCount"
                    type="number"
                    placeholder="Basic Occupancy Count"
                    autoComplete="nope"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                    onBlur={() =>
                      formik.setFieldTouched("basicOccupancyCount")
                    }
                    value={formik.values.basicOccupancyCount}
                  />
                  {formik.touched.basicOccupancyCount &&
                    formik.errors.basicOccupancyCount && (
                      <Error>
                        {formik.touched.basicOccupancyCount &&
                          formik.errors.basicOccupancyCount}
                      </Error>
                    )}
                </div>

                <div className="--margin-bottom-large">
                  <TextField
                    label="Basic Occupancy Date/Time"
                    id="basicOccupancyDate"
                    type="datetime-local"
                    name="basicOccupancyDate"
                    onChange={formik.handleChange}
                    onBlur={() =>
                      formik.setFieldTouched("basicOccupancyDate")
                    }
                    sx={{ width: 200 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={dayjs(formik.values.basicOccupancyDate).format("YYYY-MM-DDTHH:mm:ss")}
                  />
                  {formik.touched.basicOccupancyDate &&
                    formik.errors.basicOccupancyDate && (
                      <Error>
                        {formik.touched.basicOccupancyDate &&
                          formik.errors.basicOccupancyDate}
                      </Error>
                    )}
                </div>
              </Flex>
            }

            {userType === "Admin" ? (
              <React.Fragment>

                <div
                  className="--margin-bottom-large"
                  style={{ marginRight: "auto", marginLeft: "8%" }}
                >
                  <input
                    id="apiAccess"
                    name="apiAccess"
                    type="checkbox"
                    style={{ width: "12px", height: "12px" }}
                    autoComplete="nope"
                    onChange={formik.handleChange}
                    defaultChecked={formik.values.apiAccess}
                  />
                  <label htmlFor="apiAccess"> MMC/CO2/VAL Access</label>
                </div>

                <div
                  className="--margin-bottom-large"
                  style={{ marginRight: "auto", marginLeft: "8%" }}
                >
                  <input
                    id="manualCorrectionAccess"
                    name="manualCorrectionAccess"
                    type="checkbox"
                    style={{ width: "12px", height: "12px" }}
                    autoComplete="nope"
                    onChange={formik.handleChange}
                    defaultChecked={formik.values.manualCorrectionAccess}
                  />
                  <label htmlFor="manualCorrectionAccess"> Manual Correction Access</label>
                </div>
                <div
                  className="--margin-bottom-large"
                  style={{ marginRight: "auto", marginLeft: "8%" }}
                >
                  <input
                    id="vrmCorrectionAccess"
                    name="vrmCorrectionAccess"
                    type="checkbox"
                    style={{ width: "12px", height: "12px" }}
                    autoComplete="nope"
                    onChange={(e) => {
                      formik.setFieldValue('vrmCorrectionAccess', e.target.checked);
                      if (!e.target.checked) {
                        formik.setFieldValue('approxMatchVrmCorrectionAccess', 'false')

                      }
                    }
                    }
                    defaultChecked={formik.values.vrmCorrectionAccess}
                  />
                  <label htmlFor="vrmCorrectionAccess"> VRM Correction Access</label>
                </div>
                <div
                  className="--margin-bottom-large"
                  style={{ marginRight: "auto", marginLeft: "12%" }}
                >
                  <input
                    id="vrmCorrectionPrefixAccess"
                    name="vrmCorrectionPrefixAccess"
                    type="checkbox"
                    style={{ width: "12px", height: "12px" }}
                    autoComplete="nope"
                    onChange={(e) => {
                      formik.setFieldValue('vrmCorrectionPrefixAccess', e.target.checked);
                      if (!e.target.checked) {
                        formik.setFieldValue('vrmCorrectionPrefix', '')
                        formik.setFieldValue('prefixDataForDays', '')
                      }
                    }
                    }
                    defaultChecked={formik.values.vrmCorrectionPrefixAccess}
                  />
                  <label htmlFor="vrmCorrectionPrefixAccess"> VRM Correction Prefix Access</label>
                </div>
                <div
                  className="--margin-bottom-large"
                  style={{ marginRight: "auto", marginLeft: "8%" }}
                >
                  <input
                    id="cameraApiAccess"
                    name="cameraApiAccess"
                    type="checkbox"
                    style={{ width: "12px", height: "12px" }}
                    autoComplete="nope"
                    onChange={formik.handleChange}
                    defaultChecked={formik.values.cameraApiAccess}
                  />
                  <label htmlFor="cameraApiAccess"> Camera API Call Access</label>
                </div>
                {
                  formik.values.vrmCorrectionPrefixAccess === true &&
                  <div style={{display: "flex", justifyContent: 'space-between', width: "455px"}} >
                    <div className="--margin-bottom-large">
                      <Label>VRM Correction Prefix</Label>
                      <InputText
                      style={{ minWidth: "200px", maxWidth: '200px' }}
                        id="vrmCorrectionPrefix"
                        name="vrmCorrectionPrefix"
                        type="text"
                        autoComplete="nope"
                        onChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("vrmCorrectionPrefix")}
                        value={formik.values.vrmCorrectionPrefix}
                      />
                      {formik.touched.vrmCorrectionPrefix && formik.errors.vrmCorrectionPrefix && (
                        <Error>
                          {formik.touched.vrmCorrectionPrefix && formik.errors.vrmCorrectionPrefix}
                        </Error>
                      )}
                    </div>

                    <div className="--margin-bottom-large">
                      <Label>Send data for last number of days</Label>
                      <select
                        name="prefixDataForDays"
                        id="prefixDataForDays"
                        style={{
                          minWidth: "200px", maxWidth: '200px',
                          height: "44px",
                          borderRadius: "10px",
                          textAlign: "center",
                        }}
                        onChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("prefixDataForDays")}
                      >
                        <option
                          value="1"
                          selected={formik.values.prefixDataForDays === "1"}
                        >
                          1 Day
                        </option>
                        <option
                          value="3"
                          selected={formik.values.prefixDataForDays === "3"}
                        >
                          3 Days
                        </option>
                        <option
                          value="7"
                          selected={formik.values.prefixDataForDays === "7"}
                        >
                          7 Days
                        </option>
                        <option
                          value="15"
                          selected={formik.values.prefixDataForDays === "15"}
                        >
                          15 Days
                        </option>
                        <option
                          value="30"
                          selected={formik.values.prefixDataForDays === "30"}
                        >
                          30 Days
                        </option>
                      </select>
                      {formik.touched.prefixDataForDays && formik.errors.prefixDataForDays && (
                        <Error>
                          {formik.touched.prefixDataForDays && formik.errors.prefixDataForDays}
                        </Error>
                      )}
                    </div>
                  </div>



                }

                {
                  formik.values.vrmCorrectionAccess === true &&

                  <div className="--margin-bottom-large">
                    <Label htmlFor="approxMatchVrmCorrectionAccess">Approx Match VRM Correction Access</Label>
                    <select
                      name="approxMatchVrmCorrectionAccess"
                      id="approxMatchVrmCorrectionAccess"
                      style={{
                        width: `${isMobile ? "260px" : "455px"}`,
                        height: "44px",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched("approxMatchVrmCorrectionAccess")}
                    >
                      <option
                        value="false"
                        selected={formik.values.approxMatchVrmCorrectionAccess === "false"}
                      >
                        FALSE
                      </option>
                      <option
                        value="true"
                        selected={formik.values.approxMatchVrmCorrectionAccess === "true"}
                      >
                        TRUE
                      </option>
                    </select>
                    {formik.touched.approxMatchVrmCorrectionAccess && formik.errors.approxMatchVrmCorrectionAccess && (
                      <Error>
                        {formik.touched.approxMatchVrmCorrectionAccess && formik.errors.approxMatchVrmCorrectionAccess}
                      </Error>
                    )}
                  </div>
                }



              </React.Fragment>
            ) : (
              ""
            )}

            {formik.values.vrmCorrectionAccess === true && ((formik.values.approxMatchVrmCorrectionAccess === 'true' && (userType === "Admin" || userType === "Operator" || userType === "Collaborator"))) ?
              <div className="--margin-bottom-large" >
                <Label>Approx Match Max Duration For VRM Correction (mins)</Label>
                <InputText
                  type="number"
                  value={formik.values.maxDurationApproxMatch}
                  onChange={formik.handleChange}
                  name="maxDurationApproxMatch"
                />
                {formik.touched.maxDurationApproxMatch && formik.errors.maxDurationApproxMatch && (
                  <Error>
                    {formik.touched.maxDurationApproxMatch && formik.errors.maxDurationApproxMatch}
                  </Error>
                )}
              </div> : ''

            }
            {userType === "Admin" ? (
              <React.Fragment>
                <Flex
                  direction="row"
                  justify="space-between"
                  align="flex-start"
                  style={{ width: "455px" }}
                >
                  <div className="--margin-bottom-small" style={{ width: `200px` }}>
                    <Label>Contract Start Date</Label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <div
                        onBlur={() => formik.setFieldTouched("contractStart")}
                      >
                        <DatePicker
                          label=""
                          clearable={true}
                          openTo="year"
                          views={["year", "month", "day"]}
                          allowSameDateSelection={true}
                          inputFormat="dd/MM/yyyy"
                          value={formik.values.contractStart}
                          onChange={(newValue) =>
                            handleDateChange("start", newValue)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                    </LocalizationProvider>
                  </div>
                  <div className="--margin-bottom-large" style={{ width: `200px` }}>
                    <Label>Contract End Date</Label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <div className="--margin-bottom-large" onBlur={() => formik.setFieldTouched("contractEnd")}>
                        <DatePicker
                          disabled={!!!formik.values.contractStart}
                          label=""
                          clearable={true}
                          openTo="year"
                          views={["year", "month", "day"]}
                          allowSameDateSelection={true}
                          minDate={minDate}
                          maxDate={maxDate}
                          inputFormat="dd/MM/yyyy"
                          value={formik.values.contractEnd}
                          onChange={(newValue) =>
                            handleDateChange("end", newValue)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                    </LocalizationProvider>
                  </div>
                </Flex>
                {(formik.touched.contractStart &&
                  formik.touched.contractEnd &&
                  formik.errors.contractEnd &&
                  formik.errors.contractStart && (
                    <Error>* contract start and end date are required</Error>
                  )) ||
                  (formik.touched.contractStart &&
                    formik.errors.contractStart && (
                      <Error>
                        {formik.touched.contractStart &&
                          formik.errors.contractStart}
                      </Error>
                    )) ||
                  (formik.touched.contractEnd && formik.errors.contractEnd && (
                    <Error>
                      {formik.touched.contractEnd && formik.errors.contractEnd}
                    </Error>
                  ))}
              </React.Fragment>) : ("")}

            {
              (userType === "Admin" || (userData.siteInfoAccess && userData.siteInfoAccessSites.includes(siteToEdit._id))) &&
              cameraData.map((cameraRow: any, key: any) => (
                <div key={key}>
                  <div style={{ alignItems: 'flex-start', display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>
                    <div>
                      <Label>Camera Name</Label>
                      <Tooltip title={`MAC Address: ${cameraRow.MAC}`} arrow placement="top">
                        <InputText
                          disabled
                          style={{ minWidth: "200px", maxWidth: '200px' }}
                          type="text"
                          value={cameraRow.camera}
                          name="mac"
                        />
                      </Tooltip>

                    </div>
                    <div >
                      <Label>Camera IP</Label>
                      <InputText
                        style={{ minWidth: "200px", maxWidth: '200px' }}
                        type="text"
                        value={cameraRow.cameraIP}
                        onChange={(e) => { setCameraIP(e, key) }}
                        name="CameraIP"
                      />
                    </div>
                  </div>
                  <div style={{ alignItems: 'flex-start', display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>
                    <div>
                      <Label>User Name</Label>
                      <InputText
                        style={{ minWidth: "200px", maxWidth: '200px' }}
                        type="text"
                        onChange={(e) => { setCameraUserName(e, key) }}
                        value={cameraRow.username}
                        name="userName"
                      />

                      {(noUsername && (index === key)) && (
                        <Error>
                          Please enter username
                        </Error>
                      )}
                    </div>
                    <div >
                      <Label>Password</Label>
                      <InputText
                        style={{ minWidth: "200px", maxWidth: '200px' }}
                        type="password"
                        value={cameraRow.password}
                        onChange={(e) => { setCameraPassword(e, key) }}
                        name="password"
                      />

                      {(noPassword && (index === key)) && (
                        <Error>
                          Please enter password
                        </Error>
                      )}
                    </div>
                  </div>

                  <div style={{ alignItems: 'flex-start', display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>


                  <div className="--margin-bottom-large">
                  <Label>Is Reversed Motion</Label>
                  <select
                    name="isReversedMotion"
                    id="isReversedMotion"
                    style={{
                      width: `${isMobile ? "260px" : "455px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    onChange={(e)=>setReverseMotion(e, key)}
                    onBlur={() => formik.setFieldTouched("isReversedMotion")}
                  >
                    <option
                      value="false"
                      selected={cameraRow.isReversedMotion === "false"}
                    >
                      FALSE
                    </option>
                    <option
                      value="true"
                      selected={cameraRow.isReversedMotion === "true"}
                    >
                      TRUE
                    </option>
                  </select>

                </div>
                </div>
                </div>

              ))
            }


            {
              (userType === "Admin" || ((userData.siteInfoAccess && userData.siteInfoAccessSites.includes(siteToEdit._id)) && (userData.forwardsAccess && userData.forwardsAccessSites.includes(siteToEdit._id)))) &&
              urlRows.map((urlRow: any, key: any) => (

                <div style={{ display: "flex", justifyContent: 'space-between', width: "455px" }} className="--margin-bottom-large" key={key}>
                  <div>
                    <Label>VRM Correction URL</Label>
                    <InputText
                      style={{ minWidth: urlRows.length > 1 ? "360px" : '400px', maxWidth: urlRows.length > 1 ? "360px" : '400px' }}
                      type="text"
                      key={key}
                      value={urlRows[key]}
                      onChange={(e) => { setUrl(e, key) }}
                      name="url"

                    />
                    {errorUrl[key] === false && (
                      <Error>Invalid URl</Error>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '22px' }}>
                    {(urlRows.length - 1) === key && <button
                      type="button"
                      className="button--filled"
                      style={{ ...URLbuttonsStyle, marginRight: urlRows.length > 1 ? '10px' : '0px' }}
                      onClick={() => addURLRow()}
                    > + </button>}
                    {urlRows.length > 1 &&
                      <button
                        className="button--filled"
                        type="button"
                        style={URLbuttonsStyle}
                        onClick={() => deleteURLRow(key)}
                      > - </button>}
                  </div>


                </div>
              ))

            }
            <div>
									<Label>Spreadsheet URL</Label>
							        <InputText
								      id="spreadsheetUrl"
								      name="spreadsheetUrl"
								      type="text"
								      autoComplete="nope"
								      onChange={formik.handleChange}
								      onBlur={() => {const pattern = new RegExp(
                        // URL validation regular expression
                        /^(https?:\/\/)?((([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{2,})|((\d{1,3}\.){3}\d{1,3}))(\/\S*)?$/
                      );
                      if (formik.values.spreadsheetUrl === "" || pattern.test(formik.values.spreadsheetUrl)) {
                        formik.setFieldError('spreadsheetUrl','');
                      } else {
                        formik.setFieldError('spreadsheetUrl','Enter valid URL');
                      }}}
                      
                  
                      value={formik.values.spreadsheetUrl}
                      
								      
							        />
                      {formik.touched.spreadsheetUrl && formik.errors.spreadsheetUrl && (
                  <Error>{formik.touched.spreadsheetUrl && formik.errors.spreadsheetUrl}</Error>
                )}
									</div>
                        
							


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
