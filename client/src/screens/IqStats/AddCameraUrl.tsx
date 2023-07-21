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
    addOpen: any;
    closeDialog: any;
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

export const AddCameraUrl: FC<Props> = ({ addOpen, closeDialog }) => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useContext(AuthContext)
    const [siteData, setSitesData] = useState<any>([])
    const userType = userData.userType
    const email = userData.email;
    const [operator, setOperator] = useState<any>('');
    const [cameraData, setCameraData] = useState<any>([])
    const [urlEntered, setURLEntered] = useState(false)
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [allSites, setAllSites] = useState<any>([]);
    const [selectableSites, setSelectableSites] = useState<any>([]);
    const [camUrl, setCamUrls] = useState<any>([])


    const handleSubmit = async (values: FormikValues) => {
        try {


            let notValidNumber = false;
            let  notValidUrl = false;

            for (const eachData of cameraData) {

                for (const eachcamera of eachData.cameraData) {

                    if ((eachcamera.isChecked === true  && (isNaN(parseInt(eachcamera.interval)) || parseInt(eachcamera.interval) <= 0))) {
                        notValidNumber = true
                        break
                    }
               
                    if ((!isNaN(parseInt(eachcamera.interval)) && eachcamera.isChecked === false )) {
                        notValidUrl = true;
                        break;

                    }

                }
                if (notValidNumber || notValidUrl ) {
                    break;
                }

            }

            if (notValidNumber) {
                enqueueSnackbar("Please enter a valid interval.", {
                    variant: "error",
                });
                return;
            }

            if (notValidUrl) {
                enqueueSnackbar("Please check the corresponding checkbox.", {
                    variant: "error",
                });
                return;
            }
           


            let cameraDataValues = [] as any;
            cameraData.map((eachData: any) => {
                eachData.cameraData.map((eachChildValue: any) => {
                    cameraDataValues.push(eachChildValue.url, eachChildValue.interval)

                })
            }
            )
            let notValid = cameraDataValues.every((value: any) => value === '' || value === false);

            if (notValid) {
                enqueueSnackbar("Please fill in the values.", {
                    variant: "error",
                });
                return;

            }

            values.cameraDetails = cameraData;
            values.operatorId = operator;
            values.cameraApiAccess = true;

            await axios.put("/api/sites", values, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            });

            enqueueSnackbar("URL updated successfully.", {
                variant: "success",
            });
            setCameraData([]);
            setSelectedSites([]);
            cameraDataValues = [];

        } catch (e: any) {
            enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
                variant: "error",
            });
        }
        cancelAdd();
    };

    const getSiteData = async (site: any) => {
        try {
            const { data } = await axios.post("/api/sites/siteDetails", { site: site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setSitesData(data);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }

    const getAllSites = async () => {
        try {
            const site = userData.sites;
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setAllSites(data);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }
    

    const getCameraUrl = async () => {
        const { data } = await axios.post(
            `/api/sites/multitaskingGetDataApi`, { email, type: userType, keyword: "api-call-urls", dataFrom: "catalogue" },
            {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            }
        );

        let arr = [] as any;
        data.data.map((val: any) => {
            return arr.push(val)
        })
        setCamUrls(arr)

    }

    const getCameraDetails = async (site: any) => {
        const { data } = await axios.get(
            `/api/iqStats/getCamera?type=${userType}&email=${email}&site=${site}`,
            {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            }
        );
        let precamArray = [] as any;

        let hasPreviousCameraData = false;
        let previousCameraData = [] as any;

        for (const eachData of siteData) {
            if (eachData.cameraDetails === undefined || eachData.cameraDetails.length === 0) {
                hasPreviousCameraData = false;
                break;
            }
            else {
                for (const eachCamera of eachData.cameraDetails) {
                    for(const eachCamData of eachCamera.cameraData){
                        
                         previousCameraData.push(eachCamData.title,eachCamData.interval);
                        
                    }

                    hasPreviousCameraData = previousCameraData.some((value: any) => (value !== undefined && value !== "") )
                    if(hasPreviousCameraData){
                        
                        break;
                    }
                }

            }
            
        }
        


        if (hasPreviousCameraData) {
            precamArray = siteData[0] && siteData[0].cameraDetails ? siteData[0].cameraDetails : [{}];
            setCameraData(precamArray)


        } else {
            data.map((cam: any, index: any) => {
                precamArray.push({
                    camera: cam._id.camera,
                    MAC: cam._id.MAC,
                    cameraIP: '',
                    cameraData: [{url:'',interval:'NA',title:"SaF status",username:'',password:'',isChecked:false},
                    {url:'',interval:'NA',title:"Camera health",username:'',password:'',isChecked:false},
                    {url:'',interval:'NA',title:"Led health",username:'',password:'',isChecked:false},
                    {url:'',interval:'NA',title:"Input health",username:'',password:'',isChecked:false}]
                })
            })
            setCameraData(precamArray)


        }


    }


    const getOperatorData = async (site: any) => {
        try {
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });

            let operatorId = data[0].operatorId;

            setOperator(operatorId)


        } catch (e) {
            enqueueSnackbar("Something Went Wrong", {
                variant: "error",
            });
        }
    }

    useEffect(() => {

        if (selectedSites.length > 0) {
            getSiteData(selectedSites)
            getOperatorData(selectedSites);
        }

    }, [selectedSites])


    useEffect(() => {
        if (selectedSites.length > 0) {
            getCameraDetails(selectedSites[0]);
            getCameraUrl()
        }
    }, [siteData])


    useEffect(() => {

        let cameraAPIaccessSites = allSites.filter((eachSite: any) => {
            return eachSite.cameraApiAccess === true
        })

        let selectableSites = [] as any;
        for (const eachSite of cameraAPIaccessSites) {
            selectableSites.push(eachSite._id)
        }
        setSelectableSites(selectableSites);

    }, [allSites]);

    useEffect(() => {
        if (addOpen) {
            getAllSites()
        }
    }, [addOpen])


    const cancelAdd = () => {
        formik.resetForm();
        closeDialog();
        setOperator('');
        setCameraData([]);
        setSitesData([]);
        setAllSites([]);
        setSelectableSites([])
        setSelectedSites([]);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: ''
        },
        onSubmit: handleSubmit,
    });



    const setUrl = (e: any, key: any, index: any , value:any) => {
        
        const modifiedCameraRows = [...cameraData];
        modifiedCameraRows[key].cameraData[index] = { ...modifiedCameraRows[key].cameraData[index], 
                                                       url:value.url ,
                                                       title: value.title,
                                                       username: value.username,
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
            open={addOpen}
            onClose={() => cancelAdd()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={"sm"}
        >
            <Form onSubmit={formik.handleSubmit}>
                <DialogTitle>{`ADD CAMERA URL`}</DialogTitle>
                <DialogContent>
                    <Flex direction="row" justify="center" wrap="wrap">
                        <div className="--margin-bottom-large" >
                            <Label>Sites</Label>
                            <MultiSelect
                                style={{ minWidth: "455px", maxWidth: '455px' }}
                                fullWidth={!!isMobile}
                                multi={false}
                                className="insights__refine-menu__multi-select"
                                options={selectableSites.sort().map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                                values={selectedSites}
                                onChange={(values) => {
                                    const normalizedSites = Formatter.normalizeSites(values) || [];
                                    setSelectedSites(normalizedSites);
                                    formik.setFieldValue('id', normalizedSites[0])

                                }}
                            />
                            {formik.errors.id && (
                                <Error>{formik.errors.id}</Error>
                            )}
                        </div>
                        {
                            (userType === "Admin") &&
                            cameraData.map((cameraRow: any, key: any) => (

                                <div style={{ width: "455px", marginBottom: '10px' }} key={key}>
                                    
                                    <div  style={{width: '100%' }}>
                                        <div style={{ display: "flex"}}>
                                            <Label style={{marginRight:'10px'}}>Camera Name :</Label>
                                            <Tooltip title={`MAC Address: ${cameraRow.MAC}`} arrow placement="top">
                                              <b style={{fontSize:'12px'}}>{cameraRow.camera}</b>
                                            </Tooltip>

                                        </div>
                                       

                                    </div>
                                    {
                                        camUrl.map((urlRow: any, index: any) => (
                                        
                                                <div style={{ display: 'flex', justifyContent: 'space-between',width: "100%", marginBottom: '10px' }} key={key}>
                                                    <div style={{ display: 'flex', justifyContent: 'start', width: '260px' }}>
                                                        <input
                                                            id={`url${key}${index}url`}
                                                            style={{ marginRight: '10px' }}
                                                            type='checkbox'
                                                            key={key}
                                                            checked={cameraData && cameraData[key] && cameraData[key].cameraData && cameraData[key].cameraData[index] && cameraData[key].cameraData[index].isChecked ? cameraData[key].cameraData[index].isChecked : false}
                                                            onChange={(e) => { setUrl(e, key, index, urlRow) }}
                                                            name={`url${key}${index}url`}
                                                        />
                                                        <label style={{ alignSelf:'center', color: '#595858', fontSize: '12px'}}>{urlRow.title === "Input health" ? "Input voltage" : urlRow.title}</label>

                                                    </div>
                                                    <div>
                                                    <label style={{ color: '#595858', fontSize: '12px',marginRight:'10px' }}>Interval (hrs)</label>

                                                        <input
                                                            style={{ minWidth: "70px", 
                                                            height: '20px', 
                                                            maxWidth: '70px', 
                                                            borderRadius: '5px',
                                                            boxShadow: "inset 1px 1px 2px #14141469",
                                                            border: "none",
                                                            fontSize: "13px",
                                                            letterSpacing: "1.1px",
                                                            backgroundColor:" #f4f2f6",
                                                            paddingLeft:'10px'
                                                         }}
                                                            type="number"
                                                            key={key}
                                                            value={cameraData && cameraData[key] && cameraData[key].cameraData && cameraData[key].cameraData[index] && cameraData[key].cameraData[index].interval ? cameraData[key].cameraData[index].interval : ''}
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
                            onClick={() => cancelAdd()}
                            color="secondary"
                        />
                        <Button text="Submit" type="submit" loading={formik.isSubmitting} />
                    </DialogActions>
                </Flex>
            </Form>
        </Dialog>
    );
};
