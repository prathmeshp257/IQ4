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
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";
import { AddCameraUrl } from "./AddCameraUrl";
import { EditCameraUrl } from "./EditCameraUrl";
import { DeleteUrl } from "./DeleteCameraUrl";




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

export const APISetting: FC<Props> = ({ sites }) => {
    const { userData } = useContext(AuthContext);
    const userType = userData.userType;
    const classes = useStyles();
    const [siteData, setSitesData] = useState<any>([])
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false)
   
    const { enqueueSnackbar } = useSnackbar();





    useEffect(() => {
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



    const addCameraUrl = async () => {
        setAddOpen(true);


    }

    const closeAddDialog = () => {
        setAddOpen(false);
    }

    const closeEditDialog = () => {
        setEditOpen(false);
        setData([]);

    }


    const closeDeleteDialog = () => {
        setDeleteOpen(false);
        getSites();


    }
    const editUrl = (eachData:any,camera:any) =>{
        eachData.camera = camera;
        setData(eachData); 
        setEditOpen(true);
    }
    const deleteUrl = (eachData:any,camera:any)=>{
        let values = {} as any;
        values.id= eachData._id;
        values.operatorId = eachData.operatorId;
        values.camera = camera;
        values.cameraApiAccess = true;
        setData(values); 
        setDeleteOpen(true); 
    }



    return (
        <Paper className={classes.root} elevation={0}>

            <div style={{ width: "100%", display: "flex", flexWrap: 'wrap', justifyContent: 'end' }} className="--margin-bottom-large">

                <div>
                    <Button
                        className="--margin-bottom-large"
                        onClick={addCameraUrl}
                        style={{
                            backgroundColor: '#141414',
                            color: '#f6f6f6',
                            height: '38px',
                            marginRight: '10px'
                        }}
                        variant="contained"
                        size="small">+ Add URL</Button>

                </div>




            </div>

            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Site</TableCell>
                                <TableCell>Camera Name</TableCell>
                                <TableCell>Camera IP</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Get Data</TableCell>
                                <TableCell>Interval (hrs)</TableCell>
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
                                        return (eachData.cameraDetails && eachData.cameraApiAccess) && eachData.cameraDetails.map((eachCamera: any,key:any) => (
                                            
                                            eachCamera.cameraData && eachCamera.cameraData.length > 0 && <TableRow>
                                               
                                                <TableCell>{Formatter.capitalizeSite(eachData._id)}</TableCell>
                                                <TableCell> {eachCamera.camera}</TableCell>
                                                <TableCell> {eachCamera.cameraIP}</TableCell>
                                                <TableCell>{
                                                        eachCamera.cameraData && eachCamera.cameraData.map((eachUrl: any, index: any) => (<>
                                                            <p>{eachUrl.title === "Input health" ? "Input voltage" : eachUrl.title}</p>
                                                        </>))
                                                    }
                                                </TableCell>
                                                <TableCell>{
                                                        eachCamera.cameraData && eachCamera.cameraData.map((eachUrl: any, index: any) => (<>
                                                            <p>{eachUrl.isChecked ? "TRUE" :'FALSE'}</p>
                                                        </>))
                                                    }
                                                </TableCell>
                                               
                                                
                                                <TableCell align="center">{
                                                        eachCamera.cameraData && eachCamera.cameraData.map((eachUrl: any, index: any) => (<>
                                                            <p>{eachUrl.interval}</p>
                                                        </>))
                                                    }
                                                </TableCell>
                                                

                                                <TableCell key={'action'} align='left'>
                                                    <ButtonGroup>
                                                        <Button onClick={() => { editUrl(eachData,eachCamera.camera) }}>Edit</Button>
                                                        <Button onClick={() => { deleteUrl(eachData,eachCamera.camera)}}>Delete</Button>
                                                    </ButtonGroup>
                                                </TableCell>

                                            </TableRow>
                                            
                                        ))
                                    })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddCameraUrl  addOpen={addOpen} closeDialog={closeAddDialog} />
                <EditCameraUrl site={data} editOpen={editOpen} closeDialog={closeEditDialog}/>
                <DeleteUrl site={data} deleteOpen={deleteOpen} closeDialog={closeDeleteDialog}/>
            </React.Fragment>
        </Paper>
    );
}