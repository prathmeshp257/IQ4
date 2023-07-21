import React, { FC, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, Flex, MultiSelect } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import styled, { createGlobalStyle } from "styled-components";
import { colors } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { FormikValues, useFormik } from "formik";
import { Formatter } from "../../utils";
import { Shell } from "../../containers";
import { AuthContext } from "../../context";
import { ViewVRM } from "../VRMCorrection/ViewVRM";


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

export const EditVRM: FC = () => {

  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useContext(AuthContext)
  const [manualCorrectionSites, setMaunalCorrectionsites] = useState<any>([]);
  const [selectedSite, setSelectedSite] = useState<string[]>([]);
  const [dataStack, setDataStack] = useState<any>([]);
  const [vrmCorrectionData, setVrmCorrectionData] = useState<any>({})
  const [startTime, setStartTime] = useState(0);
  const [page, setPage] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [openDialog, setDialogOpen] = useState(false);
  const [vrmType, setVRMType] = useState('');
  const [loading,setLoading] = useState(false);

  const vrm = vrmCorrectionData ? vrmCorrectionData.vrm : '';
  const targetVRM = vrmCorrectionData && vrmCorrectionData.targetId ? vrmCorrectionData.targetId.vrm : '';
  const clusterVRM = vrmCorrectionData && vrmCorrectionData.clusterId ? vrmCorrectionData.clusterId.vrm : '';
  const plate = vrmCorrectionData ? vrmCorrectionData.plate : '';
  const targetPlate = vrmCorrectionData && vrmCorrectionData.targetId ? vrmCorrectionData.targetId.plate : '';
  const clusterPlate = vrmCorrectionData && vrmCorrectionData.clusterId ? vrmCorrectionData.clusterId.plate : '';
  const overview = vrmCorrectionData ? vrmCorrectionData.overview : '';
  const targetOverview = vrmCorrectionData && vrmCorrectionData.targetId ? vrmCorrectionData.targetId.overview : '';
  const clusterOverview = vrmCorrectionData && vrmCorrectionData.clusterId ? vrmCorrectionData.clusterId.overview : '';



  const handleSubmit = async (values: FormikValues) => {
    try {
      let stop = Math.floor(Date.now()/1000)
      if (vrmCorrectionData && (vrmCorrectionData.clusterId && vrmCorrectionData.targetId)) {
        if (values.vrmtype === 'cluster') {
          values.vrmIds = [vrmCorrectionData.clusterId._id]
        } else if (values.vrmtype === 'target') {
          values.vrmIds = [vrmCorrectionData.targetId._id]
        } else if (values.vrmtype === 'both') {
          values.vrmIds = [vrmCorrectionData.targetId._id, vrmCorrectionData.clusterId._id]
        }
      } else {
        values.vrmIds = [vrmCorrectionData._id]
      }

      values.email = userData.email;
      values.type = userData.userType;
      values.format = 'submit';
      values.site = selectedSite[0];
      values.vrmCorrectionTimeTaken = stop-startTime;
      values.correctedVRM = (values.correctedVRM).toUpperCase();

      if (values.correctedVRM === "") {
        formik.setFieldError('correctedVRM', "Please add value");
        return;
      }
      if(vrmCorrectionData && (vrmCorrectionData.clusterId && vrmCorrectionData.targetId) ){
        if (formik.values.vrmtype === '') {
        formik.setFieldError('vrmtype', "Please select vrm type");
        return;
      }
    }


     setStartTime(Math.floor(Date.now()/1000))

      await axios.post("/api/iqStats/editVrm", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      formik.resetForm();
      getVrm()
    
    } catch (error) {
      console.log("error");

    }
  }


  const Skip = async () => {
  
    try {
      

      let stop = Math.floor(Date.now()/1000)
 
      const values = { site: selectedSite[0] } as any;

      if (vrmCorrectionData && (vrmCorrectionData.clusterId && vrmCorrectionData.targetId)) {

        if (formik.values.vrmtype === 'cluster') {

          values.vrmIds = [vrmCorrectionData.clusterId._id]
        } else if (formik.values.vrmtype === 'target') {

          values.vrmIds = [vrmCorrectionData.targetId._id]
        } else if (formik.values.vrmtype === 'both') {

          values.vrmIds = [vrmCorrectionData.targetId._id, vrmCorrectionData.clusterId._id]
        }
      }
      else {
        values.vrmIds = [vrmCorrectionData._id]
      }
       
      values.email = userData.email;
      values.type = userData.userType;
      values.format = 'skip';
      values.site = selectedSite[0];
      values.vrmCorrectionTimeTaken = stop-startTime;
      values.correctedVRM = (formik.values.correctedVRM).toUpperCase();

      if (values.correctedVRM === "") {
        formik.setFieldError('correctedVRM', "Please add value");
        return;
      }
 
      if(vrmCorrectionData && (vrmCorrectionData.clusterId && vrmCorrectionData.targetId) ){
        if (formik.values.vrmtype === '') {
        formik.setFieldError('vrmtype', "Please Select VRM Type");
        return;
      }
    }

      setStartTime(Math.floor(Date.now()/1000))

      await axios.post("/api/iqStats/editVrm", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });

      formik.resetForm();
      getVrm()

      

    } catch (error) {
      console.log("errror", error);

    }

  }


  const formik = useFormik({
    initialValues: {
      correctedVRM: "",
      vrmtype: ''
    },
    onSubmit: handleSubmit
  });



  const getManualCorrectionSites = async () => {
    const { data } = await axios.get('/api/sites/manualSites',
      {
        headers:
        {
          authorization: "Bearer " + localStorage.getItem("token"),
        }
      })

    setMaunalCorrectionsites(data);
  }

  useEffect(() => {
    getManualCorrectionSites()
  }, [])



  const getVrm = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/iqStats/vrmCorrectionListing?type=${userData.userType}&email=${userData.email}&site=${selectedSite[0]}&page=${page}`,
      {
        headers: { authorization: "Bearer " + localStorage.getItem("token") }
      })
    //setDataStack(data[selectedSite[0]]["data"])
    setVrmCorrectionData(data[selectedSite[0]]["data"][0]);
    setStartTime(Math.floor(Date.now()/1000))
      
    } catch (error) {
      
    }
    setLoading(false)
 
  }

  useEffect(() => {

    if (selectedSite && selectedSite[0]) {
      
      getVrm()
    }
  }, [selectedSite])




  return (

    

    <Shell title="VRM Correction" subtitle=""
    loading={loading}
      endSlot={<Flex className="dashboard__refine-menu" justify="space-between">
        <LabelledComponent label="Sites" className="--margin-right-large">
          <MultiSelect
            multi={false}
            options={manualCorrectionSites.map((site: any) => ({
              value: Formatter.normalizeSite(site.name),
              label: Formatter.capitalizeSite(site.name)
            })) || []}
            onChange={(values) =>
              setSelectedSite(values)

            } />
        </LabelledComponent>
      </Flex>}
    >
      <div style={{
        maxWidth: '650px',
        margin: 'auto',
        minHeight:'300px',
        boxShadow: '2px 2px 5px',
        borderRadius: '10px',
        padding: '20px'
      }}>

       {<><h2>Edit VRM</h2>
        <Form onSubmit={formik.handleSubmit}>
          {vrmCorrectionData && (vrmCorrectionData.clusterId && vrmCorrectionData.targetId) ?
            <Flex style={{ maxWidth: '750px' }} direction="row" justify="space-between" wrap="wrap">
              <div>
                <div className="--margin-bottom-large">
                  <Label>Target VRM</Label>
                  <InputText
                    disabled
                    name="targetVRM"
                    type="text"
                    autoComplete="nope"
                    value={targetVRM}
                  />
                </div>
                {targetPlate &&
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

                  </div>}
                {targetOverview && <div className="--margin-bottom-large">
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

                </div>}

                <div className="--margin-bottom-large">
                  <Label>Edit VRM</Label>
                  <InputText
                    id="correctedVRM"
                    name="correctedVRM"
                    type="text"
                    autoComplete="nope"
                    onChange={(e) => formik.setFieldValue('correctedVRM', (e.target.value).toUpperCase())}
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

                {clusterPlate && <div className="--margin-bottom-large">
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

                </div>}
                {clusterOverview && <div className="--margin-bottom-large">
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
                }

                <div className="--margin-bottom-large">
                  <Label>Type</Label>
                  <select
                  
                    style={{
                      width: `${isMobile ? "260px" : "285px"}`,
                      height: "44px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                    id="vrmtype"
                    name="vrmtype"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("vrmtype")}

                  >
                    <option selected={formik.values.vrmtype===""} value=''>Please Select Type</option>
                    <option value='target'>Target</option>
                    <option value="cluster">Cluster</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {formik.errors.vrmtype  && (
               
                  <Error>{formik.errors.vrmtype}</Error>
                )}
              </div>
            </Flex> :

            <Flex style={{ width: '50%', margin: 'auto' }} direction="row" justify="center" wrap="wrap">
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
              {plate && <div className="--margin-bottom-large">
                <Label>VRM Plate Patch</Label>
                <img
                  width={`${isMobile ? "260px" : "285px"}`}
                  height={44}
                  style={{
                    borderRadius: '10px',
                    cursor: 'pointer'

                  }}
                  onClick={() => { setVRMType("plate"); setDialogOpen(true); setImageUrl(`data:image/jpeg;base64, ${plate}`); }}
                  src={`data:image/jpeg;base64, ${plate}`} alt="VRM Plate Patch" />

              </div>
              }
              {overview && <div className="--margin-bottom-large">
                <Label>VRM Overview</Label>
                <img
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => { setVRMType("overview"); setDialogOpen(true); setImageUrl(overview); }}
                  width={`${isMobile ? "260px" : "285px"}`}
                  height={200}
                  src={overview} alt="VRM Overview" />

              </div>}

              <div className="--margin-bottom-large">
                <Label>Edit VRM</Label>
                <InputText
                  id="correctedVRM"
                  name="correctedVRM"
                  type="text"
                  autoComplete="nope"
                  onChange={(e) => formik.setFieldValue('correctedVRM', (e.target.value).toUpperCase())}
                  //onBlur={() => formik.setFieldTouched("correctedVRM")}
                  value={formik.values.correctedVRM}
                />
              </div>
              {formik.errors.correctedVRM && (
                <Error>{formik.errors.correctedVRM}</Error>
              )}

            </Flex>}

          <ViewVRM type={vrmType} dialogOpen={openDialog} closeDialog={setDialogOpen} src={imageUrl} />

          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
            <Button type="button" onClick={Skip} buttonStyle={{ marginRight: '5px' }} text="Skip" color="secondary"  />
            <Button text="Save & Next" type="submit" color="secondary" />
          </div>
        </Form></>}
      </div>
    </Shell>

  );
};
