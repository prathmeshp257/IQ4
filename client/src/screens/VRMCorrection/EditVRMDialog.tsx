import React, { FC, useState, useContext, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, Flex } from "../../components";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { FormikValues, useFormik } from "formik";
import { AuthContext } from "../../context";
import { ViewVRM } from "./ViewVRM";
import ProgressBar from "../../screens/Reports/ProgressBar";



interface editVRMProps {
  dialogOpen: boolean;
  closeAndGetData: any;
  setEditVRMData: any;
  closeDialog: any;
  editVRMData: any;
  stopTimer: any;
  time: any;
  setTime: any;
  site: any
  ;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    maxHeight: "75vh",
    maxWidth: "650px",
  },
}));

const Form = styled.form`
  width: 100%;
`;

const Error = styled.label`
  font-size: 12px;
  color: red;
  display: ${(e) => (e ? "block" : "none")};
  margin-top: 10px;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
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

export const EditVRM: FC<editVRMProps> = ({
  dialogOpen,
  closeAndGetData,
  setEditVRMData,
  closeDialog,
  editVRMData,
  stopTimer,
  time,
  setTime,
  site


}) => {


  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [imageUrl, setImageUrl] = useState('');
  const [openDialog, setDialogOpen] = useState(false);
  const [vrmType, setVRMType] = useState('');
  const { userData } = useContext(AuthContext);
  const [type, setType] = useState('');
  const [previousVRM, setPreviousVRM] = useState('');
  const [loading, setLoading] = useState(false)

  const vrm = editVRMData ? editVRMData.vrm : '';
  const targetVRM = editVRMData.targetId ? editVRMData.targetId.vrm : '';
  const clusterVRM = editVRMData.clusterId ? editVRMData.clusterId.vrm : '';
  const plate = editVRMData ? editVRMData.plate : '';
  const targetPlate = editVRMData.targetId ? editVRMData.targetId.plate : '';
  const clusterPlate = editVRMData.clusterId ? editVRMData.clusterId.plate : '';
  const overview = editVRMData ? editVRMData.overview : '';
  const targetOverview = editVRMData.targetId ? editVRMData.targetId.overview : '';
  const clusterOverview = editVRMData.clusterId ? editVRMData.clusterId.overview : '';


  const checkIfVRMCorrectedBefore = async (vrm: any) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/vrmCorrection/vrmCorrectedBefore?site=${site}&vrm=${vrm.join()}&email=${userData.email}&type=${userData.userType}`, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") }
      })

      let prevrm = data && data[0] && data[0].vrm ? data[0].vrm : ''
      setPreviousVRM(prevrm)

    } catch (error) {
      console.log(error);

    }
    setLoading(false)

  }

  useEffect(() => {
    if (Object.keys(editVRMData).length > 0) {
      let vrms = [];
      if (editVRMData && (editVRMData.clusterId && editVRMData.targetId)) {
        vrms = [editVRMData.clusterId.vrm, editVRMData.targetId.vrm]
      } else if (editVRMData && (editVRMData.decode_in && editVRMData.decode_out)) {
        vrms = [editVRMData.decode_in.vrm, editVRMData.decode_out.vrm]
      } else {
        vrms = [editVRMData.vrm]
      }
      checkIfVRMCorrectedBefore(vrms)
    }
  }, [editVRMData])


  const handleSubmit = async (values: FormikValues) => {
    try {
      if (editVRMData && (editVRMData.clusterId && editVRMData.targetId)) {

        if (values.vrmType === 'cluster') {
          values.vrmIds = [editVRMData.clusterId._id]
        } else if (values.vrmType === 'target') {

          values.vrmIds = [editVRMData.targetId._id]
        } else if (values.vrmType === 'both') {

          values.vrmIds = [editVRMData.targetId._id, editVRMData.clusterId._id]
        }

        values.format = 'submit';

      } else if (editVRMData && (editVRMData.decode_in && editVRMData.decode_out)) {

        values.vrmIds = [editVRMData.decode_in._id, editVRMData.decode_out._id]
        values.date = editVRMData.decode_in.when;
        values.id = editVRMData._id;
        values.format = "approxEdit";

      } else {

        values.vrmIds = [editVRMData._id]
        values.format = 'submit';

      }

      values.email = userData.email;
      values.type = userData.userType;
      values.site = site;
      values.vrmCorrectionTimeTaken = time;
      values.correctedVRM = values.correctedVRM.toUpperCase()
      


      if (values.correctedVRM === "") {
        formik.setFieldError('correctedVRM', "Please add value");
        return;
      }
      if (editVRMData && (editVRMData.clusterId && editVRMData.targetId)) {
        if (values.vrmType === '') {
          formik.setFieldError('vrmType', "Please select vrm type");
          return;
        }
      }

      const {data} = await axios.post(`/api/vrmCorrection/editVrm`, values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") }
      })

      close();

      for(const eachResponse of data.response){
        if(eachResponse.status === 200){
            enqueueSnackbar(`VRM data sent succefully to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "success" });
          }else{
            enqueueSnackbar(`VRM Corrected but VRM sending failed to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "error" });
          }
    }

    } catch (error) {

    }
  }

  useEffect(() => {
    formik.setValues({
      correctedVRM: previousVRM ? previousVRM : "",
      vrmType: ''
    })
  }, [previousVRM])

  const formik = useFormik({
    initialValues: {
      correctedVRM: "",
      vrmType: ''
    },
    onSubmit: handleSubmit,
  });

  const close = () => {
    setEditVRMData({})
    closeAndGetData();
    formik.setFieldValue("vrmType", '');
    clearInterval(stopTimer);
    setTime(0);
    setPreviousVRM("");
    formik.setFieldValue('correctedVRM', '')
  }

  const cancel = () => {
    closeDialog(false)
    setEditVRMData({})
    formik.setFieldValue("vrmType", '');
    clearInterval(stopTimer);
    setPreviousVRM('');
    setTime(0);
    formik.setFieldValue('correctedVRM', '')

  }



  return (
    <Dialog
      open={dialogOpen}
      onClose={() => cancel()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"sm"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit VRM`}</DialogTitle>
        <DialogContent>

          {loading ? <div
            style={{
              height: "300px",
              width: "100%",
              textAlign: "center",
              padding: "auto",
            }}
          >
            <ProgressBar />
          </div> :
            (editVRMData.targetId && editVRMData.clusterId) ?
              <Flex direction="row" justify="space-between" wrap="wrap">
                <div>
                  <div className="--margin-bottom-large">
                    <Label>Target VRM</Label>
                    <InputText
                      disabled
                      name="vrm"
                      type="text"
                      autoComplete="nope"
                      value={targetVRM}
                    />
                  </div>
                  <div style={{ width: '' }} className="--margin-bottom-large">
                    <Label>Target VRM Plate Patch</Label>
                    <img
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={44}
                      style={{
                        borderRadius: '10px',
                        cursor: 'pointer'

                      }}
                      src={`data:image/jpeg;base64, ${targetPlate}`}
                      onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${targetPlate}`); }}
                      alt="Target VRM Plate Patch" />

                  </div>
                  <div className="--margin-bottom-large">
                    <Label>Target VRM Overview</Label>
                    <img
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={200}
                      style={{
                        cursor: 'pointer'
                      }}
                      src={targetOverview}
                      onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(targetOverview); }}
                      alt="Target VRM Overview" />

                  </div>

                  <div className="--margin-bottom-large">
                    <Label>Edit VRM</Label>
                    <InputText
                      id="correctedVRM"
                      name="correctedVRM"
                      type="text"
                      autoComplete="nope"
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched("correctedVRM")}
                      value={formik.values.correctedVRM}
                    />

                  </div>
                  {formik.touched.correctedVRM && formik.errors.correctedVRM && (
                    <Error>{formik.touched.correctedVRM && formik.errors.correctedVRM}</Error>
                  )}
                </div>

                <div>
                  <div className="--margin-bottom-large">
                    <Label>Cluster VRM</Label>
                    <InputText
                      disabled
                      name="clusterVRM"
                      type="text"
                      autoComplete="nope"
                      value={clusterVRM}
                    />

                  </div>

                  <div className="--margin-bottom-large">
                    <Label>Cluster VRM Plate Patch</Label>
                    <img
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={44}
                      style={{
                        borderRadius: '10px',
                        cursor: 'pointer'

                      }}
                      src={`data:image/jpeg;base64, ${clusterPlate}`}
                      onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${clusterPlate}`); }}
                      alt="Cluster VRM Plate Patch" />

                  </div>
                  <div className="--margin-bottom-large">
                    <Label>Cluster VRM Overview</Label>
                    <img
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={200}
                      style={{
                        cursor: 'pointer'
                      }}
                      src={clusterOverview}
                      onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(clusterOverview); }}
                      alt="Cluster VRM Overview" />

                  </div>


                  <div className="--margin-bottom-large">
                    <Label>Type</Label>
                    <select
                      style={{
                        width: `${isMobile ? "260px" : "285px"}`,
                        height: "44px",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                      id="vrmType"
                      name="vrmType"
                      onBlur={() => formik.setFieldTouched("vrmType")}
                      onChange={formik.handleChange}
                    >
                      <option value=''>Please Select Type</option>
                      <option value='target'>Target</option>
                      <option value="cluster">Cluster</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  {formik.touched.vrmType && formik.errors.vrmType && (
                    <Error>{formik.touched.vrmType && formik.errors.vrmType}</Error>
                  )}


                </div>
              </Flex> : (editVRMData.decode_in && editVRMData.decode_out) ?
                <Flex direction="row" justify="space-between" wrap="wrap">
                  <div>
                    <div className="--margin-bottom-large">
                      <Label>IN VRM</Label>
                      <InputText
                        disabled
                        name="vrm"
                        type="text"
                        autoComplete="nope"
                        value={editVRMData.decode_in.vrm}
                      />
                    </div>
                    <div style={{ width: '' }} className="--margin-bottom-large">
                      <Label>IN VRM Plate Patch</Label>
                      <img
                        width={`${isMobile ? "260px" : "285px"}`}
                        height={44}
                        style={{
                          borderRadius: '10px',
                          cursor: 'pointer'

                        }}
                        src={`data:image/jpeg;base64, ${editVRMData.decode_in.plate}`}
                        onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${editVRMData.decode_in.plate}`); }}
                        alt="IN VRM Plate Patch" />

                    </div>
                    <div className="--margin-bottom-large">
                      <Label>IN VRM Overview</Label>
                      <img
                        width={`${isMobile ? "260px" : "285px"}`}
                        height={200}
                        style={{
                          cursor: 'pointer'
                        }}
                        src={editVRMData.decode_in.overview}
                        onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(editVRMData.decode_in.overview); }}
                        alt="IN VRM Overview" />

                    </div>

                    <div className="--margin-bottom-large">
                      <Label>Edit VRM</Label>
                      <InputText
                        id="correctedVRM"
                        name="correctedVRM"
                        type="text"
                        autoComplete="nope"
                        onChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("correctedVRM")}
                        value={formik.values.correctedVRM}
                      />

                    </div>
                    {formik.touched.correctedVRM && formik.errors.correctedVRM && (
                      <Error>{formik.touched.correctedVRM && formik.errors.correctedVRM}</Error>
                    )}
                  </div>

                  <div>
                    <div className="--margin-bottom-large">
                      <Label>OUT VRM</Label>
                      <InputText
                        disabled
                        name="clusterVRM"
                        type="text"
                        autoComplete="nope"
                        value={editVRMData.decode_out.vrm}
                      />

                    </div>

                    <div className="--margin-bottom-large">
                      <Label>OUT VRM Plate Patch</Label>
                      <img
                        width={`${isMobile ? "260px" : "285px"}`}
                        height={44}
                        style={{
                          borderRadius: '10px',
                          cursor: 'pointer'

                        }}
                        src={`data:image/jpeg;base64, ${editVRMData.decode_out.plate}`}
                        onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${editVRMData.decode_out.plate}`); }}
                        alt="OUT VRM Plate Patch" />

                    </div>
                    <div className="--margin-bottom-large">
                      <Label>OUT VRM Overview</Label>
                      <img
                        width={`${isMobile ? "260px" : "285px"}`}
                        height={200}
                        style={{
                          cursor: 'pointer'
                        }}
                        src={editVRMData.decode_out.overview}
                        onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(editVRMData.decode_out.overview); }}
                        alt="OUT VRM Overview" />

                    </div>


                    {/* <div className="--margin-bottom-large">
                    <Label>Type</Label>
                  <select
                  style={{
                    width: `${isMobile ? "260px" : "285px"}`,
                    height: "44px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                  id="vrmType"
                  name="vrmType"
                  onBlur={() => formik.setFieldTouched("vrmType")}
                  onChange={formik.handleChange}
                  >
                    <option value=''>Please Select Type</option>
                    <option value='target'>Target</option>
                    <option value="cluster">Cluster</option>
                    <option value="both">Both</option>
                  </select>
                  </div> 
                  {formik.touched.vrmType && formik.errors.vrmType && (
                    <Error>{formik.touched.vrmType && formik.errors.vrmType}</Error>
                  )}
                   */}

                  </div>
                </Flex> :
                <Flex style={{ width: '80%', margin: 'auto' }} direction="row" justify="center" wrap="wrap">
                  <div className="--margin-bottom-large">
                    <Label>VRM</Label>
                    <InputText
                      disabled
                      name="vrm"
                      type="text"
                      autoComplete="nope"
                      value={vrm}
                    />
                  </div>
                  <div className="--margin-bottom-large">
                    <Label>VRM Plate Patch</Label>
                    <img
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={44}
                      style={{
                        borderRadius: '10px',
                        cursor: 'pointer'

                      }}
                      onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${plate}`); }}
                      src={`data:image/jpeg;base64, ${plate}`} alt="Target VRM Plate Patch" />

                  </div>
                  <div className="--margin-bottom-large">
                    <Label>VRM Overview</Label>
                    <img
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(overview); }}
                      width={`${isMobile ? "260px" : "285px"}`}
                      height={200}
                      src={overview} alt="Target VRM Overview" />

                  </div>

                  <div className="--margin-bottom-large">
                    <Label>Edit VRM</Label>
                    <InputText
                      id="correctedVRM"
                      name="correctedVRM"
                      type="text"
                      autoComplete="nope"
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched("correctedVRM")}
                      value={formik.values.correctedVRM}
                    />
                  </div>
                  {formik.touched.correctedVRM && formik.errors.correctedVRM && (

                    <Error style={{ width: `${isMobile ? "260px" : "285px"}`, }}>{formik.touched.correctedVRM && formik.errors.correctedVRM}</Error>
                  )}

                </Flex>
          }



          <ViewVRM type={vrmType} dialogOpen={openDialog} closeDialog={setDialogOpen} src={imageUrl} />
        </DialogContent>
        <DialogActions style={{ marginBottom: '10px', marginRight: '10px' }}>
          <Button text="Edit" type="submit" color="secondary" />
          <Button text="Cancel" onClick={() => cancel()} color="secondary" />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
