import { TextField } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { FC, useState } from "react"
import { isMobile } from "react-device-detect";
import { Button, Flex, MultiSelect } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { Formatter, colors } from "../../utils";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import { SiteContext } from "../../context/SitesContext";
import { UserContext } from "../../context/UserContext";
import { FormikValues, useFormik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CalcSchema } from "../../validationScheemas/P&DCalculatorSchema";
import moment from "moment";
import { YMD } from "../../constants";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";



const InputText = styled.input`
  display: flex;
  height: 44px;
  width: 100%;
  min-width: ${isMobile ? "260px" : "285px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "285px"};
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
  :disabled {
    cursor: not-allowed;
  }
`;
const Form = styled.form`
	width: 100%;
`;
const Error = styled.label`
	font-size: 12px;
	color: red;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
`;

const ErrorForSiteSelector = styled.label`
	font-size: 12px;
	color: red;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
  margin-left: 60px;
`;

export const Calc: FC = () => {
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const userLoginType = userData.userType;
  const localReportSites = localStorage.getItem("reports-sites");
  const localSelectedSites = (localReportSites && localReportSites.split(",")) || [];
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedSites, setSelectedSites] = useState<string[]>(localSelectedSites);
  const { sites } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  // const [opven, setOpen] = useState(false);
  const [vType, setVType] = useState(false);
  const [overnightCharges, setOvernightCharges] = useState(false);
  const [costForNormal, setCostForNormal] = useState('')
  const [costForEV, setCostForEV] = useState('')

  const [payWithReducing, setPayWithReducing] = useState(Array(4).fill({ from: '', to: '', chargeNormal: null, chargeEV: null }))
  const [costValuesEV, setCostValuesEV] = useState(Array(6).fill(''));
  const [payPerTime, setPayPerTime] = useState(Array(4).fill({ from: '', to: '', chargeNormal: null, chargeEV: null }))
  let [costValuesStay, setCostValuesStay] = useState(Array(1).fill({ from: '', to: '', chargeNormal: 0, chargeEV: 0 }));
  const [costValuesStayEmission, setCostValuesStayEmission] = useState(Array(10).fill({ from: '', to: '', charge: 0 }));
  // const [costValuesEVStay, setCostValuesEVStay] = useState(Array(6).fill(''));

  const [overnightStartTime, setOvernightStartTime] = useState<any>(null);
  const [overnightEndTime, setOvernightEndTime] = useState<any>(null);
  const [selectableSites, setSelectableSites] = useState<any>([]);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1); // Subtract 1 year
    minDate.setMonth(minDate.getMonth() - 6); // Subtract 6 months
    return minDate;
  };

  const getMinToDate = (date:any) => {
    const minDate = new Date(date);
    minDate.setDate(minDate.getDate() + 1); // add 1 day to start
    return minDate;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1); // Subtract 1 day
    return maxDate;
  };

  useEffect(() => {
    let accessSites = userData.userType === 'Admin' || userData.userType === "Customer" ? sites : userData.pDCalculatorAccess && userData.pDCalculatorAccessSites && userData.pDCalculatorAccessSites[0] ? userData.pDCalculatorAccessSites : [];
    if (userData.userType !== 'Admin') {
      for (const eachSite of sites) {
        const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
        if (foundSite[0] && foundSite[0].contractExpired) {
          accessSites = accessSites.filter((val: any) => val !== eachSite)
        }
      }
    }
    setSelectableSites(accessSites);
    // eslint-disable-next-line
  }, [sitesData])


  const handleSubmit = async (values: FormikValues) => {
    try {
      values.user = userData.email;
      values.userType = userData.userType;
      values.seasonPass = formik.values && formik.values.seasonPass && formik.values.seasonPass.length > 0 ? (formik.values.seasonPass).split(',') : []
      values.sites = selectedSites;
      values.selectedCase = selectedCase[0];
      values.vType = vType;
      values.overnightEntryTime = overnightStartTime;
      values.overnightExpiryTime = overnightEndTime;
      values.overnight = overnightCharges;
      values.overnightFreeMins = values.overnightFreeMins === "true" ? true : false 
      values.overnightChargesEV = Number(formik.values.overnightChargesEV) ? Number(formik.values.overnightChargesEV) : Number(formik.values.overnightChargesNormal);
      if(overnightCharges){
        if(!(overnightStartTime && overnightEndTime)) throw new EvalError("Please enter overnight start and end time")
      }
      if (dayjs(dayjs(selectedStartDate).format('YYYY-MM-DD')).isSame(dayjs(selectedEndDate).format("YYYY-MM-DD"))) throw new EvalError('Start date and end date cannot be the same');
      values.startDate = new Date(dayjs(selectedStartDate).format('YYYY-MM-DD'))
      values.endDate = new Date(dayjs(selectedEndDate).format('YYYY-MM-DD'))
      if (selectedCase == 'Case1') {
        if (Number(costForNormal) <= 0) throw new EvalError('Cost per hour cannot be 0 or less than 0 (Gasoline)');
        values.chargePerHourForNormal = Number(costForNormal);
        values.chargePerHourForEV = costForEV ? Number(costForEV) : Number(costForNormal);
      }
      // if (selectedCase == 'Case2') {
      //   values.payWithReducing = payWithReducing
      // }
      if (selectedCase == 'Case2') {
        values.chargePerEntryTime = payPerTime
      }
      if (selectedCase == 'Case3') {
        let finalCostValuesStay = []
        
        for (let eachData of costValuesStay){
          if ( (eachData.to).length == 0 ) throw new EvalError("Please enter to")
          if (!(eachData.chargeNormal) && ((eachData.chargeNormal).length == 0 )) throw new EvalError("Please enter cost for each selected duration")
          if (vType && !(eachData.chargeEV) && ((eachData.chargeEV).length == 0 )) throw new EvalError("Please enter Ev cost for each selected duration")
          
          finalCostValuesStay.push({
            from: Number(eachData.from),
            to: eachData && eachData.to && eachData.to.length > 2 ? 24 : Number(eachData.to),
            chargeNormal: Number(eachData.chargeNormal),
            chargeEV: (Number(eachData.chargeEV) == 0) ? Number(eachData.chargeNormal) : Number(eachData.chargeEV)
          })
        }

        for(let eachData of finalCostValuesStay){
          if(eachData.chargeNormal <= 0) throw new EvalError('Cost cannot be 0 or less than 0(Gasoline)');
          if(eachData.chargeEV <= 0) throw new EvalError('Cost cannot be 0 or less than 0(EV)');
        }
        values.chargePerStay = finalCostValuesStay
      }
      if (selectedCase == 'Case4') {
        let finalCostValuesStay = []

        for (let eachData of costValuesStayEmission){
          
          if (isNaN(eachData.charge)) throw new EvalError("Please enter cost in numeric")
          if (!(eachData.charge)) throw new EvalError("Please enter cost for each emission slot")
          finalCostValuesStay.push({
            from: Number(eachData.from),
            to: eachData && eachData.to && eachData.to.length > 2 ? 1000 : Number(eachData.to),
            charge: Number(eachData.charge),
          })
        }
        values.costValuesStayEmission = finalCostValuesStay
      }

      await axios.post("/api/insights", values, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") }
      });

      enqueueSnackbar("tariff created successfully.");
      formReset()
    } catch (e: any) {
      console.log("Error in form", e);
      enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong");
    }
  };
  const formReset = () => {
    formik.resetForm();
    setSelectedCase('');
    setSelectedSites([]);
  }



  const formik = useFormik({
    initialValues: {
      tariffName: "",
      sites: [] as any,
      selectedCase: "",
      freeMinutes: 0,
      noReturn: 0,
      vType: false,
      overnightEntryTime: "",
      overnightExpiryTime: "",
      overnightChargesNormal: 0,
      overnightChargesEV: 0,
      overnight: "",
      overnightFreeMins: "false",
      gracePeriod: 0,
      seasonPass: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: CalcSchema,
    onSubmit: handleSubmit
  });



  const handleOptionChange = (event: any) => {
    setOvernightCharges(false)
    setSelectedCase(event);
    setSelectedSites([])

  };


  const handleOvernightStartTime = (time: any) => {
    setOvernightStartTime(time);
  };
  const handleOvernightEndTime = (time: any) => {
    setOvernightEndTime(time);
  };


  const handleTimeChange = (value: any, index: any, key: any) => {

    let newTimeSlots = [...payPerTime];
    newTimeSlots[index] = {

      from: index > 0 ? newTimeSlots[index - 1].to : newTimeSlots[index].from,
      to: newTimeSlots[index].to ? newTimeSlots[index].to : null,
      chargeNormal: newTimeSlots[index].chargeNormal ? newTimeSlots[index].chargeNormal : null,
      chargeEV: newTimeSlots[index].chargeEV ? newTimeSlots[index].chargeEV : null,
    }



    newTimeSlots[index][key] = value;


    setPayPerTime(newTimeSlots);

  };

  const handleAddMorePayPerEntryTime = () => {
    let newArr = [...payPerTime]
    newArr.push({ from: null, to: null, chargeNormal: null, chargeEV: null })
    setPayPerTime(newArr)


  }

  const handleStayTimeChange = (value: any, index: any, key: any) => {
    let newTimeSlots = [...costValuesStay];
    
    newTimeSlots[index] = {
      from: index > 0 && newTimeSlots[index - 1].to ? newTimeSlots[index - 1].to : '',
      to: newTimeSlots[index].to ? newTimeSlots[index].to : '',
      chargeNormal: newTimeSlots[index].chargeNormal ? newTimeSlots[index].chargeNormal : '',
      chargeEV: newTimeSlots[index].chargeEV ? newTimeSlots[index].chargeEV : '',
    }
    newTimeSlots[index][key] = value

    if(index <  newTimeSlots.length - 1 && key=='to'){
      newTimeSlots.splice(index+1,newTimeSlots.length )     
    }
    setCostValuesStay(newTimeSlots)
  };
  const handleAddMoreStay = () => {
    if (costValuesStay[costValuesStay.length - 1].to < 24) {
      let newArr = [...costValuesStay]
      newArr.push({ from: '', to: '', chargeNormal: '', chargeEV: '' })
      setCostValuesStay(newArr)
    }
  }

  const handleEmissionTime = (value:any, index: any, key: any, key1: any, key2:any , from: any , to:any) => {    
    let newTimeSlots = [...costValuesStayEmission];
    newTimeSlots[index] = {
      from: newTimeSlots[index].from ? newTimeSlots[index].from : 0,
      to: newTimeSlots[index].to ? newTimeSlots[index].to : 0,
      charge: newTimeSlots[index].charge ? newTimeSlots[index].charge : 0,
    }
    newTimeSlots[index][key] = value
    newTimeSlots[index][key1] = from
    newTimeSlots[index][key2] = to
    setCostValuesStayEmission(newTimeSlots) 
  }

   useEffect(()=>{
    if(costValuesStay[costValuesStay.length - 1].to && costValuesStay[costValuesStay.length - 1].to < 24){
      handleAddMoreStay()
    } 
   },[costValuesStay])

  const handleReducingTimeChange = (value: any, index: any, key: any) => {
    let newTimeSlots = [...payWithReducing];

    newTimeSlots[index] = {
      from: index > 0 && newTimeSlots[index - 1].to ? newTimeSlots[index - 1].to : '0',
      to: newTimeSlots[index].to ? newTimeSlots[index].to : null,
      chargeNormal: newTimeSlots[index].chargeNormal ? newTimeSlots[index].chargeNormal : null,
      chargeEV: newTimeSlots[index].chargeEV ? newTimeSlots[index].chargeEV : null,
    }
    newTimeSlots[index][key] = value;
    setPayWithReducing(newTimeSlots);
  };

  const handleAddMoreReducing = () => {
    if (payWithReducing[payWithReducing.length - 1].to < 24) {
      let newArr = [...payWithReducing]
      newArr.push({ from: null, to: null, chargeNormal: null, chargeEV: null })
      setPayWithReducing(newArr)
    }
  }
  return (

    <React.Fragment>
      <Form onSubmit={formik.handleSubmit}>

        <Flex >
          <div >
            <LabelledComponent label="Enter name for your tariff" style={{ marginTop: "", marginRight: "35px" }}>

              <InputText
                id="tariffName"
                name="tariffName"
                type="text"
                autoComplete="nope"
                style={{}}
                onChange={formik.handleChange}
                value={formik.values.tariffName}
              />
            </LabelledComponent>
            {formik.touched.tariffName && formik.errors.tariffName && (
              <Error>{formik.touched.tariffName && formik.errors.tariffName}</Error>
            )}
          </div>
          <LabelledComponent label="Choose Your Tariff Type" >
            <MultiSelect
              fullWidth={isMobile}
              style={{ width: 280, height: 44 }}
              options={[
                { label: "Pay per hour", value: "Case1" },
                // { label: "Pay as per entry time", value: "Case2" },
                { label: "Flat payment as per duration of stay", value: "Case3" },
                // { label: "Pay as per emission", value: "Case4" }
              ]}
              multi={false}
              placeholder="Select Your Tariff Type"
              placement="bottomLeft"
              onChange={(e) => { handleOptionChange(e) }}
            />
          </LabelledComponent>
          <div>
            <LabelledComponent label="Car parks" style={{ marginLeft: "50px" }}>
              <MultiSelect
                multi={true}
                style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
                options={selectableSites.map((site: string) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
                values={selectedSites}
                onChange={async (values) => {
                  const normalizedSites = Formatter.normalizeSites(values);
                  await setSelectedSites(normalizedSites);
                  formik.setFieldValue("sites", normalizedSites)
                }}
              />
            </LabelledComponent>
            {formik.touched.sites && formik.errors.sites && (
              <ErrorForSiteSelector>{formik.touched.sites && formik.errors.sites}</ErrorForSiteSelector>
            )}
          </div>
        </Flex>
        {selectedCase.length > 0 ?
          <>
            <Flex>
              <div style={{marginTop:"30px"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select start date and time"
                  inputFormat="dd/MM/yyyy"
                  value={selectedStartDate}
                  onChange={(date: any) => setSelectedStartDate(date)}
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                  renderInput={(params: any) => (< TextField {...params} />)}
                />
              </LocalizationProvider>
              </div>
              <div style={{marginTop:"30px",marginLeft:"120px"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select expiry date and time"
                  inputFormat="dd/MM/yyyy"
                  value={selectedEndDate}
                  onChange={(date: any) => setSelectedEndDate(date)}
                  minDate={getMinToDate(selectedStartDate)}
                  maxDate={new Date(dayjs().subtract(1, "day").format("YYYY-MM-DD"))}
                  renderInput={(params: any) => (< TextField {...params} />)}
                />
              </LocalizationProvider>
              </div>
            </Flex>
            <Flex>
              <div>
                <LabelledComponent label="Grace period (in minutes)" style={{ marginTop: "30px", marginLeft: "" }}>

                  <InputText
                    id="gracePeriod"
                    name="gracePeriod"
                    type="number"
                    autoComplete="nope"
                    onChange={formik.handleChange}
                    min={0}
                    value={formik.values.gracePeriod}
                  />
                </LabelledComponent>
                {formik.touched.gracePeriod && formik.errors.gracePeriod && (
                  <Error>{formik.touched.gracePeriod && formik.errors.gracePeriod}</Error>
                )}
              </div>
              <LabelledComponent label="Free minutes for parking" style={{ marginTop: "30px", marginLeft: "40px" }}>
                <InputText
                  id="freeMinutes"
                  name="freeMinutes"
                  type="number"
                  autoComplete="nope"
                  min={0}
                  onChange={formik.handleChange}
                  value={formik.values.freeMinutes}
                />
              </LabelledComponent>
              <LabelledComponent label="No return(in minutes) " style={{ marginTop: "30px", marginLeft: "40px" }}>

                <InputText
                  id="noReturn"
                  name="noReturn"
                  type="number"
                  autoComplete="nope"
                  min={0}
                  onChange={formik.handleChange}
                  value={formik.values.noReturn}
                />
              </LabelledComponent>

            </Flex>
            <Flex>
            <LabelledComponent label="Vehicle VRMs (Season pass)" style={{ marginTop: "30px" }}>

                  <InputText
                    id="seasonPass"
                    name="seasonPass"
                    placeholder="Add VRMs"
                    type="text"
                    autoComplete="nope"
                    onChange={formik.handleChange}
                    value={formik.values.seasonPass}
                  />
                </LabelledComponent>
            {selectedCase != "Case4" ? 
              
                <LabelledComponent label="Are there special pricing for EV ?" style={{ marginTop: "30px", marginLeft: "47px" }}>
                  <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                    onChange={() => {
                      setVType(!vType)
                    }}
                  >
                    <label style={{ cursor: "pointer" }}>
                      <input type="radio" name="vType" defaultChecked={vType !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                      False
                    </label>
                    <label style={{ cursor: "pointer" }}>
                      <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="vType" value="true" id="true" />
                      True
                    </label>
                  </div>
                </LabelledComponent>
              : <></>}
              </Flex> 
          </> : <></>}


        {selectedCase == "Case1" ?
          <>
            <Flex>
              <LabelledComponent label="Are there overnight charges ?" style={{ marginTop: "30px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={() => {
                    setOvernightCharges(!overnightCharges)
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightCharges" defaultChecked={overnightCharges !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightCharges" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
              <LabelledComponent label="Are there free minutes for overnight ?" style={{ marginTop: "30px", marginLeft: "50px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={(e: any) => formik.handleChange(e)}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightFreeMins" value="false" defaultChecked={formik.values.overnightFreeMins !== "true"} id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightFreeMins" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
            </Flex>
            {overnightCharges == true ?
              <>
                <Flex>

                  <LabelledComponent label="Select Time duration for overnight charges" style={{ marginTop: "30px", marginLeft: "" }}>
                    <Flex>
                      <LabelledComponent label="from">
                        <select value={overnightStartTime} onChange={(e: any) => setOvernightStartTime(e.target.value)}>
                          <option value="">From</option>
                          {Array.from(Array(9).keys()).map((v: any, i: any) => <option key={i} value={(i + 16).toString().length == 1 ? `0${i + 16}:00` :`${i + 16}:00` == "24:00" ? "00:00" : `${i + 16}:00`}>{(i + 16).toString().length == 1 ? `0${i + 16}:00` : `${i + 16}:00` == "24:00" ? "00:00" : `${i + 16}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginLeft: "30px" }}>
                        <select value={overnightEndTime} onChange={(e: any) => setOvernightEndTime(e.target.value)}>
                          <option value="">To</option>
                          {Array.from(Array(10).keys()).map((v: any, i: any) => <option key={i} value={(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}>{(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Overnight charges for Gasoline" style={{ marginTop: "30px", marginLeft: "85px" }}>
                    <InputText
                      id="overnightChargesNormal"
                      name="overnightChargesNormal"
                      type="number"
                      autoComplete="nope"
                      min={0}
                      onChange={formik.handleChange}
                      value={formik.values.overnightChargesNormal}
                    />
                    
                  </LabelledComponent>
                  {vType == true ?
                    <>
                      <LabelledComponent label="Overnight charges for EV" style={{ marginTop: "30px", marginLeft: "40px" }}>
                        <InputText
                          id="overnightChargesEV"
                          name="overnightChargesEV"
                          type="number"
                          autoComplete="nope"
                          min={0}
                          onChange={formik.handleChange}
                          value={formik.values.overnightChargesEV}
                        />
                      </LabelledComponent></> : <></>}
                </Flex>
              </> : <></>}
            <Flex>
              <LabelledComponent label="Enter cost per hour (Gasoline)" style={{ marginTop: "30px" }}>
                 <TextField
                      label={`Cost`}
                      value={costForNormal}
                      onChange={(e: any) => setCostForNormal(e.target.value)} 
                      type="number"
                    />
              </LabelledComponent>
              {vType == true ?
                <>
                  <LabelledComponent label="Enter cost per hour for EV" style={{ marginTop: "30px", marginLeft: "30px" }}>
                  <TextField
                      label={`Cost`}
                      value={costForEV}
                      onChange={(e: any) => { setCostForEV(e.target.value) }} 
                      type="number"
                    />
                  </LabelledComponent></> : <></>}
            </Flex>

            <Button text="Submit" type="submit" loading={formik.isSubmitting} buttonStyle={{ marginTop: "57px", marginLeft: "" }} />

          </> : <></>}


        {/* {selectedCase == "Case2" ?
          <>
            <Flex>
              <LabelledComponent label="Are there overnight charges ?" style={{ marginTop: "30px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={() => {
                    setOvernightCharges(!overnightCharges)
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightCharges" defaultChecked={overnightCharges !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightCharges" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
              {overnightCharges == true ?
                <>
                  <LabelledComponent label="Select Time duration for overnight charges" style={{ marginTop: "30px", marginLeft: "40px" }}>
                    <Flex>
                      <LabelledComponent label="from">
                        <select style={{ width: "80px" }} value={overnightStartTime} onChange={(e: any) => setOvernightStartTime(e.target.value)}>
                          <option value="">From</option>
                          {Array.from(Array(6).keys()).map((v: any, i: any) => <option key={i} value={i + 19}>{i + 19}</option>)}
                        </select>
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginLeft: "30px" }}>
                        <select style={{ width: "80px" }} value={overnightEndTime} onChange={(e: any) => setOvernightEndTime(e.target.value)}>
                          <option value="">To</option>
                          {Array.from(Array(6).keys()).map((v: any, i: any) => <option key={i} value={i + 1}>{i + 1}</option>)}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Overnight charges" style={{ marginTop: "30px", marginLeft: "85px" }}>
                    <InputText
                      id="overnightCharges"
                      name="overnightCharges"
                      type="number"
                      autoComplete="nope"
                      onChange={formik.handleChange}
                      value={formik.values.overnightCharges}
                    />
                  </LabelledComponent></> : <></>}
            </Flex>

            {payWithReducing.map((val, index) => (
              <>
                <Flex>
                  <LabelledComponent label="select duration" style={{ width: "", marginTop: "20px" }}>
                    <Flex>
                      <LabelledComponent label="from" style={{ marginTop: "5px", width: "", marginLeft: "" }}>
                        <input readOnly style={{ width: "125px" }} value={index > 0 && payWithReducing[index - 1].to ? payWithReducing[index - 1].to : 0} onChange={(e) => handleReducingTimeChange(e.target.value, index, "from")} />
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginTop: "5px", width: "", marginLeft: "30px" }}>
                        <select style={{ width: "125px" }} value={val.to} onChange={(e) => { handleReducingTimeChange(e.target.value, index, "to") }}>
                          <option value=''>Select Duration</option>
                          {Array.from(Array(24).keys()).map((v: any, i: any) => {
                            if (index > 0 && payWithReducing[index - 1].to >= i + 1) {
                              return false;
                            }
                            // else if (index == 0 && overnightCharges && overnightEndTime >= i+1 ){
                            //   return false;
                            // }
                            else {

                              return <option key={i} value={i + 1}>{i + 1}</option>
                            }
                          })}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Enter cost per hour for Gasoline" style={{ marginTop: "20px", width: "", marginLeft: "45px" }}>

                    <TextField
                      key={index}
                      label={`Cost`}
                      // value={val.value}
                      style={{ marginLeft: "10px" }}
                      onChange={(e) => {
                        handleReducingTimeChange(e.target.value, index, "chargeNormal")

                      }}
                    />
                  </LabelledComponent>
                  {vType == true ?
                    <>
                      <LabelledComponent label="Enter cost per hour for EV" style={{ marginTop: "20px", width: "", marginLeft: "125px" }}>
                        <TextField
                          label={"Cost"}
                          // value={}
                          style={{ marginLeft: "10px" }}
                          onChange={(e) => {
                            handleReducingTimeChange(e.target.value, index, "chargeEV")

                          }}
                        />
                      </LabelledComponent>
                    </> : <></>}

                </Flex>
                {payWithReducing[payWithReducing.length - 1].to && payWithReducing[payWithReducing.length - 1].to < 24 ? handleAddMoreReducing() : ''}
              </>

            ))}

            {/* {costValuesStay[costValuesStay.length - 1].to < 24 && <button style={{ marginLeft: "10px", marginTop: "10px" }} onClick={() => { handleAddMoreStay() }}>Add More</button>} */}
        {/* {addMoreStay && vType == true && <button style={{ marginLeft: "253px", marginTop: "10px" }} onClick={() => { handleAddMoreEVStay() }}>Add More</button>} */}
        {/* <Button text="Submit" type="submit" buttonStyle={{ marginTop: "10px", marginLeft: "5px" }} /> */}
        {/* </> : <></>} */}
        {/* {selectedCase == "Case2" ? */}
          {/* <> */}

            {/* <Flex>
            <LabelledComponent label="Are there overnight charges ?" style={{ marginTop: "30px" }}>
              <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                onChange={() => {
                  setOvernightCharges(!overnightCharges)
                }}
              >
                <label style={{ cursor: "pointer" }}>
                  <input type="radio" name="overnightCharges" defaultChecked={overnightCharges !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                  False
                </label>
                <label style={{ cursor: "pointer" }}>
                  <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightCharges" value="true" id="true" />
                  True
                </label>
              </div>
            </LabelledComponent>
            {overnightCharges == true ?
              <>
                <LabelledComponent label="Select Time duration for overnight charges" style={{ marginTop: "30px", marginLeft: "40px" }}>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                      <TimePicker
                        label="From"
                        minutesStep={60}
                        value={overnightStartTime}
                        onChange={handleOvernightStartTime}
                        openTo="hours"
                        ampm={false}
                        minTime={new Date(0, 0, 0, 19, 0, 0)}
                        maxTime={new Date(0, 0, 0, 23, 59, 0)}
                        renderInput={(props: any) => <TextField {...props} />}

                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                      <TimePicker
                        label="To"
                        minutesStep={60}
                        minTime={new Date(0, 0, 0, 0, 0, 0)}
                        maxTime={new Date(0, 0, 0, 6, 0, 0)}
                        value={overnightEndTime}
                        onChange={handleOvernightEndTime}
                        openTo="hours"
                        ampm={false}
                        renderInput={(props: any) => <TextField {...props} />}

                      />
                    </LocalizationProvider>
                  </div>

                </LabelledComponent>
                <LabelledComponent label="Overnight charges" style={{ marginTop: "30px", marginLeft: "45px" }}>
                  <InputText
                    id="costPerHour"
                    name="costPerHour"
                    type="number"
                    autoComplete="nope"
                    onChange={() => { }}
                  // value={0}
                  />
                </LabelledComponent></> : <></>}
          </Flex>
          {payPerTime.map((val, index) => (
            <div key={index}>
              <Flex>
                <LabelledComponent label="Select Entry And Exit Time" style={{ marginTop: "30px" }}>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                      <TimePicker
                        label="From"
                        minutesStep={60}
                        value={index == 0 && overnightEndTime ? overnightEndTime : index > 0 && payPerTime[index - 1].exitTime ? payPerTime[index - 1].exitTime : val.entryTime}
                        onChange={(value) => handleTimeChange(value, index, "entryTime")}
                        // minTime={}
                        openTo="hours" // display only hour selection view
                        ampm={false}
                        renderInput={(props: any) => <TextField {...props} />}

                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                      <TimePicker
                        label="To"
                        minutesStep={60}
                        value={val.exitTime}
                        onChange={(value) => handleTimeChange(value, index, "exitTime")}
                        openTo="hours" // display only hour selection view
                        ampm={false}
                        minTime={index > 0 && payPerTime[index - 1].exitTime ? payPerTime[index - 1].exitTime : null}
                        renderInput={(props: any) => <TextField {...props} />}

                      />
                    </LocalizationProvider>
                  </div>
                </LabelledComponent>
                <LabelledComponent label="Enter cost per hour for Gasoline" style={{ marginTop: "30px", marginLeft: "45px" }}>

                  <InputText
                    id="costPerHour"
                    name="costPerHour"
                    type="number"
                    autoComplete="nope"
                    onChange={() => { }}
                  // value={}
                  />
                </LabelledComponent>
                {vType == true ?
                  <>
                    <LabelledComponent label="Enter cost per hour for EV" style={{ marginTop: "30px", marginLeft: "40px" }}>

                      <InputText
                        id="costPerHourForEv"
                        name="costPerHourForEv"
                        type="number"
                        autoComplete="nope"
                        onChange={() => { }}
                      // value={}
                      />
                    </LabelledComponent></> : <></>}
              </Flex>
            </div>
          ))}
          {addMorePayPerTime && <button style={{ marginLeft: "10px", marginTop: "10px" }} onClick={() => { handleAddMorePayPerEntryTime() }}>Add More</button>}
          <Button text="Submit" type="submit" buttonStyle={{ marginTop: "", marginLeft: "" }} />*/}
            {/* <Flex>
              <LabelledComponent label="Are there overnight charges ?" style={{ marginTop: "30px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={() => {
                    setOvernightCharges(!overnightCharges)
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightCharges" defaultChecked={overnightCharges !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightCharges" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
              {overnightCharges == true ?
                <>
                  <LabelledComponent label="Select Time duration for overnight charges" style={{ marginTop: "30px", marginLeft: "40px" }}>
                    <Flex>
                      <LabelledComponent label="from">
                        <select value={overnightStartTime} onChange={(e: any) => setOvernightStartTime(e.target.value)}>
                          <option value="">From</option>
                          {Array.from(Array(5).keys()).map((v: any, i: any) => <option key={i} value={(i + 19).toString().length == 1 ? `0${i + 19}:00` : i + 1 == 24 ? `00:00` : `${i + 19}:00`}>{(i + 19).toString().length == 1 ? `0${i + 19}:00` : i + 1 == 24 ? `00:00` : `${i + 19}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginLeft: "30px" }}>
                        <select value={overnightEndTime} onChange={(e: any) => setOvernightEndTime(e.target.value)}>
                          <option value="">To</option>
                          {Array.from(Array(10).keys()).map((v: any, i: any) => <option key={i} value={(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}>{(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Overnight charges" style={{ marginTop: "30px", marginLeft: "85px" }}>
                    <InputText
                      id="overnightChargesNormal"
                      name="overnightChargesNormal"
                      type="number"
                      autoComplete="nope"
                      onChange={formik.handleChange}
                      value={formik.values.overnightChargesNormal}
                    />
                  </LabelledComponent>
                  <LabelledComponent label="Overnight charges for EV" style={{ marginTop: "30px", marginLeft: "85px" }}>
                    <InputText
                      id="overnightChargesEV"
                      name="overnightChargesEV"
                      type="number"
                      autoComplete="nope"
                      onChange={formik.handleChange}
                      value={formik.values.overnightChargesEV}
                    />
                  </LabelledComponent></> : <></>}
            </Flex>

            {payPerTime.map((val, index) => (
              <>
                <Flex>
                  <LabelledComponent label="select duration" style={{ width: "", marginTop: "20px" }}>
                    <Flex>
                      <LabelledComponent label="from" style={{ marginTop: "5px", width: "", marginLeft: "" }}>
                        {index == 0 ?
                          <select style={{ width: "120px" }} value={val.from} onChange={(e) => { handleTimeChange(e.target.value, index, "from") }}>
                            <option value=''>Select Duration</option>
                            {Array.from(Array(24).keys()).map((v: any, i: any) => {

                              return <option key={i} value={i + 1}>{(i + 1)}</option>
                            })}
                          </select>
                          :
                          <input readOnly style={{ width: "120px" }} value={index > 0 && payPerTime && payPerTime[index - 1] && payPerTime[index - 1].to ? payPerTime[index - 1].to : '0'} onChange={(e) => handleTimeChange(e.target.value, index, "from")} />
                        }
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginTop: "5px", width: "", marginLeft: "30px" }}>
                        <select style={{ width: "120px" }} value={val.to} onChange={(e) => { handleTimeChange(e.target.value, index, "to") }}>
                          <option value=''>Select Duration</option>
                          {Array.from(Array(24).keys()).map((v: any, i: any) => {
                            if (index > 0 && ((payPerTime[index - 1].to < Number(payPerTime[0].from) && Number(payPerTime[0].from) > i + 1) || (payPerTime[index - 1].to > Number(payPerTime[0].from) && payPerTime[index - 1].to >= (i + 1 + Number(payPerTime[0].from))))) {
                              return false;
                            }

                            else {

                              return <option value={(i + 1 + Number(payPerTime[0].from)) > 24 ? (i + 1 + Number(payPerTime[0].from)) - 24 : (i + 1 + Number(payPerTime[0].from))}>{((i + 1 + Number(payPerTime[0].from)) > 24 ? (i + 1 + Number(payPerTime[0].from)) - 24 : (i + 1 + Number(payPerTime[0].from)))}</option>
                            }
                          })}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Enter cost per hour for Gasoline" style={{ marginTop: "20px", width: "", marginLeft: "50px" }}>

                    <TextField
                      key={index}
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "10px" }}
                      onChange={(e: any) => {
                        handleTimeChange(e.target.value, index, "chargeNormal")

                      }}
                    />
                  </LabelledComponent>
                  {vType == true ?
                    <>
                      <LabelledComponent label="Enter cost per hour for EV" style={{ marginTop: "20px", width: "", marginLeft: "50px" }}>
                        <TextField
                          label={"Cost"}
                          type="number"

                          // value={}
                          style={{ marginLeft: "10px" }}
                          onChange={(e) => {
                            handleTimeChange(e.target.value, index, "chargeEV")

                          }}
                        />
                      </LabelledComponent>
                    </> : <></>}

                </Flex>
                {payPerTime[payPerTime.length - 1].to && payPerTime[payPerTime.length - 1].to != payPerTime[0].from ? handleAddMorePayPerEntryTime() : ''}
              </>
            ))}
            <Button text="Submit" type="submit" buttonStyle={{ marginTop: "10px", marginLeft: "5px" }} />
          </>
          : <></>} */}
        {selectedCase == "Case3" ?
          <>
            <Flex>
              <LabelledComponent label="Are there overnight charges ?" style={{ marginTop: "30px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={() => {
                    setOvernightCharges(!overnightCharges)
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightCharges" defaultChecked={overnightCharges !== true} value="false" id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightCharges" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
              <LabelledComponent label="Are there free minutes for overnight ?" style={{ marginTop: "30px", marginLeft: "48px" }}>
                <div style={{ marginLeft: "0", minWidth: isMobile ? "260px" : "285px", marginTop: "10px", fontWeight: 600 }} role="group"
                  onChange={(e: any) => formik.handleChange(e)}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="radio" name="overnightFreeMins" value="false" defaultChecked={formik.values.overnightFreeMins !== "true"} id="false" style={{ marginRight: "5px" }} />
                    False
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" name="overnightFreeMins" value="true" id="true" />
                    True
                  </label>
                </div>
              </LabelledComponent>
            </Flex>
            {overnightCharges == true ?
              <>
                <Flex>
                <LabelledComponent label="Select Time duration for overnight charges" style={{ marginTop: "30px", marginLeft: "" }}>
                    <Flex>
                      <LabelledComponent label="from">
                        <select value={overnightStartTime} onChange={(e: any) => setOvernightStartTime(e.target.value)}>
                          <option value="">From</option>
                          {Array.from(Array(9).keys()).map((v: any, i: any) => <option key={i} value={(i + 16).toString().length == 1 ? `0${i + 16}:00` :`${i + 16}:00` == "24:00" ? "00:00" : `${i + 16}:00`}>{(i + 16).toString().length == 1 ? `0${i + 16}:00` : `${i + 16}:00` == "24:00" ? "00:00" : `${i + 16}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginLeft: "30px" }}>
                        <select value={overnightEndTime} onChange={(e: any) => setOvernightEndTime(e.target.value)}>
                          <option value="">To</option>
                          {Array.from(Array(10).keys()).map((v: any, i: any) => <option key={i} value={(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}>{(i + 1).toString().length == 1 ? `0${i + 1}:00` : `${i + 1}:00`}</option>)}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Overnight charges (Gasoline)" style={{ marginTop: "30px", marginLeft: "95px" }}>
                    <InputText
                      id="overnightChargesNormal"
                      name="overnightChargesNormal"
                      type="number"
                      autoComplete="nope"
                      min={0}
                      onChange={formik.handleChange}
                      value={formik.values.overnightChargesNormal}
                    />
                  </LabelledComponent>
                  {vType == true ?
                    <>
                      <LabelledComponent label="Overnight charges (EV)" style={{ marginTop: "30px", marginLeft: "40px" }}>
                        <InputText
                          id="overnightChargesEV"
                          name="overnightChargesEV"
                          type="number"
                          autoComplete="nope"
                          min={0}
                          onChange={formik.handleChange}
                          value={formik.values.overnightChargesEV}
                        />
                      </LabelledComponent></> : <></>}
                </Flex>
              </> : <></>}


            {costValuesStay.map((val, index) => (
              <>
                <Flex>
                  <LabelledComponent label="Select Duration" style={{ width: "", marginTop: "30px" }}>
                    <Flex>
                      <LabelledComponent label="from" style={{ marginTop: "5px", width: "", marginLeft: "" }}>
                        <input readOnly style={{ width: "125px" }} value={index > 0 && costValuesStay[index - 1].to  ? costValuesStay[index - 1].to : index > 0 && (costValuesStay[index - 1].to).length <= 2 ? costValuesStay[index - 1].to : 0} onChange={(e) => handleStayTimeChange(e.target.value, index, "from")} />
                      </LabelledComponent>
                      <LabelledComponent label="to" style={{ marginTop: "5px", width: "", marginLeft: "30px" }}>
                        <select style={{ width: "125px" }} value={val.to} onChange={(e) => { handleStayTimeChange(e.target.value, index, "to") }}>
                          <option value=''>Select Duration</option>
                          <option>{index > 0 && costValuesStay[index - 1].to != null ? `${costValuesStay[index - 1].to} +` : ''}</option>
                          {Array.from(Array(24).keys()).map((v: any, i: any) => {
                            if (index > 0 && costValuesStay[index - 1].to >= i + 1) {
                              return false;
                            }
                            // else if (index == 0 && overnightCharges && overnightEndTime >= i+1 ){
                            //   return false;
                            // }
                            else {

                              return <option key={i} value={i + 1}>{i + 1}</option>
                            }
                          })}
                        </select>
                      </LabelledComponent>
                    </Flex>
                  </LabelledComponent>
                  <LabelledComponent label="Enter cost per duration (Gasoline)" style={{ marginTop: "30px", width: "", marginLeft: "50px" }}>
                 
                    <TextField
                      label={`Cost`}
                      // value={val.value}
                      style={{ marginLeft: "10px" }}
                      onChange={(e) => {
                        handleStayTimeChange(e.target.value, index, "chargeNormal")
                      }}
                      type="text"
                      inputMode="numeric"

                    />
                  </LabelledComponent>
                  {vType == true ?
                    <>
                      <LabelledComponent label="Enter cost per duration (EV)" style={{ marginTop: "20px", width: "", marginLeft: "125px" }}>
                        <TextField
                          label={"Cost"}
                          // value={}
                          style={{ marginLeft: "10px" }}
                          onChange={(e) => {
                            handleStayTimeChange(e.target.value, index, "chargeEV")
                          }}
                          type="text"
                          inputMode="numeric"
                        />
                      </LabelledComponent>
                    </> : <></>}

                </Flex>
              </>

            ))}

            {/* {costValuesStay[costValuesStay.length - 1].to < 24 && <button style={{ marginLeft: "10px", marginTop: "10px" }} onClick={() => { handleAddMoreStay() }}>Add More</button>} */}
            {/* {addMoreStay && vType == true && <button style={{ marginLeft: "253px", marginTop: "10px" }} onClick={() => { handleAddMoreEVStay() }}>Add More</button>} */}
            <Button text="Submit" type="submit" buttonStyle={{ marginTop: "10px", marginLeft: "5px" }} />
          </> : <></>}


          {selectedCase == "Case4" ? 
          <>
            <Flex>
              <LabelledComponent label="Select Duration" style={{ width: "", marginTop: "20px" }}>
              <Flex>
                <LabelledComponent label="From">
                  <p>0</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>1</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {handleEmissionTime(e.target.value,0,"charge","from","to",0,1)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>1</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>50</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {handleEmissionTime(e.target.value,1,"charge","from","to",1,50)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>51</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>100</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => { handleEmissionTime(e.target.value,2,"charge","from","to",51,100)  
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>101</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>150</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,3,"charge","from","to",101,150)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>151</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>200</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,4,"charge","from","to",151,200)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>201</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>250</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {  handleEmissionTime(e.target.value,5,"charge","from","to",201,250) 
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>251</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>300</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,6,"charge","from","to",251,300)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>301</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>350</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,7,"charge","from","to",301,350)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>351</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>400</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,8,"charge","from","to",351,400)
                      }}
                    />
                </Flex>  
                <Flex>
                <LabelledComponent label="From">
                  <p>401</p>
                </LabelledComponent>
                <LabelledComponent label ="To" style={{marginLeft:"35px",width:"30px"}}>
                  <p>401+</p>
                </LabelledComponent>
                <TextField
                      label={`Cost`}
                      type="number"
                      // value={val.value}
                      style={{ marginLeft: "35px" }}
                      onChange={(e) => {   handleEmissionTime(e.target.value,9,"charge","from","to",401,"401+")
                      }}
                    />
                </Flex>  
              </LabelledComponent>
            </Flex>
            <Button text="Submit" type="submit" buttonStyle={{ marginTop: "10px", marginLeft: "5px" }} />
          </>
          : <></>}
      </Form>
    </React.Fragment>


  )
}


