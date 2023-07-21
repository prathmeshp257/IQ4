import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Formatter } from "../utils/Formatter";
import axios from "axios";
import { typographyClasses } from "@mui/material";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  sites: [],
  adminLogo:'',
  operatorLogo: "",
  retailerLogo: "",
  customerLogo:'',
  loading: false,
  resetUserContext: () => {},
};

const UserContext = React.createContext(initialState);

type UserProviderProps = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: UserProviderProps): any => {
  const localAdminLogo = localStorage.getItem("adminLogo") || "";
  const localOperatorLogo = localStorage.getItem("operatorLogo") || "";
  const localRetailerLogo = localStorage.getItem("retailerLogo") || "";
  const localCustomerLogo = localStorage.getItem("customerLogo") || "";
  
  const[adminLogo,setAdminLogo] = useState(localAdminLogo);
  const [operatorLogo, setOperatorLogo] = useState(localOperatorLogo);
  const [retailerLogo, setRetailerLogo] = useState(localRetailerLogo);
  const [customerLogo,setCustomerLogo] = useState(localCustomerLogo);
  const { userData, loading } = useContext(AuthContext);
  const [firstName, setFirstName] = useState<any>();
  const [lastName, setLastName] = useState<any>();
  const [sites, setSites] = useState<any>([]);
  const [email, setEmail] = useState<any>();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setSites(Formatter.capitalizeSites(userData.sites).sort());
    setEmail(userData.email);
    setUserType(userData.userType);
  }, [userData]);

  

  useEffect(() => {
    const getLogos = async () => {
      try {
        if(localAdminLogo){
          setAdminLogo(localAdminLogo)
        }else if(localOperatorLogo){
        setOperatorLogo(localOperatorLogo);
       }else if(localRetailerLogo){
        setRetailerLogo(localRetailerLogo);
       }else if(localCustomerLogo){
        setCustomerLogo(localCustomerLogo)
       }else{
        if(email){
          const { data: logoData } = await axios.get(
            `/api/users/getLogos?email=${email}&userType=${userType}`,
            {
              headers: { authorization: "Bearer " + localStorage.getItem("token") },
            }
          );
          if (logoData) {
            if(userType==="Admin"){
              setAdminLogo(logoData.logoImg)
              localStorage.setItem("adminLogo", logoData.logoImg);
            }else if(userType==="Operator"){
              setOperatorLogo(logoData.logoImg)
              localStorage.setItem("operatorLogo", logoData.logoImg);
            }
            else if (userType === "Retailer") {
              setRetailerLogo(logoData.operatorLogo);
              localStorage.setItem("operatorLogo", logoData.operatorLogo);
            }else if(userType==="Customer"){
              setCustomerLogo(logoData.retailerLogo);
              localStorage.setItem("retailerLogo", logoData.retailerLogo);
            }
        
          }
        }
       }
      } catch (error) {
        console.log(error)
      }
    
    };
    if (!operatorLogo && !retailerLogo && !customerLogo && !adminLogo ) {
      getLogos();
    }
    // eslint-disable-next-line
  }, [email]);

  const resetUserContext = async () => {
    setFirstName("");
    setLastName("");
    setSites([]);
    setEmail("");
    setAdminLogo("");
    setOperatorLogo("");
    setRetailerLogo("");
    setCustomerLogo("");
  };

  const value = {
    firstName,
    lastName,
    email,
    sites,
    loading,
    setSites,
    adminLogo,
    operatorLogo,
    retailerLogo,
    customerLogo,
    resetUserContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const UserConsumer = UserContext.Consumer;

export { UserProvider, UserConsumer, UserContext };
