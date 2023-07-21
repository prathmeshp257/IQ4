import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { isMobile } from "react-device-detect";
import { MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { AuthContext, SiteContext } from "../../context";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { Button, ButtonGroup } from "@material-ui/core";
import { EditUrl } from "./EditUrl";
import { DeleteUrl } from "./DeleteUrl";
import { useSnackbar } from "notistack";
import { EditMultipleUrl } from "./EditMultipleURL";
import ProgressBar from "../Reports/ProgressBar";




interface Props {
    sites: Array<any>;

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


const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;



const InputText = styled.input`
  display: flex;
  height: 38px;
  width: 100%;
  min-width: ${isMobile ? "260px" : "280px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "280px"};
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

export const URLCrud: FC<Props> = ({ sites }) => {
    const { userData } = useContext(AuthContext);
    const { sitesData } = useContext(SiteContext);
    const userType = userData.userType;
    const email = userData.email;
    const classes = useStyles();
    const [siteData, setSitesData] = useState<any>([])
    const [vrmCorrectionData, setVrmCorrectionData] = useState<any>({});
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [multipleEditOpen, setMultipleEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [url, setUrl] = useState('');
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [allSites, setAllSites] = useState<any>([]);
    const { enqueueSnackbar } = useSnackbar();





    useEffect(() => {
        let accessSites = sites;
        if (userType !== "Admin" && userType) {
            for (const eachSite of sites) {
                const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
                if (expired[0]) {
                    accessSites = accessSites.filter((val: any) => val !== eachSite);
                }
            }
            setAllSites(accessSites);
        }
        else if (userType === "Admin") {
            setAllSites(sites);
        }
        else {
            setAllSites([])
        }
        getSites()
        // eslint-disable-next-line
    }, [userType])


    const getSites = async () => {
        try {
            setLoading(true)

            const site = userData.sites;
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setSitesData(data);
            setLoading(false);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }
    function isValidHttpUrl(string:any) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
      }

    const addUrl = async () => {
        setLoading(true)
        try {
           
            if (selectedSites.length > 0 && url.trim().length>0) {
                let response = isValidHttpUrl(url.trim())
                if(response){
                    await axios.post('/api/sites/addUrl', { email: email, type: userType, sites: selectedSites, forwardUrl: url.trim() },
                    {
                        headers: { authorization: "Bearer " + localStorage.getItem("token") }
                    })
                    enqueueSnackbar("URL added successfully.",{
                        variant: "success",
                    });
                setUrl('')
                setSelectedSites([])
                getSites();

                }else{
                    enqueueSnackbar("Invalid URL",{
                        variant: "error",
                    });  
                }
               
            }else if( url.trim().length === 0){
                enqueueSnackbar("Please Fill in the URL",{
                    variant: "error",
                }); 
            }else if(selectedSites.length === 0){
                enqueueSnackbar("Please Select a site",{
                    variant: "error",
                }); 
            }
            
        } catch (error) {

        }
        setLoading(false)

    }

    const closeDialog = () =>{
        setEditOpen(false);
        setData({})
        getSites();
    }
    const closeMultipleEditDialog = () =>{
        setMultipleEditOpen(false)
        getSites();
    }

    const closeDeleteDialog = () => {
        setDeleteOpen(false);
        setData({})
        getSites();
    }


    return (
        <Paper className={classes.root} elevation={0}>

            <div style={{ width:"100%", display: "flex", flexWrap:'wrap', justifyContent: 'space-between' }} className="--margin-bottom-large">
                <div className="--margin-bottom-large" style={{width:'70%',display:'flex', flexWrap:'wrap', justifyContent:'space-between'}}>
                    <div className="--margin-bottom-large">
                        <InputText
                            type="text"
                            placeholder="Enter Url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            name="URLName"

                        />
                    </div>
                    <div>
                        <MultiSelect
                            style={{ minWidth: "280px", maxWidth: '280px' }}
                            fullWidth={!!isMobile}
                            className="insights__refine-menu__multi-select"
                            options={allSites.sort().map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                            values={selectedSites}
                            onChange={(values) => {
                                const normalizedSites = Formatter.normalizeSites(values) || [];
                                setSelectedSites(normalizedSites);

                            }}
                        />
                    </div>
                </div>

          <div>
          <Button
                className="--margin-bottom-large"
                    onClick={addUrl}
                    style={{
                        backgroundColor: '#141414',
                        color: '#f6f6f6',
                        height: '38px',
                        marginRight:'10px'
                    }}
                    variant="contained"
                    size="small">Add URL</Button>

                  <Button
                  className="--margin-bottom-large"
                    onClick={()=>setMultipleEditOpen(true)}
                    style={{
                        backgroundColor: '#141414',
                        color: '#f6f6f6',
                        height: '38px',
                     
                    }}
                    variant="contained"
                    size="small">Edit URL</Button>
          </div>
                



            </div>

            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Site</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading ?
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}> <ProgressBar /> </div>
                                        </TableCell>
                                    </TableRow>
                                    :


                                    siteData.map((eachData: any, index: any) => {
                                        return eachData.forwardUrl && eachData.forwardUrl.length>0 &&
                                            <TableRow>

                                                <TableCell>{Formatter.capitalizeSite(eachData._id)}</TableCell>
                                                <TableCell >{eachData.forwardUrl.map((url: any) => (<p style={{ lineHeight: '1px' }}>{url}</p>))}</TableCell>
                                                <TableCell key={'action'} align='left'>
                                                    <ButtonGroup>
                                                        <Button onClick={() => { setData(eachData); setEditOpen(true); }}>Edit</Button>
                                                        <Button onClick={() => { setData(eachData); setDeleteOpen(true); }}>Delete</Button>
                                                    </ButtonGroup>
                                                </TableCell>

                                            </TableRow>

                                    })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <EditUrl site={data} editOpen={editOpen} closeDialog={closeDialog} userType={userType} email={email}/>
                <EditMultipleUrl sites={sites} editOpen={multipleEditOpen} closeDialog={closeMultipleEditDialog} userType={userType} email={email}/>

                <DeleteUrl site={data} deleteOpen = {deleteOpen} closeDialog={closeDeleteDialog} userType={userType} email={email}/>

            </React.Fragment>
        </Paper>
    );
}