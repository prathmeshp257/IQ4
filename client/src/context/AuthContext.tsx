import React, { useState, useEffect } from "react";
import axios from "axios";

import { Token } from "../utils";
import { PATHS } from "../constants/paths";
import { useHistory } from "react-router-dom";

interface Credentials {
  email: string | any;
  password: string | any;
}

const initialState = {
  userData: {
    _id:'',
    firstName: "",
    lastName: "",
    sites: [],
    email: null,
    operatorId: "",
    userType: "",
    isCoOperator:false,
    insightAccess: false,
    insightAccessSites: [] as any,
    siteInfoAccess: false,
    siteInfoAccessSites: [] as any,
    vrmCorrectionAccess: false,
    vrmCorrectionAccessSites: [] as any,
    forwardsAccess: false,
    forwardsAccessSites: [] as any,
    occupancyProAccess: false,
    occupancyProAccessSites:[] as any,
    occupancy24hAccess: false,
    occupancy24hAccessSites:[] as any,
    occupancyTableAccess: false,
    occupancyTableAccessSites:[] as any,
    iqStatAccess: false,
    iqStatAccessSites: [] as any,
    vrmValidator: false,
    vrmValidatorSites: [] as any,
    goNeutralAccess: false,
    goNeutralAccessSites: [] as any,
    voiSettingAccess: false,
    voiViewOnlyAccess: false,
    voiSettingAccessSites: [] as any,
    voiViewOnlyAccessSites: [] as any,
    voiPrivateAccess: false,
    voiPrivateAccessSites: [] as any,
    pDCalculatorAccess: false,
    pDCalculatorAccessSites: [] as any,
    voiSMSNotifyAccess: false,
    voiSMSNotifyAccessSites: [] as any,
    vehicleSearchAccess: false,
    vehicleSearchAccessSites: [] as any,
    vehicleSearchInsightAccess: false,
    vehicleSearchInsightAccessSites: [] as any,
    scheduledReportingAccess: false,
    scheduledReportingAccessSites: [] as any,
    basicOccupancyAccess: false,
    basicOccupancyAccessSites: [] as any,
    matchRateAlertAccess: false,
    matchRateAlertAccessSites: [] as any,
    excludeVrmAccess: false,
    excludeVrmAccessSites: [] as any,
    dashboardAccess: false,
    dashboardAccessSites: [] as any,
    iqVisionAccess: false,
    iqVisionAccessSites: [] as any,
  },
  onLogout: async (): Promise<void> => {},
  reloadUserData: async (credentials?: Credentials): Promise<void> => {},
  loading: false,
};

const AuthContext = React.createContext(initialState);

type AuthProviderProps = {
  children: React.ReactNode;
};

