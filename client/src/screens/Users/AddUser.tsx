import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  UserSchema,
  OperatorSchema,
  RetailerSchema,
  CustomerSchema,
  Co_OperatorSchema
} from "../../validationScheemas/UserSchema";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext, AuthContext, SiteContext } from "../../context";
import axios from "axios";
import { useSnackbar } from "notistack";
import { UserDetails } from "./UserDetails";
import { Features } from "./Features";
import { useTreeItem } from "@mui/lab";

interface Props {
  addOpen: any;
  closeDialog: any;
  userType: any;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    maxHeight: "75vh",
    maxWidth: "650px",
  },
}));

const Form = styled.form`
  width: 100%;
`;

export const AddUser: FC<Props> = ({ addOpen, closeDialog, userType }) => {
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const userLoginType = userData.userType;
  const classes = useStyles();
  const { email } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState<number>(1);
  const [rawSites, setRawSites] = useState<any>([]);
  const [selectedSites, setSelectedSites] = useState<any>([]);
  const [operators, setOperators] = useState<any>([]);
  const [logo, setLogo] = useState<any>("");
  const [profile, setProfile] = useState<any>("");
  const [pdfTemplate, setPdfTemplate] = useState<any>("");
  const [footerLogo, setFooterLogo] = useState<any>("");
  const [retailers, setRetailers] = useState<any>([]);
  const [insightSites, setInsightSites] = useState<any>([]);
  const [siteInfoSites, setSiteInfoSites] = useState<string[]>([]);
  const [occupancyProSites,setOccupancyProSites] = useState<string[]>([]);
  const [occupancy24hSites,setOccupancy24hSites] = useState<string[]>([]);
  const [occupancyTableSites,setOccupancyTableSites] = useState<string[]>([]);
  const [vrmCorrectionSites, setVrmCorrectionSites] = useState<string[]>([]);
  const [forwardsSites,setForwardsSites] =  useState<string[]>([]);
  const [iqStatSites, setIqStatSites] = useState<any>([]);
  const [vrmValidatorSites, setVrmValidatorSites] = useState<any>([]);
  const [goNeutralSites, setGoNeutralSites] = useState<any>([]);
  const [voiSettingSites, setVOISettingSites] = useState<any>([]);
  const [voiPrivateSites, setVOIPrivateSites] = useState<any>([]);
  const [pDCalculatorSites, setPDCalculatorSites] = useState<any>([]);
  const [iqVisionSites, setIqVisionSites] = useState<any>([]);

  const [voiSMSNotifySites, setVOISMSNotifySites] = useState<any>([]);
  const [vehicleSearchSites, setVehicleSearchSites] = useState<any>([]);
  const [vehicleSearchInsightSites, setVehicleSearchInsightSites] =
    useState<any>([]);
  const [voiViewOnlySites, setVOIViewOnlySites] = useState<any>([]);
  const [scheduledReportingSites, setScheduledReportingSites] = useState<any>(
    []
  );
  const [url,setUrl] = useState('');
  const [basicOccupancySites, setBasicOccupancySites] = useState<any>([]);
  const [matchRateAlertSites, setMatchRateAlertSites] = useState<any>([]);
  const [hasInsightAccess, setInsightAccess] = useState<any>(false);
  const [hasSiteInfoAccess, setSiteInfoAccess] = useState<any>(false);
  const [haseOccupancyProAccess,setOccupancyProAccess] = useState<any>(false);
  const [haseOccupancy24hAccess,setOccupancy24hAccess] = useState<any>(false);
  const [haseOccupancyTableAccess,setOccupancyTableAccess] = useState<any>(false);
  const [hasVrmCorrectionAccess, setVrmCorrectionAccess] = useState<any>(false);
  const [hasForwardsAccess, setForwardsAccess] = useState<any>(false);
  const [hasIqStatAccess, setIqStatAccess] = useState<any>(false);
  const [hasGoNeutralAccess, setGoNeutralAccess] = useState<any>(false);
  const [hasVoiSettingAccess, setVoiSettingAccess] = useState<any>(false);
  const [hasVoiPrivateAccess, setVoiPrivateAccess] = useState<any>(false);
  const [hasPDCalculatorAccess, setPDCalculatorAccess] = useState<any>(false);
  const [hasVoiViewOnlyAccess, setVoiViewOnlyAccess] = useState<any>(false);
  const [hasVoiSMSNotifyAccess, setVoiSMSNotifyAccess] = useState<any>(false);
  const [hasVehicleSearchAccess, setVehicleSearchAccess] = useState<any>(false);
  const [hasVehicleSearchInsightAccess, setVehicleSearchInsightAccess] = useState<any>(false);
  const [hasVrmValidatorAccess, setVrmValidatorAccess] = useState<any>(false);
  const [hasScheduledReportingAccess, setScheduledReportingAccess] = useState<any>(false);
  const [hasBasicOccupancyAccess, setBasicOccupancyAccess] = useState<any>(false);
  const [hasMatchRateAlertAccess, setMatchRateAlertAccess] = useState<any>(false);
  const [hasIqVisionAccess, setIqVisionAccess] = useState<any>(false);
  const [permitableIqVisionSites, setPermitableIqVisionSites] = useState<any>([]);

  const [permitableInsightSites, setPermitableInsightSites] = useState<any>([]);
  const [permitableSiteInfoSites, setPermitablesiteInfoSites] = useState<any>([]);
  const [permitableVrmCorrectionSites, setPermitableVrmCorrectionSites] = useState<any>([]);
  const [permitableForwardsSites, setPermitableForwardsSites] = useState<any>([]);
  const [permitableOccupancyProSites, setPermitableOccupancyProSites] = useState<any>([]);
  const [permitableOccupancy24hSites, setPermitableOccupancy24hSites] = useState<any>([]);
  const [permitableOccupancyTableSites, setPermitableOccupancyTableSites] = useState<any>([]);
  const [permitableIqStatSites, setPermitableIqStatSites] = useState<any>([]);
  const [permitableVrmValidatorSites, setPermitableVrmValidatorSites] = useState<any>([]);
  const [permitableGoNeutralSites, setPermitableGoNeutralSites] = useState<any>([]);
  const [permitableVoiSettingSites, setPermitableVOISettingSites] = useState<any>([]);
  const [permitableVoiPrivateSites, setPermitableVOIPrivateSites] = useState<any>([]);
  const [permitablePDCalculatorSites, setPermitablePDCalculatorSites] = useState<any>([]);
  const [permitableVoiViewOnlySites, setPermitableVOIViewOnlySites] = useState<any>([]);
  const [permitableVoiSMSNotifySites, setPermitableVoiSMSNotifySites] = useState<any>([]);
  const [permitableVehicleSearchSites, setPermitableVehicleSearchSites] = useState<any>([]);
  const [permitableVehicleSearchInsightSites, setPermitableVehicleSearchInsightSites] = useState<any>([]);
  const [permitableScheduledReportingSites, setPermitableScheduledReportingSites] = useState<any>([]);
  const [permitableBasicOccupancySites, setPermitableBasicOccupancySites] = useState<any>([]);
  const [permitableMatchRateAlertSites, setPermitableMatchRateAlertSites] = useState<any>([]);
  const [excludeVrmSites, setExcludeVrmSites] = useState<any>([]);
  const [hasExcludeVrmAccess, setExcludeVrmAccess] = useState<any>(false);
  const [permitableExcludeVrmSites, setPermitableExcludeVrmSites] = useState<any>([]);
  const [dashboardSites, setDashboardSites] = useState<any>([]);
  const [hasDashboardAccess, setDashboardAccess] = useState<any>(false);
  const [permitableDashboardSites, setPermitableDashboardSites] = useState<any>([]);
  const [operatorId,setOperatorId] = useState<any>('');
  const insightAccessLocal = userData.insightAccess;
  const insightAccessSitesLocal = userData.insightAccessSites || [];
  const iqStatAccessLocal = userData.iqStatAccess;
  const iqStatAccessSitesLocal = userData.iqStatAccessSites || [];
  const goNeutralAccessLocal = userData.goNeutralAccess;
  const goNeutralAccessSitesLocal = userData.goNeutralAccessSites || [];
  const scheduledReportingAccessLocal = userData.scheduledReportingAccess;
  const scheduledReportingAccessSitesLocal = userData.scheduledReportingAccessSites || [];
  const voiSettingAccessLocal = userData.voiSettingAccess;
  const voiSettingAccessSitesLocal = userData.voiSettingAccessSites || [];
  const voiPrivateAccessLocal = userData.voiPrivateAccess;
  const voiPrivateAccessSitesLocal = userData.voiPrivateAccessSites || [];
  const pDCalculatorAccessLocal = userData.pDCalculatorAccess;
  const pDCalculatorAccessSitesLocal = userData.pDCalculatorAccessSites || [];
  const voiViewOnlyAccessLocal = userData.voiViewOnlyAccess;
  const voiViewOnlyAccessSitesLocal = userData.voiViewOnlyAccessSites || [];
  const vrmValidatorLocal = userData.vrmValidator;
  const vrmValidatorSitesLocal = userData.vrmValidatorSites || [];
  const allVoiSitesLocal = voiViewOnlyAccessSitesLocal.concat(voiSettingAccessSitesLocal);
  const uniqVoiSitesLocal = allVoiSitesLocal.filter((val: any, pos: any) => allVoiSitesLocal.indexOf(val) === pos);
  const voiSMSNotifyAccessLocal = userData.voiSMSNotifyAccess;
  const voiSMSNotifyAccessSitesLocal = userData.voiSMSNotifyAccessSites || [];
  const vehicleSearchAccessLocal = userData.vehicleSearchAccess;
  const vehicleSearchAccessSitesLocal = userData.vehicleSearchAccessSites || [];
  const vehicleSearchInsightAccessLocal = userData.vehicleSearchInsightAccess;
  const vehicleSearchInsightAccessSitesLocal = userData.vehicleSearchInsightAccessSites || [];
  const basicOccupancyAccessLocal = userData.basicOccupancyAccess;
  const basicOccupancyAccessSitesLocal = userData.basicOccupancyAccessSites || [];
  const matchRateAlertAccessLocal = userData.matchRateAlertAccess;
  const matchRateAlertAccessSitesLocal = userData.matchRateAlertAccessSites || [];
  const excludeVrmAccessLocal = userData.excludeVrmAccess;
  const excludeVrmAccessSitesLocal = userData.excludeVrmAccessSites || [];
  const dashboardAccessLocal = userData.dashboardAccess;
  const dashboardAccessSitesLocal = userData.dashboardAccessSites || [];
  const siteInfoAccessLocal = userData.siteInfoAccess;
	const siteInfoAccessSitesLocal = userData.siteInfoAccessSites || [];
  const occupancyProAccessLocal = userData.occupancyProAccess;
  const occupancyProAccessSitesLocal = userData.occupancyProAccessSites;
  const occupancy24hAccessLocal = userData.occupancy24hAccess;
  const occupancy24hAccessSitesLocal = userData.occupancy24hAccessSites;
  const occupancyTableAccessLocal = userData.occupancyTableAccess;
  const occupancyTableAccessSitesLocal = userData.occupancyTableAccessSites;
  const vrmCorrectionAccessLocal = userData.vrmCorrectionAccess;
	const vrmCorrectionAccessSitesLocal = userData.vrmCorrectionAccessSites || [];
  const forwardsAccessLocal = userData.forwardsAccess;
	const forwardsAccessSitesLocal = userData.forwardsAccessSites || [];
  const iqVisionAccesslocal = userData.iqVisionAccess;
  const iqVisionAccessSitesLocal = userData.iqVisionAccessSites || [];
  
  
  useEffect(() => {
    const getOperators = async () => {
      if (userType === "Retailer" || userType==='Collaborator') {
        const { data } = await axios.get("/api/operators/AllOperatorWithCoOperator", {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
     if(userLoginType === 'Operator'){
        const LoggedInOperator = data.filter((operator:any)=>{
          return operator.email === email
        })

        setOperatorId(LoggedInOperator[0]?LoggedInOperator[0]._id:'');
      }

        setOperators(data);
      }
    };
    getOperators();
  }, [userType]);

  useEffect(() => {
    setStep(1);
  }, [userType]);

  useEffect(() => {
    const getRetailers = async () => {
      if (userType === "Customer") {
        const { data } = await axios.get("/api/users/retailers", {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        setRetailers(data);
      }
    };
    getRetailers();
  }, [userType]);

  const handleSubmit = async (values: FormikValues) => {
    try {
    
  
      values.logoImg = logo;
      values.profileImg = profile;

      if(userType === "Retailer"){
        values.pdfTemplate = pdfTemplate ? pdfTemplate : '';

      }

      if (userType === "Retailer" || userType === "Operator") {
        values.insightAccess = values.insightAccess === "true" ? true : false;
        values.siteInfoAccess = values.siteInfoAccess === "true" ? true : false;
        values.vrmCorrectionAccess = values.vrmCorrectionAccess === "true" ? true : false;
        values.forwardsAccess = values.forwardsAccess === "true" ? true : false;
        values.occupancy24hAccess = values.occupancy24hAccess === 'true' ? true : false;
        values.occupancyProAccess = values.occupancyProAccess === 'true' ? true : false;
        values.occupancyTableAccess = values.occupancyTableAccess === 'true' ? true : false;
        values.iqStatAccess = values.iqStatAccess === "true" ? true : false;
        values.goNeutralAccess = values.goNeutralAccess === "true" ? true : false;
        values.vrmValidator = values.vrmValidator === "true" ? true : false;
        values.voiSettingAccess = values.voiSettingAccess === "true" ? true : false;
        values.voiPrivateAccess = values.voiPrivateAccess === "true" ? true : false;
        values.pDCalculatorAccess = values.pDCalculatorAccess === "true" ? true : false;
        values.voiViewOnlyAccess = values.voiViewOnlyAccess === "true" ? true : false;
        values.scheduledReportingAccess = values.scheduledReportingAccess === "true" ? true : false;
        values.voiSMSNotifyAccess = values.voiSMSNotifyAccess === "true" ? true : false;
        values.vehicleSearchAccess = values.vehicleSearchAccess === "true" ? true : false;
        values.vehicleSearchInsightAccess = values.vehicleSearchInsightAccess === "true" ? true : false;
        values.basicOccupancyAccess = values.basicOccupancyAccess === "true" ? true : false;
        values.matchRateAlertAccess = values.matchRateAlertAccess === "true" ? true : false;
        values.excludeVrmAccess = values.excludeVrmAccess === "true" ? true : false;
        values.dashboardAccess = values.dashboardAccess === "true" ? true : false;
        values.iqVisionAccess = values.iqVisionAccess === "true" ? true : false;


      }

      if (userType === "Retailer") {
        values.retailer = values.email;
        await axios.post("/api/users/retailer", values, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
      }

      if (userType === "Operator") {
        
        await axios.post("/api/users/operator", values, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
      }
      if(userType === "Collaborator"){
        values.operatorId= userLoginType==='Admin'? values.operator :operatorId;
        values.userType = userLoginType;
        await axios.post("/api/users/addCoOperator", values, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
      }

      if (userType === "Customer") {
        await axios.post("/api/users/customer", values, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
      }

      if (userType === "Admin") {
        await axios.post("/api/users/admin", values, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
      }

      enqueueSnackbar("User account created successfully.");
    } catch (e: any) {
      console.log("error",e);
      
      enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
        variant: "error",
      });
    }
    cancelAdd();
  };
  const cancelAdd = () => {
    formik.resetForm();
    setLogo("");
    setProfile("");
    setUrl('');
    setPdfTemplate("");
    setFooterLogo("");
    setSelectedSites([]);
    setInsightSites([]);
    setSiteInfoSites([]);
    setOccupancyProSites([]);
    setOccupancy24hSites([]);
    setOccupancyTableSites([]);
    setVrmCorrectionSites([]);
    setForwardsSites([]);
    setIqStatSites([]);
    setVrmValidatorSites([]);
    setGoNeutralSites([]);
    setVOISettingSites([]);
    setVOIPrivateSites([]);
    setVOIViewOnlySites([]);
    setScheduledReportingSites([]);
    setVOISMSNotifySites([]);
    setVehicleSearchSites([]);
    setVehicleSearchInsightSites([]);
    setBasicOccupancySites([]);
    setMatchRateAlertSites([]);
    setExcludeVrmSites([]);
    setDashboardSites([]);
    setIqVisionSites([]);
    closeDialog();
    setStep(1);
  };

  const imageChange = (event: any, type: string) => {
    event.preventDefault();
    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
	if (type === "profile") {
        setProfile(reader.result?.toString().split("base64,").pop());
      } else if (type === "pdfTemplate") {
        let b64 = reader.result?.toString().split("base64,").pop();
				const byteCharacters = window.atob(b64 ? b64:'');
                const byteArrays = [];
                const sliceSize = 512;
                const contentType = 'application/pdf';

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  const slice = byteCharacters.slice(offset, offset + sliceSize);

                  const byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }

                  const byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, { type: contentType });
				const url = URL.createObjectURL( blob );
				setUrl(url)
        setPdfTemplate(reader.result?.toString().split("base64,").pop());
      } else if (type === "footer") {
        setFooterLogo(reader.result?.toString().split("base64,").pop());
      }
    };

    reader.readAsDataURL(files[0]);
  };
  
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      sites: [] as any,
      location: "",
      contact: "",
      logoImg: "",
      profileImg: "",
      pdfTemplate: "",
      footerImg: "",
      operator: userLoginType === "Operator" ? email : "",
      allowances: "",
      retailer: userLoginType === "Retailer" ? email : "",
      limit: "",
      insightAccess: "false",
      insightAccessSites: [] as any,
      siteInfoAccess:"false",
      siteInfoAccessSites: [] as any,
      occupancyProAccess:'false',
      occupancyProAccessSites:[] as any,
      occupancy24hAccess:'false',
      occupancy24hAccessSites:[] as any,
      occupancyTableAccess:'false',
      occupancyTableAccessSites:[] as any,
      vrmCorrectionAccess:"false",
      vrmCorrectionAccessSites: [] as any,
      forwardsAccess:"false",
      forwardsAccessSites: [] as any,
      iqStatAccess: "false",
      iqStatAccessSites: [] as any,
      vrmValidator: "false",
      vrmValidatorSites: [] as any,
      goNeutralAccess: "false",
      goNeutralAccessSites: [] as any,
      voiSettingAccess: "false",
      voiViewOnlyAccess: "false",
      voiSettingAccessSites: [] as any,
      voiViewOnlyAccessSites: [] as any,
      voiPrivateAccess: "false",
      voiPrivateAccessSites: [] as any,
      pDCalculatorAccess: "false",
      pDCalculatorAccessSites: [] as any,
      voiSMSNotifyAccess: "false",
      voiSMSNotifyAccessSites: [] as any,
      vehicleSearchAccess: "false",
      vehicleSearchAccessSites: [] as any,
      vehicleSearchInsightAccess: "false",
      vehicleSearchInsightAccessSites: [] as any,
      scheduledReportingAccess: "false",
      scheduledReportingAccessSites: [] as any,
      basicOccupancyAccess: "false",
      basicOccupancyAccessSites: [] as any,
      matchRateAlertAccess: "false",
      matchRateAlertAccessSites: [] as any,
      excludeVrmAccess: "false",
      excludeVrmAccessSites: [] as any,
      dashboardAccess: "false",
      dashboardAccessSites: [] as any,
      iqVisionAccess: "false",
      iqVisionAccessSites: [] as any,
    },
    validationSchema:
      userType === "Retailer"
        ? RetailerSchema
        : userType === "Operator"
        ? OperatorSchema
        : userType === "Customer"
        ? CustomerSchema
        :userType==='Collaborator'
        ?Co_OperatorSchema
        : UserSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {

    const changedInsightSites = insightSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setInsightSites(changedInsightSites);
    formik.setFieldValue("insightAccessSites", changedInsightSites);

    const changedSiteInfoSites = siteInfoSites.filter((ele:string)=>selectedSites.includes(ele));
    setSiteInfoSites(changedSiteInfoSites);
    formik.setFieldValue("siteInfoAccessSites", changedSiteInfoSites);

    const changedOccupancyProSites = occupancyProSites.filter((ele:string)=>selectedSites.includes(ele));
    setOccupancyProSites(changedOccupancyProSites);
    formik.setFieldValue('occupancyProAccessSites',changedOccupancyProSites);

    const changedOccupancy24hSites = occupancy24hSites.filter((ele:string)=>selectedSites.includes(ele));
    setOccupancy24hSites(changedOccupancy24hSites);
    formik.setFieldValue('occupancy24hAccessSites',changedOccupancy24hSites);

    const changedOccupancyTableSites = occupancyTableSites.filter((ele:string)=>selectedSites.includes(ele));
    setOccupancyTableSites(changedOccupancyTableSites);
    formik.setFieldValue('occupancyTableAccessSites',changedOccupancyTableSites);
    
    const changedVrmCorrectionSites = vrmCorrectionSites.filter((ele:string)=>selectedSites.includes(ele));
    setVrmCorrectionSites(changedVrmCorrectionSites);
    formik.setFieldValue("vrmCorrectionAccessSites", changedVrmCorrectionSites);

    const changedForwardsSites = forwardsSites.filter((ele:string)=>selectedSites.includes(ele));
    setForwardsSites(changedForwardsSites);
    formik.setFieldValue("forwardsAccessSites", changedForwardsSites);

    const changedIqStatSites = iqStatSites.filter((ele: string) =>selectedSites.includes(ele));
    setIqStatSites(changedIqStatSites);
    formik.setFieldValue("iqStatAccessSites", changedIqStatSites);

    const changedGoNeutralSites = goNeutralSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setGoNeutralSites(changedGoNeutralSites);
    formik.setFieldValue("goNeutralAccessSites", changedGoNeutralSites);

    const changedVOIViewOnlySites = voiViewOnlySites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setVOIViewOnlySites(changedVOIViewOnlySites);
    formik.setFieldValue("voiViewOnlyAccessSites", changedVOIViewOnlySites);

    const changedVOIPrivateSites = voiPrivateSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setVOIPrivateSites(changedVOIPrivateSites);
    formik.setFieldValue("voiPrivateAccessSites", changedVOIPrivateSites);

    

    const changedVOISettingSites = voiSettingSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setVOISettingSites(changedVOISettingSites);
    formik.setFieldValue("voiSettingAccessSites", changedVOISettingSites);

    const changedScheduledReportSites = scheduledReportingSites.filter(
      (ele: string) => selectedSites.includes(ele)
    );
    setScheduledReportingSites(changedScheduledReportSites);
    formik.setFieldValue(
      "scheduledReportingAccessSites",
      changedScheduledReportSites
    );

    const changedVehicleSearchSites = vehicleSearchSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setVehicleSearchSites(changedVehicleSearchSites);
    formik.setFieldValue("vehicleSearchAccessSites", changedVehicleSearchSites);

    const changedBasicOccupancySites = basicOccupancySites.filter(
      (ele: string) => selectedSites.includes(ele)
    );
    setBasicOccupancySites(changedBasicOccupancySites);
    formik.setFieldValue(
      "basicOccupancyAccessSites",
      changedBasicOccupancySites
    );

    const changedMatchRateAlertSites = matchRateAlertSites.filter(
      (ele: string) => selectedSites.includes(ele)
    );
    setMatchRateAlertSites(changedMatchRateAlertSites);
    formik.setFieldValue(
      "matchRateAlertAccessSites",
      changedMatchRateAlertSites
    );

    const changedExcludeVrmSites = excludeVrmSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setExcludeVrmSites(changedExcludeVrmSites);
    formik.setFieldValue("excludeVrmAccessSites", changedExcludeVrmSites);

    const changedDashboardSites = dashboardSites.filter((ele: string) =>
      selectedSites.includes(ele)
    );
    setDashboardSites(changedDashboardSites);
    formik.setFieldValue("dashboardAccessSites", changedDashboardSites);

    const changedIqVisionSites = iqVisionSites.filter((ele: string) =>
    selectedSites.includes(ele)
  );
  setIqVisionSites(changedIqVisionSites);
  formik.setFieldValue("iqVisionAccessSites", changedIqVisionSites);
    // eslint-disable-next-line
  }, [selectedSites]);

  useEffect(() => {
    const changedVrmValidatorSites = vrmValidatorSites.filter((ele: string) =>
      iqStatSites.includes(ele)
    );
    setVrmValidatorSites(changedVrmValidatorSites);
    formik.setFieldValue("vrmValidatorSites", changedVrmValidatorSites);
    // eslint-disable-next-line
  }, [iqStatSites]);

  useEffect(() => {
    const changedPDCalculatorSites = pDCalculatorSites.filter((ele: string) =>
    insightSites.includes(ele)
  );
  setPDCalculatorSites(changedPDCalculatorSites);
  formik.setFieldValue("pDCalculatorAccessSites", changedPDCalculatorSites);
    // eslint-disable-next-line
  }, [insightSites]);


  useEffect(() => {
    const changedOccupancyTableSites = occupancyTableSites.filter((ele: string) =>
      dashboardSites.includes(ele)
    );
    setOccupancyTableSites(changedOccupancyTableSites);
    formik.setFieldValue("occupancyTableAccessSites", changedOccupancyTableSites);
    // eslint-disable-next-line
  }, [dashboardSites]);

  useEffect(() => {
    const changedVoiSMSNotifySites = voiSMSNotifySites.filter((ele: string) =>
      voiSettingSites.includes(ele)
    );
    setVOISMSNotifySites(changedVoiSMSNotifySites);
    formik.setFieldValue("voiSMSNotifyAccessSites", changedVoiSMSNotifySites);
    // eslint-disable-next-line
  }, [voiSettingSites]);

  useEffect(() => {
    const changedVehicleSearchInsightSites = vehicleSearchInsightSites.filter(
      (ele: string) => vehicleSearchSites.includes(ele)
    );
    setVehicleSearchInsightSites(changedVehicleSearchInsightSites);
    formik.setFieldValue(
      "vehicleSearchInsightAccessSites",
      changedVehicleSearchInsightSites
    );
    // eslint-disable-next-line
  }, [vehicleSearchSites]);

  useEffect(() => {
    const getRawSites = async () => {
      let allSites = [] as any;
      if (formik.values.operator) {
        let opSites = [] as any;
        operators.map((eachOp: any) =>
          eachOp.email === formik.values.operator
            ? (opSites = eachOp.sites)
            : ""
        );
        allSites = opSites;
      } else if (formik.values.retailer) {
        let reSites = [] as any;
        retailers.map((eachRe: any) =>
          eachRe.email === formik.values.retailer
            ? (reSites = eachRe.sites)
            : ""
        );
        allSites = reSites;
      } else if (userType !== "Retailer" && userType !== "Customer") {
        const { data } = await axios.get("/api/sites/raw", {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        allSites = data.sites;
      }

      let activeSites = [] as any;
      for (const eachSite of sitesData) {
        if (
          allSites.includes(eachSite.id) &&
          eachSite.contractExpired !== true
        ) {
          activeSites.push(eachSite.id);
        }
      }
      setRawSites(userType === "Admin" ? allSites : activeSites);
    };

    getRawSites();
    // eslint-disable-next-line
  }, [
    formik.values.operator,
    formik.values.retailer,
    retailers,
    operators,
    userType,
    sitesData,
  ]);

  useEffect(() => {
    const getAccess = async () => {
      const operatorData = await operators.filter(
        (eachOp: any) => eachOp.email === formik.values.operator
      );
      const allVoiSites =
        operatorData &&
        operatorData[0] &&
        operatorData[0].voiViewOnlyAccessSites &&
        operatorData[0].voiSettingAccessSites
          ? operatorData[0].voiViewOnlyAccessSites.concat(
              operatorData[0].voiSettingAccessSites
            )
          : operatorData &&
            operatorData[0] &&
            operatorData[0].voiViewOnlyAccessSites
          ? operatorData[0].voiViewOnlyAccessSites
          : operatorData &&
            operatorData[0] &&
            operatorData[0].voiSettingAccessSites
          ? operatorData[0].voiSettingAccessSites
          : [];
      const uniqVoiSites = allVoiSites.filter(
        (val: any, pos: any) => allVoiSites.indexOf(val) === pos
      );

      const hasAccessToInsights =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].insightAccess &&
          operatorData[0].insightAccessSites &&
          operatorData[0].insightAccessSites[0]) ||
        (userLoginType === "Operator" &&
          insightAccessLocal &&
          insightAccessSitesLocal.length > 0 &&
          insightAccessSitesLocal[0]);

          const hasAccessToSiteInfo =
          (userLoginType === "Admin" && userType === "Operator") ||
          (userLoginType === "Admin" &&
            userType === "Retailer" &&
            operatorData &&
            operatorData[0] &&
            operatorData[0].siteInfoAccess &&
            operatorData[0].siteInfoAccessSites &&
            operatorData[0].siteInfoAccessSites[0]) ||
          (userLoginType === "Operator" &&
          siteInfoAccessLocal &&
          siteInfoAccessSitesLocal.length > 0 &&
          siteInfoAccessSitesLocal[0]);

          const hasAccessToVrmCorrection =
          (userLoginType === "Admin" && userType === "Operator") ||
          (userLoginType === "Admin" &&
            userType === "Retailer" &&
            operatorData &&
            operatorData[0] &&
            operatorData[0].vrmCorrectionAccess &&
            operatorData[0].vrmCorrectionAccessSites &&
            operatorData[0].vrmCorrectionAccessSites[0]) ||
          (userLoginType === "Operator" &&
          vrmCorrectionAccessLocal &&
          vrmCorrectionAccessSitesLocal.length > 0 &&
          vrmCorrectionAccessSitesLocal[0]);

          const hasAccessToForwards =
          (userLoginType === "Admin" && userType === "Operator") ||
          (userLoginType === "Admin" &&
            userType === "Retailer" &&
            operatorData &&
            operatorData[0] &&
            operatorData[0].forwardsAccess &&
            operatorData[0].forwardsAccessSites &&
            operatorData[0].forwardsAccessSites[0]) ||
          (userLoginType === "Operator" &&
          forwardsAccessLocal &&
          forwardsAccessSitesLocal.length > 0 &&
          forwardsAccessSitesLocal[0]);

      const hasAccessToIqStats =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].iqStatAccess &&
          operatorData[0].iqStatAccessSites &&
          operatorData[0].iqStatAccessSites[0]) ||
        (userLoginType === "Operator" &&
          iqStatAccessLocal &&
          iqStatAccessSitesLocal.length > 0 &&
          iqStatAccessSitesLocal[0]);

      const hasAccessToOccupancyPro = (userLoginType === 'Admin' && userType === 'Operator') ||
      (userLoginType === "Admin" && userType === 'Retailer' && operatorData && 
      operatorData[0] && operatorData[0].occupancyProAccess &&
      operatorData[0].occupancyProAccessSites && 
      operatorData[0].occupancyProAccessSites[0]) ||
      (userLoginType === 'Operator' && 
       occupancyProAccessLocal && 
       occupancyProAccessSitesLocal.length > 0 &&
       occupancyProAccessSitesLocal[0]);

       const hasAccessToOccupancy24h = (userLoginType === 'Admin' && userType === 'Operator') ||
      (userLoginType === "Admin" && userType === 'Retailer' && operatorData && 
      operatorData[0] && operatorData[0].occupancy24hAccess &&
      operatorData[0].occupancy24hAccessSites && 
      operatorData[0].occupancy24hAccessSites[0]) ||
      (userLoginType === 'Operator' && 
       occupancy24hAccessLocal && 
       occupancy24hAccessSitesLocal.length > 0 &&
       occupancy24hAccessSitesLocal[0]);


       const hasAccessToOccupancyTable = (userLoginType === 'Admin' && userType === 'Operator') ||
      (userLoginType === "Admin" && userType === 'Retailer' && operatorData && 
      operatorData[0] && operatorData[0].occupancyTableAccess &&
      operatorData[0].occupancyTableAccessSites && 
      operatorData[0].occupancyTableAccessSites[0]) ||
      (userLoginType === 'Operator' && 
       occupancyTableAccessLocal && 
       occupancyTableAccessSitesLocal.length > 0 &&
       occupancyTableAccessSitesLocal[0]);

      const hasAccessToGoNeutral =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].goNeutralAccess &&
          operatorData[0].goNeutralAccessSites &&
          operatorData[0].goNeutralAccessSites[0]) ||
        (userLoginType === "Operator" &&
          goNeutralAccessLocal &&
          goNeutralAccessSitesLocal.length > 0 &&
          goNeutralAccessSitesLocal[0]);

      const hasAccessToVoiSettings =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].voiSettingAccess &&
          operatorData[0].voiSettingAccessSites &&
          operatorData[0].voiSettingAccessSites[0]) ||
        (userLoginType === "Operator" &&
          voiSettingAccessLocal &&
          voiSettingAccessSitesLocal.length > 0 &&
          voiSettingAccessSitesLocal[0]);

      const hasAccessToVoiPrivates =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].voiPrivateAccess &&
          operatorData[0].voiPrivateAccessSites &&
          operatorData[0].voiPrivateAccessSites[0]) ||
        (userLoginType === "Operator" &&
          voiPrivateAccessLocal &&
          voiPrivateAccessSitesLocal.length > 0 &&
          voiPrivateAccessSitesLocal[0]);

      const hasAccessToPDCalculator =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].pDCalculatorAccess &&
          operatorData[0].pDCalculatorAccessSites &&
          operatorData[0].pDCalculatorAccessSites[0]) ||
        (userLoginType === "Operator" &&
          pDCalculatorAccessLocal &&
          pDCalculatorAccessSitesLocal.length > 0 &&
          pDCalculatorAccessSitesLocal[0]);

      const hasAccessToVoiViewOnly =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          (operatorData[0].voiViewOnlyAccess ||
            operatorData[0].voiSettingAccess) &&
          uniqVoiSites &&
          uniqVoiSites[0]) ||
        (userLoginType === "Operator" &&
          (voiViewOnlyAccessLocal || voiSettingAccessLocal) &&
          uniqVoiSitesLocal.length > 0 &&
          uniqVoiSitesLocal[0]);

      const hasAccessToVrmValidator =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].vrmValidator &&
          operatorData[0].vrmValidatorSites &&
          operatorData[0].vrmValidatorSites[0]) ||
        (userLoginType === "Operator" &&
          vrmValidatorLocal &&
          vrmValidatorSitesLocal.length > 0 &&
          vrmValidatorSitesLocal[0]);

      const hasAccessToScheduledReporting =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].scheduledReportingAccess &&
          operatorData[0].scheduledReportingAccessSites &&
          operatorData[0].scheduledReportingAccessSites[0]) ||
        (userLoginType === "Operator" &&
          scheduledReportingAccessLocal &&
          scheduledReportingAccessSitesLocal.length > 0 &&
          scheduledReportingAccessSitesLocal[0]);

      const hasAccessToVoiSMSNotify =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].voiSMSNotifyAccess &&
          operatorData[0].voiSMSNotifyAccessSites &&
          operatorData[0].voiSMSNotifyAccessSites[0]) ||
        (userLoginType === "Operator" &&
          voiSMSNotifyAccessLocal &&
          voiSMSNotifyAccessSitesLocal.length > 0 &&
          voiSMSNotifyAccessSitesLocal[0]);

      const hasAccessToVehicleSearch =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].vehicleSearchAccess &&
          operatorData[0].vehicleSearchAccessSites &&
          operatorData[0].vehicleSearchAccessSites[0]) ||
        (userLoginType === "Operator" &&
          vehicleSearchAccessLocal &&
          vehicleSearchAccessSitesLocal.length > 0 &&
          vehicleSearchAccessSitesLocal[0]);

      const hasAccessToVehicleSearchInsight =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].vehicleSearchInsightAccess &&
          operatorData[0].vehicleSearchInsightAccessSites &&
          operatorData[0].vehicleSearchInsightAccessSites[0]) ||
        (userLoginType === "Operator" &&
          vehicleSearchInsightAccessLocal &&
          vehicleSearchInsightAccessSitesLocal.length > 0 &&
          vehicleSearchInsightAccessSitesLocal[0]);

      const hasAccessToBasicOccupancy =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].basicOccupancyAccess &&
          operatorData[0].basicOccupancyAccessSites &&
          operatorData[0].basicOccupancyAccessSites[0]) ||
        (userLoginType === "Operator" &&
          basicOccupancyAccessLocal &&
          basicOccupancyAccessSitesLocal.length > 0 &&
          basicOccupancyAccessSitesLocal[0]);

      const hasAccessToMatchRateAlert =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].matchRateAlertAccess &&
          operatorData[0].matchRateAlertAccessSites &&
          operatorData[0].matchRateAlertAccessSites[0]) ||
        (userLoginType === "Operator" &&
          matchRateAlertAccessLocal &&
          matchRateAlertAccessSitesLocal.length > 0 &&
          matchRateAlertAccessSitesLocal[0]);

      const hasAccessToIqVision =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].iqVisionAccess &&
          operatorData[0].iqVisionAccessSites &&
          operatorData[0].iqVisionAccessSites[0]) ||
        (userLoginType === "Operator" &&
          iqVisionAccesslocal &&
          iqVisionAccessSitesLocal.length > 0 &&
          iqVisionAccessSitesLocal[0]);

      let filterSites = [] as any;
      sitesData.map((site: any) => {
        if (selectedSites.includes(site.id) && site.apiAccess === true) {
          filterSites.push(site.id);
        }
      });
      const insightsPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? filterSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToInsights
          ? operatorData[0].insightAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToInsights
          ? insightAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];
          const siteInfoPermitableSites =
          userLoginType === "Admin" && userType === "Operator"
            ? selectedSites
            : userLoginType === "Admin" &&
              userType === "Retailer" &&
              hasAccessToSiteInfo
            ? operatorData[0].siteInfoAccessSites.filter((site: any) =>
                selectedSites.includes(site)
              )
            : userLoginType === "Operator" && hasAccessToSiteInfo
            ? siteInfoAccessSitesLocal.filter((site: any) =>
                selectedSites.includes(site)
              )
            : [];

          const occupancyProPermitableSites = 
          userLoginType === 'Admin' && userType === 'Operator'
          ? selectedSites : userLoginType === 'Admin' &&
          userType === 'Retailer' && 
          hasAccessToOccupancyPro ? operatorData[0].occupancyProAccessSites.filter((site:any)=>
          selectedSites.includes(site)):userLoginType === 'Operator' && hasAccessToOccupancyPro
          ?occupancyProAccessSitesLocal.filter((site:any)=>
          selectedSites.includes(site)):[];

          const occupancy24hPermitableSites = 
          userLoginType === 'Admin' && userType === 'Operator'
          ? selectedSites : userLoginType === 'Admin' &&
          userType === 'Retailer' && 
          hasAccessToOccupancy24h ? operatorData[0].occupancy24hAccessSites.filter((site:any)=>
          selectedSites.includes(site)):userLoginType === 'Operator' && hasAccessToOccupancy24h
          ?occupancy24hAccessSitesLocal.filter((site:any)=>
          selectedSites.includes(site)):[];
           
          let filterOccupancyTableSites = [] as any;
          sitesData.map((site: any) => {
            if (dashboardSites.includes(site.id)) {
              filterOccupancyTableSites.push(site.id);
            }
          });

          const occupancyTablePermitableSites = 
          userLoginType === 'Admin' && userType === 'Operator'
          ? filterOccupancyTableSites : userLoginType === 'Admin' &&
          userType === 'Retailer' && 
          hasAccessToOccupancyTable ? operatorData[0].occupancyTableAccessSites.filter((site:any)=>
          dashboardSites.includes(site)):userLoginType === 'Operator' && hasAccessToOccupancyTable
          ?occupancyTableAccessSitesLocal.filter((site:any)=>
          dashboardSites.includes(site)):[];

            const vrmCorrectionPermitableSites =
          userLoginType === "Admin" && userType === "Operator"
            ? selectedSites
            : userLoginType === "Admin" &&
              userType === "Retailer" &&
              hasAccessToVrmCorrection
            ? operatorData[0].vrmCorrectionAccessSites.filter((site: any) =>
                selectedSites.includes(site)
              )
            : userLoginType === "Operator" && hasAccessToVrmCorrection
            ? vrmCorrectionAccessSitesLocal.filter((site: any) =>
                selectedSites.includes(site)
              )
            : [];

            const forwardsPermitableSites =
            userLoginType === "Admin" && userType === "Operator"
              ? selectedSites
              : userLoginType === "Admin" &&
                userType === "Retailer" &&
                hasAccessToForwards
              ? operatorData[0].forwardsAccessSites.filter((site: any) =>
                  selectedSites.includes(site)
                )
              : userLoginType === "Operator" && hasAccessToForwards
              ? forwardsAccessSitesLocal.filter((site: any) =>
                  selectedSites.includes(site)
                )
              : [];

      const iqStatsPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToIqStats
          ? operatorData[0].iqStatAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToIqStats
          ? iqStatAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const goNeutralPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToGoNeutral
          ? operatorData[0].goNeutralAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToGoNeutral
          ? goNeutralAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      let filterVrmSites = [] as any;
      sitesData.map((site: any) => {
        if (iqStatSites.includes(site.id) && site.apiAccess === true) {
          filterVrmSites.push(site.id);
        }
      });
      const vrmValidatorPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? filterVrmSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVrmValidator
          ? operatorData[0].vrmValidatorSites.filter((site: any) =>
              iqStatSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVrmValidator
          ? vrmValidatorSitesLocal.filter((site: any) =>
              iqStatSites.includes(site)
            )
          : [];

      const voiSettingPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVoiSettings
          ? operatorData[0].voiSettingAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVoiSettings
          ? voiSettingAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const voiPrivatePermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVoiPrivates
          ? operatorData[0].voiPrivateAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVoiPrivates
          ? voiPrivateAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

        const pDCalculatorPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToPDCalculator
          ? operatorData[0].pDCalculatorAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToPDCalculator
          ? pDCalculatorAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const voiViewOnlyPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            (hasAccessToVoiViewOnly || hasAccessToVoiSettings)
          ? uniqVoiSites.filter((site: any) => selectedSites.includes(site))
          : userLoginType === "Operator" &&
            (hasAccessToVoiViewOnly || hasAccessToVoiSettings)
          ? uniqVoiSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const scheduledReportingPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToScheduledReporting
          ? operatorData[0].scheduledReportingAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToScheduledReporting
          ? scheduledReportingAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const voiSMSNotifyPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? voiSettingSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVoiSMSNotify
          ? operatorData[0].voiSMSNotifyAccessSites.filter((site: any) =>
              voiSettingSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVoiSMSNotify
          ? voiSMSNotifyAccessSitesLocal.filter((site: any) =>
              voiSettingSites.includes(site)
            )
          : [];

      const vehicleSearchPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVehicleSearch
          ? operatorData[0].vehicleSearchAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVehicleSearch
          ? vehicleSearchAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      let filterSearchInsightSites = [] as any;
      sitesData.map((site: any) => {
        if (vehicleSearchSites.includes(site.id) && site.apiAccess === true) {
          filterSearchInsightSites.push(site.id);
        }
      });
      const vehicleSearchInsightPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? filterSearchInsightSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToVehicleSearchInsight
          ? operatorData[0].vehicleSearchInsightAccessSites.filter(
              (site: any) => vehicleSearchSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToVehicleSearchInsight
          ? vehicleSearchInsightAccessSitesLocal.filter((site: any) =>
              vehicleSearchSites.includes(site)
            )
          : [];

      const basicOccupancyPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToBasicOccupancy
          ? operatorData[0].basicOccupancyAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToBasicOccupancy
          ? basicOccupancyAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const matchRateAlertPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToMatchRateAlert
          ? operatorData[0].matchRateAlertAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToMatchRateAlert
          ? matchRateAlertAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const hasAccessToExcludeVrm =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].excludeVrmAccess &&
          operatorData[0].excludeVrmAccessSites &&
          operatorData[0].excludeVrmAccessSites[0]) ||
        (userLoginType === "Operator" &&
          excludeVrmAccessLocal &&
          excludeVrmAccessSitesLocal.length > 0 &&
          excludeVrmAccessSitesLocal[0]);

      const excludeVrmPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToExcludeVrm
          ? operatorData[0].excludeVrmAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToExcludeVrm
          ? excludeVrmAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      const hasAccessToDashboard =
        (userLoginType === "Admin" && userType === "Operator") ||
        (userLoginType === "Admin" &&
          userType === "Retailer" &&
          operatorData &&
          operatorData[0] &&
          operatorData[0].dashboardAccess &&
          operatorData[0].dashboardAccessSites &&
          operatorData[0].dashboardAccessSites[0]) ||
        (userLoginType === "Operator" &&
          dashboardAccessLocal &&
          dashboardAccessSitesLocal.length > 0 &&
          dashboardAccessSitesLocal[0]);

      const dashboardPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? selectedSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToDashboard
          ? operatorData[0].dashboardAccessSites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToDashboard
          ? dashboardAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

         let filterIqVisionSites = [] as any;
      sitesData.map((site: any) => {
        if (selectedSites.includes(site.id) && site.apiAccess === true) {
          filterIqVisionSites.push(site.id);
        }
      });
      const iqVisionPermitableSites =
        userLoginType === "Admin" && userType === "Operator"
          ? filterSites
          : userLoginType === "Admin" &&
            userType === "Retailer" &&
            hasAccessToIqVision
          ? operatorData[0].iqVisionAccesssites.filter((site: any) =>
              selectedSites.includes(site)
            )
          : userLoginType === "Operator" && hasAccessToIqVision
          ? iqVisionAccessSitesLocal.filter((site: any) =>
              selectedSites.includes(site)
            )
          : [];

      setInsightAccess(hasAccessToInsights);
      setSiteInfoAccess(hasAccessToSiteInfo);
      setOccupancyProAccess(hasAccessToOccupancyPro);
      setOccupancy24hAccess(hasAccessToOccupancy24h);
      setOccupancyTableAccess(hasAccessToOccupancyTable);
      setVrmCorrectionAccess(hasAccessToVrmCorrection)
      setForwardsAccess(hasAccessToForwards);
      setIqStatAccess(hasAccessToIqStats);
      setGoNeutralAccess(hasAccessToGoNeutral);
      setVoiSettingAccess(hasAccessToVoiSettings);
      setVoiPrivateAccess(hasAccessToVoiPrivates);
      setPDCalculatorAccess(hasAccessToPDCalculator);
      setVoiViewOnlyAccess(hasAccessToVoiViewOnly);
      setVrmValidatorAccess(hasAccessToVrmValidator);
      setScheduledReportingAccess(hasAccessToScheduledReporting);
      setVoiSMSNotifyAccess(hasAccessToVoiSMSNotify);
      setVehicleSearchAccess(hasAccessToVehicleSearch);
      setVehicleSearchInsightAccess(hasAccessToVehicleSearchInsight);
      setBasicOccupancyAccess(hasAccessToBasicOccupancy);
      setMatchRateAlertAccess(hasAccessToMatchRateAlert);
      setPermitableInsightSites(insightsPermitableSites);
      setPermitablesiteInfoSites(siteInfoPermitableSites);
      setPermitableVrmCorrectionSites(vrmCorrectionPermitableSites);
      setPermitableForwardsSites(forwardsPermitableSites);
      setPermitableOccupancyProSites(occupancyProPermitableSites);
      setPermitableOccupancy24hSites(occupancy24hPermitableSites);
      setPermitableOccupancyTableSites(occupancyTablePermitableSites);
      setPermitableIqStatSites(iqStatsPermitableSites);
      setPermitableVrmValidatorSites(vrmValidatorPermitableSites);
      setPermitableGoNeutralSites(goNeutralPermitableSites);
      setPermitableVOISettingSites(voiSettingPermitableSites);
      setPermitableVOIPrivateSites(voiPrivatePermitableSites);
      setPermitablePDCalculatorSites(pDCalculatorPermitableSites);
      setPermitableVOIViewOnlySites(voiViewOnlyPermitableSites);
      setPermitableScheduledReportingSites(scheduledReportingPermitableSites);
      setPermitableVoiSMSNotifySites(voiSMSNotifyPermitableSites);
      setPermitableVehicleSearchSites(vehicleSearchPermitableSites);
      setPermitableVehicleSearchInsightSites(
        vehicleSearchInsightPermitableSites
      );
      setPermitableBasicOccupancySites(basicOccupancyPermitableSites);
      setPermitableMatchRateAlertSites(matchRateAlertPermitableSites);
      setExcludeVrmAccess(hasAccessToExcludeVrm);
      setPermitableExcludeVrmSites(excludeVrmPermitableSites);
      setDashboardAccess(hasAccessToDashboard);
      setPermitableDashboardSites(dashboardPermitableSites);
      setIqVisionAccess(hasAccessToIqVision);
      setPermitableIqVisionSites(iqVisionPermitableSites);


    };
    getAccess();
    // eslint-disable-next-line
  }, [
    userLoginType,
    userType,
    selectedSites,
    iqStatSites,
    dashboardSites,
    voiSettingSites,
    voiPrivateSites,
    pDCalculatorSites,
    vehicleSearchSites,
    formik.values.operator,
  ]);

  return (
    <Dialog
      open={addOpen}
      onClose={() => cancelAdd()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
    >
      <Form onSubmit={formik.handleSubmit}>
        <DialogTitle style={{ marginBottom: 0, paddingBottom: 0 }}>
          {`Add ${
            userLoginType === "Operator" || userLoginType === "Retailer"
              ? "User"
              : userType
          }`}
        </DialogTitle>
        <DialogContent>
          {step === 1 ? (
            <UserDetails
              formik={formik}
              userType={userType}
              userLoginType={userLoginType}
              operators={operators}
              retailers={retailers}
              setSelectedSites={setSelectedSites}
              rawSites={rawSites}
              imageChange={imageChange}
              selectedSites={selectedSites}
              setStep={setStep}
              cancel={cancelAdd}
              type="Add"
              setLogo={setLogo}
              logo={logo}
              url= {url}
              profile={profile}
            />
          ) : step === 2 ? (
            <Features
              formik={formik}
              userLoginType={userLoginType}
              userType={userType}
              setStep={setStep}
              hasInsightAccess={hasInsightAccess}
              hasSiteInfoAccess={hasSiteInfoAccess}
              hasOccupancyProAccess={haseOccupancyProAccess}
              hasOccupancy24hAccess={haseOccupancy24hAccess}
              hasOccupancyTableAccess={haseOccupancyTableAccess}
              hasVrmCorrectionAccess={hasVrmCorrectionAccess}
              hasForwardsAccess={hasForwardsAccess}
              hasIqStatAccess={hasIqStatAccess}
              hasGoNeutralAccess={hasGoNeutralAccess}
              hasVoiSettingAccess={hasVoiSettingAccess}
              hasVoiPrivateAccess={hasVoiPrivateAccess}
              hasPDCalculatorAccess={hasPDCalculatorAccess}
              hasVoiViewOnlyAccess={hasVoiViewOnlyAccess}
              hasVoiSMSNotifyAccess={hasVoiSMSNotifyAccess}
              hasVehicleSearchAccess={hasVehicleSearchAccess}
              hasVehicleSearchInsightAccess={hasVehicleSearchInsightAccess}
              hasVrmValidatorAccess={hasVrmValidatorAccess}
              hasScheduledReportingAccess={hasScheduledReportingAccess}
              hasBasicOccupancyAccess={hasBasicOccupancyAccess}
              hasMatchRateAlertAccess={hasMatchRateAlertAccess}
              permitableInsightSites={permitableInsightSites}
              permitableSiteInfoSites={permitableSiteInfoSites}
              permitableOccupancyProSites={permitableOccupancyProSites}
              permitableOccupancy24hSites={permitableOccupancy24hSites}
              permitableOccupancyTableSites={permitableOccupancyTableSites}
              permitableVrmCorrectionSites={permitableVrmCorrectionSites}
              permitableForwardsSites={permitableForwardsSites}
              permitableIqStatSites={permitableIqStatSites}
              permitableVrmValidatorSites={permitableVrmValidatorSites}
              permitableGoNeutralSites={permitableGoNeutralSites}
              permitableVoiSettingSites={permitableVoiSettingSites}
              permitableVoiPrivateSites={permitableVoiPrivateSites}
              permitablePDCalculatorSites={permitablePDCalculatorSites}
              permitableVoiViewOnlySites={permitableVoiViewOnlySites}
              permitableVoiSMSNotifySites={permitableVoiSMSNotifySites}
              permitableVehicleSearchSites={permitableVehicleSearchSites}
              permitableVehicleSearchInsightSites={
                permitableVehicleSearchInsightSites
              }
              permitableScheduledReportingSites={
                permitableScheduledReportingSites
              }
              permitableBasicOccupancySites={permitableBasicOccupancySites}
              permitableMatchRateAlertSites={permitableMatchRateAlertSites}
              setInsightSites={setInsightSites}
              setSiteInfoSites={setSiteInfoSites}
							siteInfoSites={siteInfoSites}
              setOccupancyProSites={setOccupancyProSites}
              occupancyProSites={occupancyProSites}
              setOccupancy24hSites={setOccupancy24hSites}
              occupancy24hSites={occupancy24hSites}
              setOccupancyTableSites={setOccupancyTableSites}
              occupancyTableSites={occupancyTableSites}
              setVrmCorrectionSites={setVrmCorrectionSites}
							vrmCorrectionSites={vrmCorrectionSites}
              setForwardsSites={setForwardsSites}
							forwardsSites={forwardsSites}
              insightSites={insightSites}
              setIqStatSites={setIqStatSites}
              iqStatSites={iqStatSites}
              vrmValidatorSites={vrmValidatorSites}
              setVrmValidatorSites={setVrmValidatorSites}
              goNeutralSites={goNeutralSites}
              setGoNeutralSites={setGoNeutralSites}
              voiSettingSites={voiSettingSites}
              setVOISettingSites={setVOISettingSites}
              voiPrivateSites={voiPrivateSites}
              setVOIPrivateSites={setVOIPrivateSites}
              pDCalculatorSites={pDCalculatorSites}
              setPDCalculatorSites={setPDCalculatorSites}
              voiViewOnlySites={voiViewOnlySites}
              setVOIViewOnlySites={setVOIViewOnlySites}
              voiSMSNotifySites={voiSMSNotifySites}
              setVOISMSNotifySites={setVOISMSNotifySites}
              scheduledReportingSites={scheduledReportingSites}
              setScheduledReportingSites={setScheduledReportingSites}
              vehicleSearchSites={vehicleSearchSites}
              setVehicleSearchSites={setVehicleSearchSites}
              vehicleSearchInsightSites={vehicleSearchInsightSites}
              setVehicleSearchInsightSites={setVehicleSearchInsightSites}
              basicOccupancySites={basicOccupancySites}
              setBasicOccupancySites={setBasicOccupancySites}
              matchRateAlertSites={matchRateAlertSites}
              setMatchRateAlertSites={setMatchRateAlertSites}
              cancel={cancelAdd}
              hasExcludeVrmAccess={hasExcludeVrmAccess}
              permitableExcludeVrmSites={permitableExcludeVrmSites}
              excludeVrmSites={excludeVrmSites}
              setExcludeVrmSites={setExcludeVrmSites}
              hasDashboardAccess={hasDashboardAccess}
              permitableDashboardSites={permitableDashboardSites}
              dashboardSites={dashboardSites}
              setDashboardSites={setDashboardSites}
              hasIqVisionAccess={hasIqVisionAccess}
              permitableIqVisionSites={permitableIqVisionSites}
              setIqVisionSites={setIqVisionSites}
              iqVisionSites={iqVisionSites}




            />
          ) : (
            ""
          )}
        </DialogContent>
      </Form>
    </Dialog>
  );
};
