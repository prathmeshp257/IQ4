import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { TableFooter } from "@mui/material";
import NavigateBeforeIcon from '@material-ui/icons/NavigateNext';
import NavigateNextIcon from '@material-ui/icons/NavigateBefore';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, ButtonGroup, Tab } from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { Flex, MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { EditVRM } from "./EditVRMDialog";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { string } from "yup";
import ProgressBar from "../Reports/ProgressBar";
import { CorrectApproxVRM } from "./CorrectApproxVRM";

interface Props {
    sites: Array<any>;
    mainSite: Array<any>;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 200,
        maxHeight: 400,
        overFlowY: 'scroll'
    },
});

const InputText = styled.input`
  display: flex;
  height: 38px;
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

export const VRMCorrectionData: FC<Props> = ({ sites, mainSite }) => {
    const { userData } = useContext(AuthContext);
    const userType = userData.userType;
    const vrmValidator = userData.vrmValidator || "";
    const vrmValidatorSites = userData.vrmValidatorSites || "";
    const classes = useStyles();
   
    const [selectableSites, setSelectableSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : []);
    const [vrmCorrectionData, setVrmCorrectionData] = useState<any>({});
    const [filteredVrmCorrectionData, setFilteredVrmCorrectionData] = useState<any>([]);
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState("next");
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [allSites, setAllSites] = useState<any>([]);
    const [siteData, setSitesData] = useState<any>([])
    const [sortTypeData, setSortTypeData] = useState<any>([]);
    const [sortType, setSortType] = useState<string[]>([]);
    const [editData, setEditData] = useState({})
    const [dialogOpen, setDialogOpen] = useState(false);
    const [minDuration, setMinDuration] = useState<any>();
    const [correctData, setCorrectData] = useState({});
    const [correctDialogOpen, setCorrectDialog] = useState(false);
    let [stopTimer, setStopTimer] = useState<any>()
    let [time, setTime] = useState(0);
    let [date,setDate] = useState<string>(dayjs().format("YYYY-MM-DD"))



    useEffect(() => {
        if (mainSite && mainSite[0]) {
            setSelectedSites([...mainSite])
        }
    }, [mainSite])

    


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

    useEffect(() => {
        if(allSites && allSites.length > 0){

        let vrmCorrectionaccessSites = allSites.filter((eachSite: any) => {
            return eachSite.vrmCorrectionAccess === true
        })

        let selectableSites = [] as any;
        for (const eachSite of vrmCorrectionaccessSites) {
            selectableSites.push(eachSite._id)
        }
        setSelectableSites(selectableSites);
        const localSelectedSite = localStorage.getItem('vrmCorrection-selected-site');
        if(localSelectedSite && selectableSites.includes(localSelectedSite)){
            setSelectedSites([localSelectedSite])
        }
    }

    }, [allSites]);

    useEffect(() => {
        getAllSites()
        // nt-disable-next-line
    }, [])




    const getVRMCorrectionData = async (date: string, sortType: any, page:any) => {
        setLoading(true);
        setVrmCorrectionData({})

        try {

            const { data: siteDetail } = await axios.post("/api/sites/siteDetails", { site: selectedSites }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });

            setSitesData(siteDetail)


            const { data } = await axios.get(`/api/vrmCorrection/vrmCorrectionListing?type=${userType}&email=${email}&site=${selectedSites[0]}&date=${date}&sortType=${sortType[0] ? sortType[0] : 'DESCENDING'}&clusterDataAccess=${sortType[0] && sortType[0] === "APPROX MATCHES" ? "false" : "true"}&historicDataAccess=${sortType[0] && sortType[0] === "APPROX MATCHES" ? "false" : "true"}&page=${page}`, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });

            setVrmCorrectionData(data);
            setDate(data.date)
           
            if (data[selectedSites[0]]['data'].length > 0) {
                let sortType = ["NEWEST TO OLDEST", "OLDEST TO NEWEST", "ENTRY", "EXIT"]
                let matchApproxAccess = siteDetail && siteDetail[0] && siteDetail[0].approxMatchVrmCorrectionAccess ? siteDetail[0].approxMatchVrmCorrectionAccess : false

                if (matchApproxAccess) {
                    sortType.unshift("APPROX MATCHES")
                }
                setSortTypeData(sortType);

            }
            localStorage.setItem('vrmCorrection-selected-site', selectedSites[0])


        } catch (e) {
            console.log('error-VRM-correction-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);

    };



    useEffect(() => {
      
        let minimumDuration = isNaN(minDuration) ? 0 : minDuration;
        
        if (Object.keys(vrmCorrectionData).length > 0 && vrmCorrectionData[selectedSites[0]] && vrmCorrectionData[selectedSites[0]]['data'] && minimumDuration >= 0) {
            let filteredVrmCorrectionData = vrmCorrectionData[selectedSites[0]]['data'].filter((value: any) => {
                if(value.duration >= 0){
                    return value.duration >= Number( minimumDuration)
                }else{
                    return value
                }

            })

            let site = selectedSites && selectedSites[0] ? selectedSites : ''

            let data = { [`${site}`]: { data: filteredVrmCorrectionData } }

            setFilteredVrmCorrectionData(data)

        }

    }, [minDuration,vrmCorrectionData])



    const handleChangePage = async (newpage: any) => {
       let newDate = '' ;
       setPage(newpage)
        if (newpage === "next") {
            newDate = dayjs(date).subtract(1,'day').format("YYYY-MM-DD")
            setDate(newDate)

        } else if (newpage === 'pre') {
            newDate = dayjs(date).add(1,'day').format("YYYY-MM-DD")
            setDate(newDate)
        }
      
        getVRMCorrectionData(newDate, sortType,newpage);
    };



    const closeDialog = () => {
        setDialogOpen(false);
        getVRMCorrectionData(date, sortType,page);
    }

    const closeCorrectDialog = () => {
        setCorrectDialog(false);
        getVRMCorrectionData(date, sortType,page);
    }


    useEffect(() => {
        const getData = async () => {
            setPage('next');
            getVRMCorrectionData(dayjs().format("YYYY-MM-DD"), sortType,'next');
        }

        if (!loading && selectedSites[0]) {
            getData()

        }
        else {
            setVrmCorrectionData({});
        }

        // eslint-disable-next-line
    }, [selectedSites]);




    const edit = (data: any) => {
        setEditData(data);
        setDialogOpen(true);
        setStopTimer(setInterval(() => {
            setTime(time += 1);
        }, 1000))
    }

    const ignore = async (e: any, data: any, format: any) => {

        let values = {} as any;
        if (data && (data.clusterId && data.targetId)) {
            values.vrmIds = [data.targetId._id, data.clusterId._id]
            values.format = 'skipCluster';

        } else if (data && (data.decode_in && data.decode_out)) {
            values.vrmIds = [data.decode_in._id, data.decode_out._id]
            values.date = data.decode_in.when;
            values.id = data._id;
            values.format = format ? format : 'skipApprox';
            if(format === 'setCluster'){
                values.isCluster = e.target.checked
            }

        }
        else {
            values.vrmIds = [data._id]
            values.format = 'skipDecode';

        }
        values.email = userData.email;
        values.type = userData.userType;
        values.site = selectedSites[0];

        setLoading(true)

        await axios.post(`/api/vrmCorrection/editVrm`, values, {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
        })

        getVRMCorrectionData(date, sortType,page);
    }

    const correct = (type: any, approxDecode: any, vrmId: any) => {

        setStopTimer(setInterval(() => {
            setTime(time += 1);
        }, 1000));
        setCorrectDialog(true);
        let data = {} as any
           
        if (approxDecode && (approxDecode.decode_in && approxDecode.decode_out)) {
            let correctedVRM = ''
            if(type === "decode_in"){
                correctedVRM = approxDecode.decode_in.vrm;
            }else{
                correctedVRM = approxDecode.decode_out.vrm; 
            }
             
            data.correctedVRM = correctedVRM;
            data.id = approxDecode._id;
            data.date = approxDecode.decode_in.when;

        }

        let vrmIds = [];
        vrmIds.push(vrmId)
        data.vrmIds = vrmIds;
        data.email = userData.email;
        data.type = userData.userType;
        data.site = selectedSites[0];
        data.format = "correct";
        setCorrectData(data)

    }

    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap', marginBottom: '15px' }}>
                <div>
                <h3 style={{ marginBottom: "15px" }}>
                    Data For VRM Correction Of Site '{Formatter.capitalizeSites(selectedSites)}'
                </h3>
                {date && <h4>{dayjs(date).format("DD MMMM")}</h4>}
                </div>
                
                <Flex wrap="wrap">
                    {(sortType && sortType[0] === "APPROX MATCHES") && <InputText
                        placeholder="Minimum Duration"
                        style={{ marginRight: "10px", minWidth: "200px", maxWidth: '200px' }}
                        type="number"
                        onChange={(e) => { setMinDuration(parseInt(e.target.value)) }}
                        value={minDuration}
                        name="minDuration"
                    />}

                    <MultiSelect
                        style={{ marginRight: "10px" }}
                        fullWidth={!!isMobile}
                        disabled={vrmCorrectionData[selectedSites[0]] && vrmCorrectionData[selectedSites[0]]['data'] ? false : true}
                        multi={false}
                        placeholder="Select Sort Type"
                        className="insights__refine-menu__multi-select --margin-bottom-large"
                        options={sortTypeData.map((sortType: any) => ({ value: sortType, label: sortType }))}
                        values={sortType}
                        onChange={(values) => {
                            setSortType(values);
                            getVRMCorrectionData(date, values,page)

                        }}
                    />
                    <MultiSelect
                        fullWidth={!!isMobile}
                        multi={false}
                        className="insights__refine-menu__multi-select --margin-bottom-large"
                        options={selectableSites.map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                        values={selectedSites}
                        onChange={(values) => {
                            const normalizedSites = Formatter.normalizeSites(values) || [];
                            setSelectedSites(normalizedSites);
                            setSortTypeData([]);
                            setDate(dayjs().format("YYYY-MM-DD"))
                            setSortType(["NEWEST TO OLDEST"])

                        }}
                    />
                </Flex>
            </div>

            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date/Time</TableCell>
                                <TableCell>Duration (min)</TableCell>
                                <TableCell>Direction</TableCell>
                                <TableCell>VRM</TableCell>
                                <TableCell>VRM Prefix</TableCell>
                                {
                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                        <React.Fragment>
                                            <TableCell>VRM Valid</TableCell>

                                        </React.Fragment>
                                        : ""
                                }
                                <TableCell>30 Days IN/OUT</TableCell>

                                <TableCell>Plate Patch</TableCell>
                                <TableCell>Cluster</TableCell>
                                <TableCell>Choose Correct</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading ?
                                    <TableRow>
                                        <TableCell colSpan={(vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ? 11 : 8}>
                                            <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}> <ProgressBar /> </div>
                                        </TableCell>
                                    </TableRow>
                                    :

                                    Object.keys(filteredVrmCorrectionData).length > 0 && filteredVrmCorrectionData[selectedSites[0]] && filteredVrmCorrectionData[selectedSites[0]]['data'] && filteredVrmCorrectionData[selectedSites[0]]['data'].length > 0 ? filteredVrmCorrectionData[selectedSites[0]]['data']
                                        .map((eachData: any, index: any) => {
                                            return (eachData.targetId && eachData.clusterId) ? <><TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }} >
                                                <TableCell rowSpan={2}>{dayjs(eachData.targetId.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell rowSpan={2}>{"NA"}</TableCell>
                                                <TableCell>{Formatter.capitalize(eachData.targetId.direction)}</TableCell>
                                                <TableCell>{eachData.targetId.vrm}</TableCell>
                                                <TableCell rowSpan={2}>{"NA"}</TableCell>
                                                
                                                {
                                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                        <React.Fragment>
                                                            <TableCell>{eachData.targetId.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>

                                                        </React.Fragment>
                                                        : ""
                                                }
                                                <TableCell>{eachData.targetId.in + '/' + eachData.targetId.out}</TableCell>

                                                <TableCell>
                                                    {
                                                        eachData.targetId.plate ?
                                                            <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.targetId.plate}`} />
                                                            : "NA"
                                                    }
                                                </TableCell>

                                                <TableCell rowSpan={2}>
                                                    <input type="checkbox"/>
                                                </TableCell>

                                                <TableCell>
                                                    <ButtonGroup>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }}  >{eachData.targetId.vrm} Correct</Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                                <TableCell rowSpan={2}>
                                                    <ButtonGroup>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={() => { edit(eachData) }}>Edit</Button>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={(e) => { ignore(e, eachData, 'skipCluster') }}  >Ignore</Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                                <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }}>
                                                    <TableCell>{Formatter.capitalize(eachData.clusterId.direction)}</TableCell>
                                                    <TableCell>{eachData.clusterId.vrm}</TableCell>
                                                    {
                                                        (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                            <React.Fragment>
                                                                <TableCell>{eachData.clusterId.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>

                                                            </React.Fragment>
                                                            : ""
                                                    }

                                                    <TableCell>{eachData.clusterId.in + '/' + eachData.clusterId.out}</TableCell>

                                                    <TableCell>
                                                        {
                                                            eachData.clusterId.plate ?
                                                                <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.clusterId.plate}`} />
                                                                : "NA"
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <ButtonGroup>
                                                            <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }}  >{eachData.clusterId.vrm} Correct</Button>
                                                        </ButtonGroup>
                                                    </TableCell>

                                                </TableRow>
                                            </> : (eachData.decode_in && eachData.decode_out) ? <><TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }} >
                                                <TableCell>{dayjs(eachData.decode_in.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell rowSpan={2}>{eachData.duration}</TableCell>
                                                <TableCell>{Formatter.capitalize(eachData.decode_in.direction)}</TableCell>
                                                <TableCell>{eachData.decode_in.vrm}</TableCell>
                                                <TableCell rowSpan={2}>{eachData.prefixVrm ? eachData.prefixVrm : "NA"}</TableCell>
                                                {
                                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                        <React.Fragment>
                                                            <TableCell>{eachData.decode_in.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>

                                                        </React.Fragment>
                                                        : ""
                                                }

                                                <TableCell>{eachData.decode_in.in + '/' + eachData.decode_in.out}</TableCell>

                                                <TableCell>
                                                    {
                                                        eachData.decode_in.plate ?
                                                            <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.decode_in.plate}`} />
                                                            : "NA"
                                                    }
                                                </TableCell>

                                                <TableCell rowSpan={2}>
                                                    <input onChange={(e)=>{ignore(e, eachData, 'setCluster')}} checked={eachData.clusterChecked === true} style={{cursor:'pointer', height:"20px",width:"40px"}} type="checkbox"/>
                                                </TableCell>
                                              
                                                <TableCell>
                                                    <ButtonGroup disabled={ (siteData[0] && siteData[0].vrmCorrectionPrefixAccess) }>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={() => correct("decode_in", eachData, eachData.decode_out._id)}  >{eachData.decode_in.vrm} Correct</Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                               <TableCell rowSpan={2}>
                                                    <ButtonGroup disabled={(siteData[0] && siteData[0].vrmCorrectionPrefixAccess)}>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={() => { edit(eachData) }}>Edit</Button>
                                                        <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={(e) => { ignore(e,eachData, 'skipApprox') }}  >Ignore</Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                                
                                            </TableRow>
                                                <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }}>
                                                    <TableCell>{dayjs(eachData.decode_out.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                    <TableCell>{Formatter.capitalize(eachData.decode_out.direction)}</TableCell>
                                                    <TableCell>{eachData.decode_out.vrm}</TableCell>
                                                    {
                                                        (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                            <React.Fragment>
                                                                <TableCell>{eachData.decode_out.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>

                                                            </React.Fragment>
                                                            : ""
                                                    }

                                                    <TableCell>{eachData.decode_out.in + '/' + eachData.decode_out.out}</TableCell>

                                                    <TableCell>
                                                        {
                                                            eachData.decode_out.plate ?
                                                                <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.decode_out.plate}`} />
                                                                : "NA"
                                                        }
                                                    </TableCell>

                                                   <TableCell>
                                                        <ButtonGroup disabled={(siteData[0] && siteData[0].vrmCorrectionPrefixAccess)}>
                                                            <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={() => correct("decode_out", eachData, eachData.decode_in._id)}  >{eachData.decode_out.vrm} Correct</Button>
                                                        </ButtonGroup>

                                                    </TableCell>

                                                </TableRow>
                                            </> : <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }} >
                                                <TableCell>{dayjs(eachData.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell>{"NA"}</TableCell>

                                                <TableCell>{Formatter.capitalize(eachData.direction)}</TableCell>
                                                <TableCell>{eachData.vrm}</TableCell>
                                                <TableCell>{"NA"}</TableCell>
                                                {
                                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                        <React.Fragment>
                                                            <TableCell>{eachData.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>

                                                        </React.Fragment>
                                                        : ""
                                                }

                                                <TableCell>{eachData.in + '/' + eachData.out}</TableCell>

                                                <TableCell>
                                                    {
                                                        eachData.plate ?
                                                            <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.plate}`} />
                                                            : "NA"
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {"NA"}
                                                </TableCell>
                                                <TableCell>
                                                    {"NA"}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        eachData.overview && <ButtonGroup>
                                                            <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={() => { edit(eachData) }}>Edit</Button>
                                                            <Button variant="outlined" style={{ backgroundColor: index % 2 !== 0 ? '#e0e0e0' : 'white' }} onClick={(e) => { ignore(e, eachData, 'skipDecode') }}  >Ignore</Button>
                                                        </ButtonGroup>

                                                    }
                                                </TableCell>
                                            </TableRow>
                                        }) : (selectedSites && selectedSites[0]) &&  <TableRow>
                                                <TableCell colSpan={11} style={{ borderBottom: 'none' }}>
                                                    <div style={{ textAlign: 'center', padding: 'auto' }}>No Record Found... </div>
                                                </TableCell>
                                            </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableFooter style={{ display: 'flex', justifyContent: 'end' }}>
                    <TableRow>
                        <TableCell style={{ borderBottom: 'none' }}><Button onClick={() => handleChangePage("pre")} disabled={date === dayjs().format("YYYY-MM-DD") || loading ? true : false}><NavigateNextIcon /></Button></TableCell>
                        <TableCell style={{ borderBottom: 'none' }}><Button onClick={() => handleChangePage("next")} disabled={loading || selectedSites.length === 0} ><NavigateBeforeIcon /></Button></TableCell>
                    </TableRow>
                </TableFooter>
                <CorrectApproxVRM openDialog={correctDialogOpen} setTime={setTime} time={time} stopTimer={stopTimer} closeDialog={setCorrectDialog} correctData={correctData} setCorrectData={setCorrectData} closeAndGetData={closeCorrectDialog} />
                <EditVRM site={selectedSites[0]} setTime={setTime} time={time} stopTimer={stopTimer} editVRMData={editData} setEditVRMData={setEditData} dialogOpen={dialogOpen} closeDialog={setDialogOpen} closeAndGetData={closeDialog} />
            </React.Fragment>
        </Paper>
    );
}