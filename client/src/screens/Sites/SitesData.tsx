import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, ButtonGroup } from "@material-ui/core";
import axios from "axios";
import { AddSite } from "./AddSite";
import { EditSite } from "./EditSite";
import { DeleteSite } from "./DeleteSite";
import { UserContext, AuthContext } from "../../context";
import moment from "moment";
import ProgressBar from "../Reports/ProgressBar";
import { Flex } from "../../components";

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%'
  },
  container: {
      overflowY:'scroll',
      height:'60vh'
  },
});

export const SitesData: FC = () => {
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
    const classes = useStyles();
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [foundSites, setFoundSites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSite, setSelectedSite] = useState("");
    const [searchText,setSearchText] = useState('');
	const { email } = useContext(UserContext);
    const [columns, setColumns] = useState<any>([]);
  
	const getSites = async() => {
        try{
            setLoading(true)
            if(userLoginType === 'Operator'){
                setColumns(["Name", "Capacity", "Status",  "Action"]);
  
            }
            if(userLoginType === 'Admin'){
                setColumns(["Name", "Operator", "Capacity", "Status", "Contract Start", "Contract End", "Remaining Duration", "Action"])
             
            }
            const site= userData.sites;
            const {data} = await axios.post("/api/sites/siteDetails",{site}, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setFoundSites(data);
            setLoading(false);
        }
        catch(e:any){
            console.log("ERROR", e)
        }
    }

	useEffect(() => {
            getSites();
		// eslint-disable-next-line
	}, [userLoginType]);

    const filteredSites = foundSites.filter((site:any)=>{
        if(searchText===""){
            return site;
        }else if(site.name.toLowerCase().includes(searchText.toLowerCase())){
            return site;
        }
    })

    const handleCloseDialog = () => {
        setAddOpen(!addOpen);
        if(addOpen){
            getSites();
        }
    };

    const handleCloseEdit = () => {
        setSelectedSite("")
        setSearchText("");
        setEditOpen(!editOpen);
        if(editOpen){
            getSites();
        }
    };

    const handleCloseDelete = () => {
        setSelectedSite("")
        setDeleteOpen(!deleteOpen);
        if(deleteOpen){
            getSites();
        }
    };

    const getRemainingDuration = (end: any) => {
        const years = moment(end).diff(moment(), 'year');
        const months = moment(end).subtract(years, 'year').diff(moment(), 'month');
        const days = moment(end).subtract(12 * years + months, 'month').diff(moment(), 'day') + 1
        let duration = years ? years + ( years > 1 ? " Years " : " Year ") : "" ;
        duration = duration + (months ? months + ( months > 1 ? " Months " : " Month ") : "");
        duration = duration + (days ? days + ( days > 1 ? " Days " : " Day ") : "");
        return duration
    }

    const PriorityStatus = ["Critical", "High", "Medium", "Low"]

    return (
        <React.Fragment>
            <Paper className={classes.root}>

                <Flex justify="space-between" wrap="wrap">

                <h1>Sites</h1>
                <Flex justify="space-between" wrap="wrap">
                <input value={searchText} onChange={(e)=>{setSearchText(e.target.value)}} type="text" placeholder="Search Site" style={{paddingLeft:'10px',width:"280px",height:'38px',borderRadius:'10px',marginRight:'10px'}}></input>
                {userLoginType === "Admin" && 
                <Button variant="contained" style={{marginRight:'10px',borderRadius:'10px',height:'38px',color:'#f6f6f6',backgroundColor:'#141414'}} onClick={ () => handleCloseDialog() } > + ADD SITE</Button>
                }
                </Flex>
               
                </Flex>



                {
                    loading ? 
                        <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
                        <ProgressBar/>
                        </div>
                    :
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column:any) => (
                                            <TableCell key={column} align='left' >
                                                {column}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSites.map((site:any) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={site.name ? site.name : "name"}>
                                                <TableCell key={site.name ? site.name : "name"} align='left'>
                                                    {site.name ? site.name : ""} 
                                                </TableCell>
                                                {
                                                    userLoginType === 'Admin'  ?
                                                        <TableCell key={site?.operatorId?.email} align='left'>
                                                            {site?.operatorId?.email}
                                                        </TableCell>
                                                    :""
                                                }
                                                <TableCell key={site?.capacity} align='left'>
                                                    {site?.capacity}
                                                </TableCell>
                                                <TableCell key={site?.status} align='left'>
                                                    {site?.status}
                                                </TableCell>
                                                {
                                                    userLoginType === 'Admin' ?
                                                        <React.Fragment>
                                                            <TableCell key={site?.contractStart} align='left'>
                                                                { site && site.contractStart ? moment(site.contractStart).format('DD/MM/YYYY') : "NA"}
                                                            </TableCell>
                                                            <TableCell key={site?.contractEnd} align='left'>
                                                                { site && site.contractEnd ? moment(site.contractEnd).format('DD/MM/YYYY') : "NA"}
                                                            </TableCell>
                                                            <TableCell key={site + "duration"} align='left'>
                                                                { site && site.contractStart && site.contractEnd ? site.contractExpired ? 'Expired' : getRemainingDuration(site.contractEnd) : "NA"}
                                                            </TableCell>
                                                        </React.Fragment>
                                                    : ""
                                                }
                                                <TableCell key={'action'} align='left'>
                                                    <ButtonGroup>
                                                    { ((userData.siteInfoAccess && userData.siteInfoAccessSites.includes(site._id)) || userLoginType === 'Admin') &&<Button onClick={() => {setSelectedSite(site); setEditOpen(true);}}>Edit</Button>}
                                                    {
                                                        userLoginType === 'Admin' ?
                                                            <Button onClick={() => {setSelectedSite(site); setDeleteOpen(true);}}>Delete</Button>
                                                        :""
                                                    }
                                                    </ButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </Paper>
            <AddSite addOpen={addOpen} closeDialog={handleCloseDialog}/>
            <EditSite editOpen={editOpen} closeDialog={handleCloseEdit} site={selectedSite}/>
            <DeleteSite deleteOpen={deleteOpen} closeDialog={handleCloseDelete} site={selectedSite}/>
        </React.Fragment>
    );
}