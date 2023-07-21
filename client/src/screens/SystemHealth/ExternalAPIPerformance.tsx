import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from "react";
import { Divider } from "../../components/Divider";
import { DataTable } from "../../components";
import dayjs from "dayjs";

export const ExternalAPIPerformance: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mmcLoading, setMMCLoading] = useState(false);
  const [co2Loading, setCO2Loading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valuationHealth, setValuationHealth] = useState<any>({});
  const [mmcFailed, setMMCFailed] = useState<any>([]);
  const [co2Failed, setCO2Failed] = useState<any>([]);
  const today = dayjs().format('YYYY-MM-DD HH:00');

  const getFailedMMCData = async () => {
    setMMCLoading(true);
    try {
      const sessionMMCData = sessionStorage.getItem(`${today}-mmc-failed`);
      if(sessionMMCData){
        setMMCFailed(JSON.parse(sessionMMCData));
      }
      else {
        const { data: mmcData } = await axios.get(`/api/systemHealth/mmcFailedData`, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        sessionStorage.setItem(`${today}-mmc-failed`, JSON.stringify(mmcData.mmcFailed))
        setMMCFailed(mmcData.mmcFailed);
      }
    } catch (e) {
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setMMCLoading(false);
  };

  const getFailedCO2Data = async () => {
    setCO2Loading(true);
    try {
      const sessionCO2Data = sessionStorage.getItem(`${today}-co2-failed`);
      if(sessionCO2Data){
        setCO2Failed(JSON.parse(sessionCO2Data));
      }
      else {
        const { data: co2Data } = await axios.get(`/api/systemHealth/co2FailedData`, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        sessionStorage.setItem(`${today}-co2-failed`, JSON.stringify(co2Data.co2Failed))
        setCO2Failed(co2Data.co2Failed);
      }
    } catch (e) {
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setCO2Loading(false);
  };

  const getValuationData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/systemHealth/valuationData`, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      });
      setValuationHealth(data);
    } catch (e) {
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getFailedMMCData();
    getFailedCO2Data();
    getValuationData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <DataTable
        title="MMC API Failed VRM's"
        columns={["Site","VRM", "Date/Time", "Direction"]}
        data={mmcFailed}
        loading={mmcLoading}
        pagination={false}
      />
      <Divider />
      <DataTable
        title="CO2 API Failed VRM's"
        columns={["Site","VRM", "Date/Time", "Direction"]}
        data={co2Failed}
        loading={co2Loading}
        pagination={false}
      />
      <Divider />
      <DataTable
        title="Valuation Health Data"
        subTitle={`Total Valuated: ${
          valuationHealth && valuationHealth.valuationCount
            ? valuationHealth.valuationCount
            : 0
        }`}
        columns={
          valuationHealth && valuationHealth.valuationHealth
            ? Object.keys(valuationHealth.valuationHealth[0])
            : []
        }
        data={
          valuationHealth && valuationHealth.valuationHealth
            ? valuationHealth.valuationHealth
            : []
        }
        loading={loading}
        pagination={false}
      />
    </>
  );
};
