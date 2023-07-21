import React, { FC, useContext, useState, useEffect } from "react";
import { PATHS } from "../../constants/paths";
import { NavLink } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {UserData} from "./UserData";
import {SitesHome} from "../Sites/index";
import { useLocation } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import { AuthContext, SiteContext } from "../../context";
import { ForwardsURL } from "./ForwardsURL";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height:"auto",
    marginTop:90,
    marginLeft:10,
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
		borderRadius: '10px'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    maxWidth: `calc(100% - ${drawerWidth}px)`,
    height:"93vh"
  },
}));

export const UserNavbar: FC = () => {
	const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
	const userType = userData.userType;
	const { state } = useLocation();
  const isCoOperator = userData.isCoOperator;
	const [allSites, setAllSites] = useState<any[]>([]);
  let state2 = state as any;
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(userType === "Admin" ? 0 : userType === "Operator" ? 2 : userType === "Retailer" ? 3 : 0);

	useEffect(() => {
		if(userType === "Retailer"){
			let accessSites = [] as any;
      let availableSites = [];
      if(userData.excludeVrmAccess){
          availableSites = userData.excludeVrmAccessSites;
      }
      accessSites = availableSites;
			for(const eachSite of availableSites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setAllSites(accessSites);
		}
		else{
			setAllSites([])
		}
		// eslint-disable-next-line
	},[ userData, sitesData])

  const handleListItemClick = (index: number ) => {
    setSelectedIndex(index);
  };

	return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
      </AppBar>
      <CssBaseline />
        <Drawer 
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left" style={{ display:userType === "Admin" || userType === "Operator" || (userType === 'Retailer' && allSites && allSites.length > 0  || (userType === "Retailer" && userData.siteInfoAccess)) ? "block" : "none"}}
        >
        <List>
          {
            userType === "Admin" &&
              <React.Fragment>
                <ListItem 
                  key={'Admin'}
                  button
                  component={NavLink}
                  to={{pathname:`${PATHS.USERS}`, state: { title:'Admin'}}}
                  selected={selectedIndex === 0}
                  onClick={() => handleListItemClick(0)}
                >
                  <ListItemText primary={'Admin'} />
                </ListItem>
                <Divider />
                <ListItem 
                  key={'Operator'}
                  button
                  component={NavLink}
                  to={{pathname:`${PATHS.USERS}`, state: { title:'Operator'}}}
                  selected={selectedIndex === 1}
                  onClick={() => handleListItemClick(1)}
                >
                  <ListItemText primary={'Operator'} />
                </ListItem>
                <Divider />
              </React.Fragment>
          }
          {
            (userType === "Operator" || userType === "Admin") &&
              <React.Fragment>
                <ListItem 
                  key={'Retailer'}
                  button
                  component={NavLink}
                  to={{pathname:`${PATHS.USERS}`, state: { title:'Retailer'}}}
                  selected={selectedIndex === 2}
                  onClick={() => handleListItemClick(2)}
                >
                  <ListItemText primary={'Retailer'} />
                </ListItem>
                <Divider />
              </React.Fragment>
          }
          {
            
            (userType === "Retailer" || userType === "Admin") &&
            <React.Fragment>
              <ListItem 
                key={'Customer'} 
                button
                component={NavLink}
                to={{pathname:`${PATHS.USERS}`, state: { title:'Customer'}}}
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
              >
                <ListItemText primary={'End User'} />
              </ListItem>
              <Divider />
            </React.Fragment>
          }
                  {
            (userType === "Admin" || (userType === "Operator" && !isCoOperator )) &&
            <>
              <ListItem 
                key={'Collaborator'} 
                button
                component={NavLink}
                to={{pathname:`${PATHS.USERS}`, state: { title:'Collaborator'}}}
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4)}
              >
                <ListItemText primary={'Collaborator'} />
              </ListItem>
              <Divider />
              </>
          }
          {
            ((userType === "Admin" || userType === "Operator")  || (userType === "Retailer" && userData.siteInfoAccess))&&
            <>
              <ListItem 
                key={'Sites'} 
                button
                component={NavLink}
                to={{pathname:`${PATHS.USERS}`, state: { title:'Sites'}}}
                selected={selectedIndex === 5}
                onClick={() => handleListItemClick(5)}
              >
                <ListItemText primary={'Sites'} />
              </ListItem>
              <Divider />
              </>
          }
          {
            userType === "Retailer" && allSites && allSites.length > 0 &&
            <>
              <ListItem 
                key={"Remove VRM's From Stats"} 
                button
                component={NavLink}
                to={{pathname:`${PATHS.USERS}`, state: { title:"Remove VRM's From Stats"}}}
                selected={selectedIndex === 6}
                onClick={() => handleListItemClick(6)}
              >
                <ListItemText primary={"Remove VRM's From Stats"} />
              </ListItem>
              <Divider />
              </>
          }
          {
            userType === "Admin" && 
            <ListItem 
            key={"Corrected VRM"} 
            button
            component={NavLink}
            to={{pathname:`${PATHS.USERS}`, state: { title:"Corrected VRM"}}}
            selected={selectedIndex === 7}
            onClick={() => handleListItemClick(7)}
          >
            <ListItemText primary={"Corrected VRM"} />
          </ListItem>
          }
        </List>
      </Drawer>
      <main className={classes.content} style={{maxWidth: userType === "Admin" || userType === "Operator" || (userType === 'Retailer' && allSites && allSites.length > 0  || (userType === "Retailer" && userData.siteInfoAccess)) ? `calc(100% - ${drawerWidth}px)` : "100%" }}>
        <div className={classes.toolbar} />
        {
          state2?.title === 'Sites' || state2?.title === "Remove VRM's From Stats" ? 
            <SitesHome /> 
          : state2?.title === 'Corrected VRM'? <ForwardsURL/> :
            <UserData type={state}/>
        }
      </main>
    </div>
	);
};