interface UserData {
  _id:any;
  firstName: any;
  lastName: any;
  email: any;
  sites: any;
  operatorId: any;
  userType: any;
  isCoOperator:any;
  insightAccess: any;
  insightAccessSites: any;
  siteInfoAccess: any;
  siteInfoAccessSites:any;
  occupancyProAccess:any;
  occupancyProAccessSites:any;
  occupancy24hAccess:any;
  occupancy24hAccessSites:any;
  occupancyTableAccess:any;
  occupancyTableAccessSites:any;
  vrmCorrectionAccess: any;
  vrmCorrectionAccessSites:any;
  forwardsAccess: any;
  forwardsAccessSites:any;
  iqStatAccess: any;
  iqStatAccessSites: any;
  vrmValidator: any;
  vrmValidatorSites: any;
  goNeutralAccess: any;
  goNeutralAccessSites: any;
  voiSettingAccess: any;
  voiViewOnlyAccess: any;
  voiSettingAccessSites: any;
  voiViewOnlyAccessSites: any;
  voiPrivateAccess: any;
  voiPrivateAccessSites: any;
  pDCalculatorAccess: any;
  pDCalculatorAccessSites: any;
  voiSMSNotifyAccess: any;
  voiSMSNotifyAccessSites: any;
  vehicleSearchAccess: any;
  vehicleSearchAccessSites: any;
  vehicleSearchInsightAccess: any;
  vehicleSearchInsightAccessSites: any;
  scheduledReportingAccess: any;
  scheduledReportingAccessSites: any;
  basicOccupancyAccess: any;
  basicOccupancyAccessSites: any;
  matchRateAlertAccess: any;
  matchRateAlertAccessSites: any;
  excludeVrmAccess: any;
  excludeVrmAccessSites: any;
  dashboardAccess: any;
  dashboardAccessSites: any;
  iqVisionAccess: any;
  iqVisionAccessSites: any;
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [userData, setUserData] = useState<UserData>({
    _id:"",
    firstName: "",
    lastName: "",
    sites: [],
    email: null,
    operatorId: "",
    userType: "",
    isCoOperator:false,
    insightAccess: false,
    insightAccessSites: [] as any,
    siteInfoAccess:false,
    siteInfoAccessSites: [] as any,
    vrmCorrectionAccess:false,
    vrmCorrectionAccessSites: [] as any,
    forwardsAccess:false,
    forwardsAccessSites: [] as any,
    occupancyProAccess:false,
    occupancyProAccessSites: [] as any,
    occupancy24hAccess:false,
    occupancy24hAccessSites: [] as any,
    occupancyTableAccess:false,
    occupancyTableAccessSites:[] as any,
    iqStatAccess: false,
    iqStatAccessSites: [] as any,
    vrmValidator: false,
    vrmValidatorSites: [] as any,
    goNeutralAccess: false,
    goNeutralAccessSites: [] as any,
    voiSettingAccess: false,
    voiViewOnlyAccess: false,
    voiSettingAccessSites: [] as any,
    voiViewOnlyAccessSites: [] as any,
    voiPrivateAccess: false,
    voiPrivateAccessSites: [] as any,
    pDCalculatorAccess: false,
    pDCalculatorAccessSites: [] as any,
    voiSMSNotifyAccess: false,
    voiSMSNotifyAccessSites: [] as any,
    vehicleSearchAccess: false,
    vehicleSearchAccessSites: [] as any,
    vehicleSearchInsightAccess: false,
    vehicleSearchInsightAccessSites: [] as any,
    scheduledReportingAccess: false,
    scheduledReportingAccessSites: [] as any,
    basicOccupancyAccess: false,
    basicOccupancyAccessSites: [] as any,
    matchRateAlertAccess: false,
    matchRateAlertAccessSites: [] as any,
    excludeVrmAccess: false,
    excludeVrmAccessSites: [] as any,
    dashboardAccess: false,
    dashboardAccessSites: [] as any,
    iqVisionAccess: false,
    iqVisionAccessSites: [] as any,
  });
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const onLogout = async () => {
    setUserData(initialState.userData);
    localStorage.clear();
    sessionStorage.clear();
    history?.push(PATHS.LOGIN);
  };

