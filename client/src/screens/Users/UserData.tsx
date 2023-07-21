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
import { AddUser } from "./AddUser";
import { EditUser } from "./EditUser";
import { DeleteUser } from "./DeleteUser";
import axios from "axios";
import { UserContext, AuthContext, SiteContext } from "../../context";
import ProgressBar from "../Reports/ProgressBar";
import { DisableUser } from "./DisableUser";



interface Props {
  type:any;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10,
    borderRadius: '10px'
  },
  container: {
    maxHeight: 400,
    minHeight: 200
  },
});


let columns = ["Name", "Email","Action"];

export const UserData: FC<Props> = ({type}) => {
	const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext)
	const userLoginType = userData.userType;
  const userType = type && type.title ? type.title : userLoginType === "Retailer" ? 'Customer' :  userLoginType === "Operator" ? 'Retailer' : userLoginType === "Admin" ? 'Admin': "Customer"
  const classes = useStyles();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
	const { email } = useContext(UserContext);
  const [selectedSite,setSelectedSite] =  useState<string []>([]);
  const [allSites, setAllSites] = useState<any>([]);
  const [dialogOpen,setDialogOpen] = useState(false);
  const [disabled,setDisabled] =  useState(false);
		 
  const getUsers = async (userType:string) => {
      setLoading(true)
      try {

        if(userType === 'Retailer'){
          columns = ["Name", "Email", "Operator", "Action"]
          const { data } = await axios.get(`/api/users/retailers?operator=${userLoginType === "Operator" ? email : ""}`, {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
          });
          setFoundUsers(data);
          setLoading(false);
        }
        if(userType === 'Operator'){
          columns = ["Name", "Email", "Allowances", "Action"]
          const { data } = await axios.get("/api/users/operators", {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
          });
          setFoundUsers(data);
          setLoading(false);
        }
        if(userType === 'Customer'){
          columns = ["Name", "Email", "Retailer", "Limit", "Action"]
          const { data } = await axios.get(`/api/users/customers?retailer=${userLoginType === "Retailer" ? email : ""}`, {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
          });
          setFoundUsers(data);
          setLoading(false);
        }
        if(userType === 'Admin'){
          columns = ["Name", "Email", "Location", "Action"]
          const { data } = await axios.get("/api/users/admin", {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
          });
          setFoundUsers(data);
          setLoading(false);
        }
  
        if(userType === 'Collaborator'){
          columns = userLoginType === 'Admin' ? ["Name", "Email", "Operator", "Action"]: ["Name", "Email","Action"]
          const { data } = await axios.get(`/api/users/getCoOperator?operator=${userLoginType === 'Operator' ? email: ''}&userType=${userLoginType}`, {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
          });

          setFoundUsers(data);
          setLoading(false);
        }
      
      } catch (error:any) {
        console.log("errror",error)
      }
    
    }

   
useEffect(()=>{
 //setDisabled(foundUsers.userDisabled)
},[foundUsers])
    

	useEffect(() => {
    setFoundUsers([]);
    getUsers(userType);
		// eslint-disable-next-line
	}, [userType]);

  const handleCloseDialog = () => {
    setAddOpen(!addOpen);
    if(addOpen){
      getUsers(userType);
    }
  };

  const handleCloseEdit = () => {
    setUser("")
    setEditOpen(!editOpen);
    if(editOpen){
      getUsers(userType);
    }
  };

  useEffect(()=>{
  getUsers(userType)
  },[selectedSite])

  const setDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDelete = () => {
    setUser("")
    setDeleteOpen(!deleteOpen);
    if(deleteOpen){
      getUsers(userType);
    }
  };

  const handleCloseDisable = () => {
    setUser("")
    setDisableOpen(!disableOpen);
    if(disableOpen){
      getUsers(userType);
    }
  };

  return (
    <React.Fragment>
    <Paper className={classes.root}>

  
      <h1>{userType}
        <Button onClick={ () => handleCloseDialog() } style={{float:'right'}}>{`+ ADD ${((userLoginType === "Operator" && userType!='Collaborator' && userType!='Retailer') || userLoginType === "Retailer") ? "USER" : userType.toUpperCase()}`}</Button>
      </h1>
    
      {loading ? <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
      <ProgressBar />
      </div>:
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align='left'
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {foundUsers.map((users:any) => {
              
              return (
                
                <TableRow hover role="checkbox" tabIndex={-1} key={users.firstName ? users.firstName : "firstName"}>
                      <TableCell key={users.firstName ? users.firstName : "firstName"} align='left'>
                        {`${users.firstName ? users.firstName : ""} ${users.lastName ? users.lastName : ""}`}
                      </TableCell>
                     <TableCell key={users?.email} align='left'>
                        {users?.email}
                      </TableCell>

                      {
                        userType === 'Retailer' || (userLoginType==='Admin' && userType==='Collaborator') ?
                          <TableCell key={users?.operator?.email} align='left'>
                            {users?.operator?.email}
                          </TableCell>
                        :
                        userType === 'Operator' ?
                          <React.Fragment>
                            <TableCell key={users?.allowances} align='left'>
                              {users?.allowances}
                            </TableCell>
                          </React.Fragment>
                        :
                        userType === 'Customer'?
                          <React.Fragment>
                            <TableCell key={users?.retailer?.email} align='left'>
                              {users?.retailer?.email}
                            </TableCell>
                            <TableCell key={users?.limit} align='left'>
                              {users?.limit}
                            </TableCell>
                          </React.Fragment>
                        :
                        userType === 'Admin'  ?
                          <React.Fragment>
                            <TableCell key={users?.location} align='left'>
                              {users?.location}
                            </TableCell>
                          </React.Fragment>
                        :""
                      }
                    <TableCell key={'action'} align='left'>
                        <ButtonGroup>
                          <Button onClick={() => {setUser(users); setEditOpen(true);}}>Edit</Button>
                          <Button onClick={() => {setUser(users); setDeleteOpen(true);}}>Delete</Button>
                         { (userType !== 'Admin' && userLoginType === "Admin")  && <Button onClick={() => {setUser(users); setDisableOpen(true);}}>{ (users.operator?.disableUser===true || users?.disableUser===true || users.retailer?.disableUser===true )  ?"Enable":"Disable"}</Button>}
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
    <AddUser addOpen={addOpen} closeDialog={handleCloseDialog} userType={userType}/>
    <EditUser editOpen={editOpen} closeDialog={handleCloseEdit} userType={userType} user={user}/>
    <DeleteUser deleteOpen={deleteOpen} closeDialog={handleCloseDelete} userType={userType} user={user}/>
    <DisableUser disableOpen={disableOpen} closeDialog={handleCloseDisable} userType={userType} user={user}/>
    </React.Fragment>
  );
}