  const reloadUserData = async (credentials?: Credentials) => {
    setLoading(true)
    try {
      const userType = userData.userType;
      if (!credentials) {
        const { data } = await axios.post("/api/token", null, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        const token = data.token;
        if (token) {

          const payload = Token.user(token);
          let siteData = {} as any;
          if( payload.userType !== 'Admin'){
            const { data: data1 } = await axios.post(
            "api/users/retailers/getSites",
            { token: localStorage.getItem("token") },
            {
              headers: {
                authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          siteData = data1;
        }
          setUserData({
            _id: payload._id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            sites: payload.sites || [],
            email: payload.email,
            operatorId: payload.operatorId,
            userType: payload.userType,
            isCoOperator:payload.isCoOperator,
            insightAccess: payload.userType === 'Admin' ? true : siteData ? siteData.insightAccess : false,
            insightAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.insightAccessSites : [],
            siteInfoAccess: payload.userType === 'Admin' ? true : siteData ? siteData.siteInfoAccess : false,
            siteInfoAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.siteInfoAccessSites : [],
            vrmCorrectionAccess: payload.userType === 'Admin' ? true : siteData ? siteData.vrmCorrectionAccess : false,
            vrmCorrectionAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.vrmCorrectionAccessSites : [],
            forwardsAccess: payload.userType === 'Admin' ? true : siteData ? siteData.forwardsAccess : false,
            forwardsAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.forwardsAccessSites : [],
            occupancyProAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancyProAccess : false,
            occupancyProAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancyProAccessSites : [], 
            occupancy24hAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancy24hAccess : false,
            occupancy24hAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancy24hAccessSites : [], 
            occupancyTableAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancyTableAccess : false,
            occupancyTableAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancyTableAccessSites : [], 
            iqStatAccess: payload.userType === 'Admin' ? true : siteData ? siteData.iqStatAccess : false,
            iqStatAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.iqStatAccessSites : [],
            vrmValidator: payload.userType === 'Admin' ? true : siteData ? siteData.vrmValidator : false,
            vrmValidatorSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.vrmValidatorSites : [],
            goNeutralAccess: payload.userType === 'Admin' ? true : siteData ? siteData.goNeutralAccess : false,
            goNeutralAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.goNeutralAccessSites : [],
            voiSettingAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiSettingAccess : false,
            voiViewOnlyAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiViewOnlyAccess : false,
            voiSettingAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.voiSettingAccessSites
              : [],
            voiViewOnlyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.voiViewOnlyAccessSites
              : [],
            voiPrivateAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiPrivateAccess : false,
            voiPrivateAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.voiPrivateAccessSites
              : [],
            pDCalculatorAccess: payload.userType === 'Admin' ? true : siteData ? siteData.pDCalculatorAccess : false,
            pDCalculatorAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.pDCalculatorAccessSites
              : [],
            voiSMSNotifyAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiSMSNotifyAccess : false,
            voiSMSNotifyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.voiSMSNotifyAccessSites
              : [],
            vehicleSearchAccess: payload.userType === 'Admin' ? true : siteData
              ? siteData.vehicleSearchAccess
              : false,
            vehicleSearchAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.vehicleSearchAccessSites
              : [],
            vehicleSearchInsightAccess: payload.userType === 'Admin' ? true : siteData
              ? siteData.vehicleSearchInsightAccess
              : false,
            vehicleSearchInsightAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.vehicleSearchInsightAccessSites
              : [],
            scheduledReportingAccess: payload.userType === 'Admin' ? true : siteData
              ? siteData.scheduledReportingAccess
              : false,
            scheduledReportingAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.scheduledReportingAccessSites
              : [],
            basicOccupancyAccess: payload.userType === 'Admin' ? true : siteData
              ? siteData.basicOccupancyAccess
              : false,
            basicOccupancyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.basicOccupancyAccessSites
              : [],
            matchRateAlertAccess: payload.userType === 'Admin' ? true : siteData
              ? siteData.matchRateAlertAccess
              : false,
            matchRateAlertAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.matchRateAlertAccessSites
              : [],
            excludeVrmAccess: payload.userType === 'Admin' ? true : siteData ? siteData.excludeVrmAccess : false,
            excludeVrmAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
              ? siteData.excludeVrmAccessSites
              : [],
            dashboardAccess: payload.userType === 'Admin' ? true : siteData ? siteData.dashboardAccess : false,
            dashboardAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.dashboardAccessSites : [],
            iqVisionAccess: payload.userType === 'Admin' ? true : siteData ? siteData.iqVisionAccess : false,
            iqVisionAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.iqVisionAccessSites : [],
          });
        }
      } else {

        const { data } = await axios.post(
          "/api/token/refresh",
          { ...credentials, userType },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const token = data.token;

        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem("token", token)

        if (token) {
          const payload = Token.user(token);


          setUserData({
            _id:payload._id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            sites: payload.sites || [],
            email: payload.email,
            operatorId: payload.operatorId,
            userType: payload.userType,
            isCoOperator:payload.isCoOperator,
            insightAccess: payload.insightAccess,
            insightAccessSites: payload.insightAccessSites,
            siteInfoAccess:payload.siteInfoAccess,
            siteInfoAccessSites:payload.siteInfoAccessSites,
            vrmCorrectionAccess:payload.vrmCorrectionAccess,
            vrmCorrectionAccessSites:payload.vrmCorrectionAccessSites,
            forwardsAccess:payload.forwardsAccess,
            forwardsAccessSites:payload.forwardsAccessSites,
            occupancyProAccess:payload.occupancyProAccess,
            occupancyProAccessSites:payload.occupancyProAccessSites,
            occupancy24hAccess:payload.occupancy24hAccess,
            occupancy24hAccessSites:payload.occupancy24hAccessSites,
            occupancyTableAccess:payload.occupancyTableAccess,
            occupancyTableAccessSites:payload.occupancyTableAccessSites,
            iqStatAccess: payload.iqStatAccess,
            iqStatAccessSites: payload.iqStatAccessSites,
            vrmValidator: payload.vrmValidator,
            vrmValidatorSites: payload.vrmValidatorSites,
            goNeutralAccess: payload.goNeutralAccess,
            goNeutralAccessSites: payload.goNeutralAccessSites,
            voiSettingAccess: payload.voiSettingAccess,
            voiViewOnlyAccess: payload.voiViewOnlyAccess,
            voiSettingAccessSites: payload.voiSettingAccessSites,
            voiViewOnlyAccessSites: payload.voiViewOnlyAccessSites,
            voiPrivateAccess: payload.voiPrivateAccess,
            voiPrivateAccessSites: payload.voiPrivateAccessSites,
            pDCalculatorAccess: payload.pDCalculatorAccess,
            pDCalculatorAccessSites: payload.pDCalculatorAccessSites,
            voiSMSNotifyAccess: payload.voiSMSNotifyAccess,
            voiSMSNotifyAccessSites: payload.voiSMSNotifyAccessSites,
            vehicleSearchAccess: payload.vehicleSearchAccess,
            vehicleSearchAccessSites: payload.vehicleSearchAccessSites,
            vehicleSearchInsightAccess: payload.vehicleSearchInsightAccess,
            vehicleSearchInsightAccessSites:
              payload.vehicleSearchInsightAccessSites,
            scheduledReportingAccess: payload.scheduledReportingAccess,
            scheduledReportingAccessSites:
              payload.scheduledReportingAccessSites,
            basicOccupancyAccess: payload.basicOccupancyAccess,
            basicOccupancyAccessSites: payload.basicOccupancyAccessSites,
            matchRateAlertAccess: payload.matchRateAlertAccess,
            matchRateAlertAccessSites: payload.matchRateAlertAccessSites,
            excludeVrmAccess: payload.excludeVrmAccess,
            excludeVrmAccessSites: payload.excludeVrmAccessSites,
            dashboardAccess: payload.dashboardAccess,
            dashboardAccessSites: payload.dashboardAccessSites,
            iqVisionAccess: payload.insightAccess,
            iqVisionAccessSites: payload.insightAccessSites,
          });
        }
      }
    } catch {}

    setLoading(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/token", null, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });

        const token = data.token;
        

        if(token){
        const payload = Token.user(token);
        let siteData = {} as any;
        if( payload.userType !== 'Admin'){
          const { data: data1 } = await axios.post(
          "api/users/retailers/getSites",
          { token: localStorage.getItem("token") },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        siteData = data1;
      }
        setUserData({
          _id:payload._id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          sites: payload.sites || [],
          email: payload.email,
          operatorId: payload.operatorId,
          userType: payload.userType,
          isCoOperator:payload.isCoOperator,
          insightAccess: payload.userType === 'Admin' ? true : siteData ? siteData.insightAccess : false,
          insightAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.insightAccessSites : [],
          siteInfoAccess: payload.userType === 'Admin' ? true : siteData ? siteData.siteInfoAccess : false,
          siteInfoAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.siteInfoAccessSites : [],
          vrmCorrectionAccess: payload.userType === 'Admin' ? true : siteData ? siteData.vrmCorrectionAccess : false,
          vrmCorrectionAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.vrmCorrectionAccessSites : [],
          forwardsAccess: payload.userType === 'Admin' ? true : siteData ? siteData.forwardsAccess : false,
          forwardsAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.forwardsAccessSites : [],
          occupancyProAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancyProAccess : false,
          occupancyProAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancyProAccessSites : [], 
          occupancy24hAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancy24hAccess : false,
          occupancy24hAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancy24hAccessSites : [], 
          occupancyTableAccess:payload.userType === 'Admin' ? true : siteData ? siteData.occupancyTableAccess : false,
          occupancyTableAccessSites:payload.userType === 'Admin' ? payload.sites : siteData ? siteData.occupancyTableAccessSites : [], 
          iqStatAccess: payload.userType === 'Admin' ? true : siteData ? siteData.iqStatAccess : false,
          iqStatAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.iqStatAccessSites : [],
          vrmValidator: payload.userType === 'Admin' ? true : siteData ? siteData.vrmValidator : false,
          vrmValidatorSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.vrmValidatorSites : [],
          goNeutralAccess: payload.userType === 'Admin' ? true : siteData ? siteData.goNeutralAccess : false,
          goNeutralAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.goNeutralAccessSites : [],
          voiSettingAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiSettingAccess : false,
          voiViewOnlyAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiViewOnlyAccess : false,
          voiSettingAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.voiSettingAccessSites
            : [],
          voiViewOnlyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.voiViewOnlyAccessSites
            : [],
          voiPrivateAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiPrivateAccess : false,
          voiPrivateAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.voiPrivateAccessSites
            : [],
          pDCalculatorAccess: payload.userType === 'Admin' ? true : siteData ? siteData.pDCalculatorAccess : false,
          pDCalculatorAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.pDCalculatorAccessSites
            : [],
          voiSMSNotifyAccess: payload.userType === 'Admin' ? true : siteData ? siteData.voiSMSNotifyAccess : false,
          voiSMSNotifyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.voiSMSNotifyAccessSites
            : [],
          vehicleSearchAccess: payload.userType === 'Admin' ? true : siteData
            ? siteData.vehicleSearchAccess
            : false,
          vehicleSearchAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.vehicleSearchAccessSites
            : [],
          vehicleSearchInsightAccess: payload.userType === 'Admin' ? true : siteData
            ? siteData.vehicleSearchInsightAccess
            : false,
          vehicleSearchInsightAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.vehicleSearchInsightAccessSites
            : [],
          scheduledReportingAccess: payload.userType === 'Admin' ? true : siteData
            ? siteData.scheduledReportingAccess
            : false,
          scheduledReportingAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.scheduledReportingAccessSites
            : [],
          basicOccupancyAccess: payload.userType === 'Admin' ? true : siteData
            ? siteData.basicOccupancyAccess
            : false,
          basicOccupancyAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.basicOccupancyAccessSites
            : [],
          matchRateAlertAccess: payload.userType === 'Admin' ? true : siteData
            ? siteData.matchRateAlertAccess
            : false,
          matchRateAlertAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.matchRateAlertAccessSites
            : [],
          excludeVrmAccess: payload.userType === 'Admin' ? true : siteData ? siteData.excludeVrmAccess : false,
          excludeVrmAccessSites: payload.userType === 'Admin' ? payload.sites : siteData
            ? siteData.excludeVrmAccessSites
            : [],
          dashboardAccess: payload.userType === 'Admin' ? true : siteData ? siteData.dashboardAccess : false,
          dashboardAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.dashboardAccessSites : [],
          iqVisionAccess: payload.userType === 'Admin' ? true : siteData ? siteData.insightAccess : false,
          iqVisionAccessSites: payload.userType === 'Admin' ? payload.sites : siteData ? siteData.insightAccessSites : [],
        });
      }
 
      } catch (e) {
        setTimeout(() => {
          history?.push(PATHS.LOGIN);
        }, 100);
      }
      setLoading(false);
    };

    if (window.location.pathname !== PATHS.LOGIN) {
      verifyToken();
    }
  }, [history]);

  const value = {
    userData,
    onLogout,
    reloadUserData,
    loading,
  };
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer, AuthContext };
