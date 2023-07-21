import LineChartIcon from "@material-ui/icons/Timeline";
import BarChartIcon from "@material-ui/icons/Equalizer";
import CSVIcon from "@material-ui/icons/Assessment";
import PDFIcon from "@material-ui/icons/PictureAsPdf";
import { Switch } from "antd";
import axios from "axios";
import moment from "moment";
import React, { FC, useContext, useEffect, useState } from "react";
import { Button, CardWithTabs, DatePicker, Divider, Flex, MultiSelect } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { PATHS, YMD } from "../../constants";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { ReportGraph } from "../../graphs";
import { ReportData } from "../../types";
import { formatSite, Formatter } from "../../utils";
import { useHistory } from "react-router-dom";
import { PdfTemplate } from "../PdfTemplate";
import { isMobile } from "react-device-detect";
import dayjs from "dayjs";
import ProgressBar from "./ProgressBar";

type TabType = "bar" | "line";

interface ActiveLabel {
	[site: string]: TabType | string;
}

export const Reports: FC = () => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const userLoginType = userData.userType;
	const localReportSites = localStorage.getItem("reports-sites");
	const localSelectedSites = (localReportSites && localReportSites.split(",")) || [];
	const localFromDate = localStorage.getItem("reports-from-date") || "";
	const localToDate = localStorage.getItem("reports-to-date") || "";

	const sessionChartView = sessionStorage.getItem("reports-chart-view") || "daily";
	const sessionChartType = (sessionStorage.getItem("reports-chart-type") || "bar") as TabType;

	const sessionReports = JSON.parse(
		sessionStorage.getItem(`reports-${localSelectedSites}-${localFromDate}-${localToDate}-${sessionChartView}`) || "{}"
	);
	const sessionRepeatTime = JSON.parse(
		sessionStorage.getItem(`reports-repeat-time-${localSelectedSites}-${localFromDate}-${localToDate}-${sessionChartView}`) || "{}"
	);
	const sessionRepeatFrequency = JSON.parse(
		sessionStorage.getItem(`reports-repeat-frequency-${localSelectedSites}-${localFromDate}-${localToDate}-${sessionChartView}`) || "{}"
	);
	const sessionDwellByHour = JSON.parse(
		sessionStorage.getItem(`reports-dwell-by-hour-${localSelectedSites}-${localFromDate}-${localToDate}-${sessionChartView}`) || "{}"
	);

	const [fromDate, setFromDate] = useState<string | undefined>(localFromDate);
	const [toDate, setToDate] = useState<string | undefined>(localToDate);
	const [loading, setLoading] = useState(false);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
	const [downloadingPDF, setDownloadingPDF] = useState(false);
	const [downloadPdf,setDownloadPdf] = useState(false)
	const { sites, email } = useContext(UserContext);
	const [selectedMonth, setSelectedMonth] = useState("");
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	let date = new Date();
	let currentMonth = date.getMonth();
	let currentYear = date.getFullYear();

	const history = useHistory();

	const [reports, setReports] = useState<ReportData | undefined>(sessionReports);
	const [selectedSites, setSelectedSites] = useState<string[]>(localSelectedSites);
	const [activeLabel, setActiveLabel] = useState<ActiveLabel>();
	const [chartType, setChartType] = useState(sessionChartType);
	const [chartView, setChartView] = useState<any>(sessionChartView);
	const [repeatTime, setRepeatTime] = useState<any>(sessionRepeatTime);
	const [repeatFrequency, setRepeatFrequency] = useState<any>(sessionRepeatFrequency);
	const [dwellByHour, setDwellByHour] = useState<any>(sessionDwellByHour);
	const [selectableSites, setSelectableSites] = useState<any>([]);

	useEffect(() => {
		let accessSites = userData.userType === 'Admin' || userData.userType === "Customer" ? sites : userData.dashboardAccess && userData.dashboardAccessSites && userData.dashboardAccessSites[0] ? userData.dashboardAccessSites : [];
		if(userData.userType !== 'Admin'){
			for(const eachSite of sites){
				const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
				if(foundSite[0] && foundSite[0].contractExpired){
					accessSites = accessSites.filter((val: any) => val !== eachSite)
				}
			}
		}
		setSelectableSites(accessSites);
		// eslint-disable-next-line
	}, [sitesData])

		const getReports = async () => {
			const sites = selectedSites?.join();
			const sessionData = sessionStorage.getItem(`reports-${sites}-${fromDate}-${toDate}-${chartView}`);
			if (sessionData) {
				setReports(JSON.parse(sessionData));
			} else {
				setLoading(true);
				try {
					const { data } = await axios.get(
						`/api/reports?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${chartView}&userType=${userLoginType}&email=${email}`,
						{
							headers: { authorization: "Bearer " + localStorage.getItem("token") }
						}
					);
					sessionStorage.setItem(`reports-${sites}-${fromDate}-${toDate}-${chartView}`, JSON.stringify(data.data));
					setReports(data.data);
				} catch (e:any) {
					if (e.response && e.response.status === 401) {
						history.replace(PATHS.LOGIN);
					}
				}
				setLoading(false);
			}
		};
	
		const getRepeatTime = async () => {
			const sites = selectedSites?.join();
			const sessionRepeatTimeData = sessionStorage.getItem(`reports-repeat-time-${sites}-${fromDate}-${toDate}-${chartView}`);

			if (sessionRepeatTimeData) {
				setRepeatTime(JSON.parse(sessionRepeatTimeData));
			} else {
				setLoading(true);
				try {
					const { data } = await axios.get(
						`/api/reports/repeatTime?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${chartView}&userType=${userLoginType}&email=${email}`,
						{
							headers: { authorization: "Bearer " + localStorage.getItem("token") }
						}
					);
					sessionStorage.setItem(`reports-repeat-time-${sites}-${fromDate}-${toDate}-${chartView}`, JSON.stringify(data.repeatTime));
					setRepeatTime(data.repeatTime);
				} catch (e:any) {
					if (e.response && e.response.status === 401) {
						history.replace(PATHS.LOGIN);
					}
				}
				setLoading(false);
			}
		};

		const getRepeatFrequency = async () => {
			const sites = selectedSites?.join();
			const sessionRepeatFrequencyData = sessionStorage.getItem(`reports-repeat-frequency-${sites}-${fromDate}-${toDate}-${chartView}`);

			if ( sessionRepeatFrequencyData ) {
				setRepeatFrequency(JSON.parse(sessionRepeatFrequencyData));
			} else {
				setLoading(true);
				try {
					const { data } = await axios.get(
						`/api/reports/repeatFrequency?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${chartView}&userType=${userLoginType}&email=${email}`,
						{
							headers: { authorization: "Bearer " + localStorage.getItem("token") }
						}
					);
					sessionStorage.setItem(`reports-repeat-frequency-${sites}-${fromDate}-${toDate}-${chartView}`, JSON.stringify(data.repeatFrequency));
					setRepeatFrequency(data.repeatFrequency);
				} catch (e:any) {
					if (e.response && e.response.status === 401) {
						history.replace(PATHS.LOGIN);
					}
				}
				setLoading(false);
			}
		};
	
		const getDwellByHour = async () => {
			const sites = selectedSites?.join();
			const sessionDwellByHour = sessionStorage.getItem(`reports-dwell-by-hour-${sites}-${fromDate}-${toDate}-${chartView}`);

			if (sessionDwellByHour) {
				setDwellByHour(JSON.parse(sessionDwellByHour));
			} else {
				setLoading(true);
				try {
					const { data } = await axios.get(
						`/api/reports/dwellByHour?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${chartView}&userType=${userLoginType}&email=${email}`,
						{
							headers: { authorization: "Bearer " + localStorage.getItem("token") }
						}
					);
					sessionStorage.setItem(`reports-dwell-by-hour-${sites}-${fromDate}-${toDate}-${chartView}`, JSON.stringify(data.dwellByHour));
					setDwellByHour(data.dwellByHour);
				} catch (e:any) {
					if (e.response && e.response.status === 401) {
						history.replace(PATHS.LOGIN);
					}
				}
				setLoading(false);
			}
		};

		const setDateRange = (month: any, currMonth: any) => {
			setSelectedMonth(month)
			if (month === "2 Months") {
				let fromDate = dayjs().subtract(2, 'month').startOf("month").format("YYYY-MM-DD");
				let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
				setFromDate(fromDate)
				setToDate(toDate)
			} else if (month === "3 Months") {
				let fromDate = dayjs().subtract(3, 'month').startOf("month").format("YYYY-MM-DD");
				let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
				setFromDate(fromDate)
				setToDate(toDate)
			} else if (month === "6 Months") {
				let fromDate = dayjs().subtract(6, 'month').startOf("month").format("YYYY-MM-DD");
				let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
				setFromDate(fromDate)
				setToDate(toDate)
			}else if (month === "12 Months") {
				let fromDate = dayjs().subtract(12, 'month').startOf("month").format("YYYY-MM-DD");
				let toDate = dayjs().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
				setFromDate(fromDate)
				setToDate(toDate)
			} else if (month === "January") {
				setFromDate(`${currentYear}-01-01`)
				setToDate(`${currentYear}-01-31`)
			}
			else if (month === "February") {
				setFromDate(`${currentYear}-02-01`)
				setToDate(currentYear % 4 === 0 ? `${currentYear}-02-29` : `${currentYear}-02-28`)
			}
			else if (month === "March") {
				setFromDate(`${currentYear}-03-01`)
				setToDate(`${currentYear}-03-31`)
			}
			else if (month === "April") {
				setFromDate(`${currentYear}-04-01`)
				setToDate(`${currentYear}-04-30`)
			}
			else if (month === "May") {
				setFromDate(`${currentYear}-05-01`)
				setToDate(`${currentYear}-05-31`)
			}
			else if (month === "June") {
				setFromDate(`${currentYear}-06-01`)
				setToDate(`${currentYear}-06-30`)
			}
			else if (month === "July") {
				if (currMonth === 0) {
					setFromDate(`${currentYear - 1}-07-01`)
					setToDate(`${currentYear - 1}-07-31`)
				} else {
					setFromDate(`${currentYear}-07-01`)
					setToDate(`${currentYear}-07-31`)
				}
			}
			else if (month === "August") {
				if (currMonth === 0 || currMonth === 1) {
					setFromDate(`${currentYear - 1}-08-01`)
					setToDate(`${currentYear - 1}-08-31`)
				} else {
					setFromDate(`${currentYear}-08-01`)
					setToDate(`${currentYear}-08-31`)
				}
	
			}
			else if (month === "September") {
				if (currMonth >= 0 && currMonth <= 2) {
					setFromDate(`${currentYear - 1}-09-01`)
					setToDate(`${currentYear - 1}-09-30`)
				} else {
					setFromDate(`${currentYear}-09-01`)
					setToDate(`${currentYear}-09-30`)
				}
	
			}
			else if (month === "October") {
				if (currMonth >= 0 && currMonth <= 3) {
					setFromDate(`${currentYear - 1}-10-01`)
					setToDate(`${currentYear - 1}-10-31`)
				} else {
					setFromDate(`${currentYear}-10-01`)
					setToDate(`${currentYear}-10-31`)
				}
	
			} else if (month === "November") {
				if (currMonth >= 0 && currMonth <= 4) {
					setFromDate(`${currentYear - 1}-11-01`)
					setToDate(`${currentYear - 1}-11-30`)
				} else {
					setFromDate(`${currentYear}-11-01`)
					setToDate(`${currentYear}-11-30`)
				}
	
			} else if (month === "December") {
				if (currMonth >= 0 && currMonth <= 5) {
					setFromDate(`${currentYear - 1}-12-01`)
					setToDate(`${currentYear - 1}-12-31`)
				} else {
					setFromDate(`${currentYear}-12-01`)
					setToDate(`${currentYear}-12-31`)
				}
			}
		}

	useEffect(() => {

		if (fromDate && toDate && selectedSites.length > 0) {
			setReports({});
			setRepeatTime({});
			setRepeatFrequency({});
			setDwellByHour({});
			getReports();
			getRepeatTime();
			getRepeatFrequency();
			getDwellByHour();
		}
		// eslint-disable-next-line
	}, [fromDate, toDate, selectedSites, chartView, history]);

	return (
		<React.Fragment>
			<div className="reports__refine-menu" >
				<Flex className="--margin-bottom-large" justify="space-between" wrap="wrap">
					{/* <LabelledComponent label="Date range">
						<DatePicker
							onChange={(values) => {
								if (values) {
									setFromDate(moment(values[0]).format(YMD));
									setToDate(moment(values[1]).format(YMD));
									localStorage.setItem("reports-from-date", `${dayjs(values[0]).format(YMD)}`);
									localStorage.setItem("reports-to-date", `${dayjs(values[1]).format(YMD)}`);
								} else {
									setFromDate(undefined);
									setToDate(undefined);
									localStorage.removeItem("reports-from-date");
									localStorage.removeItem("reports-to-date");
								}
							}}
							maxDate={new Date()}
							values={fromDate && toDate && [moment(fromDate), moment(toDate)]}
						/>
					</LabelledComponent> */}
					<LabelledComponent label="Car parks">
						<MultiSelect
							fullWidth={isMobile}
							className="reports__refine-menu__multi-select"
							options={selectableSites.map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
							values={selectedSites}
							onChange={(values) => {
								const normalizedSites = Formatter.normalizeSites(values) || [];
								setSelectedSites(normalizedSites);
								localStorage.setItem("reports-sites", normalizedSites.join());
							}}
						/>
					</LabelledComponent>
					<LabelledComponent label="Data format">
						<MultiSelect
							fullWidth={isMobile}
							style={{ width: 80 }}
							options={[
								{ label: "Daily", value: "Daily" },
								{ label: "Monthly", value: "Monthly" },
								{ label: "Quarterly", value: "Quarterly" },
								{ label: "Yearly", value: "Yearly" }
							]}
							multi={false}
							placeholder="Format"
							placement="bottomLeft"
							values={[Formatter.capitalize(chartView)]}
							onChange={(values) => {
								setChartView(String(values[0]).toLocaleLowerCase());
							}}
						/>
					</LabelledComponent>
					<LabelledComponent label="Graphs view">
						<Switch
							className="reports__refine-menu__switch"
							checkedChildren={<BarChartIcon />}
							unCheckedChildren={<LineChartIcon />}
							defaultChecked={chartType === "bar"}
							onChange={(isBarChart) => {
								if (isBarChart) {
									setChartType("bar");
									sessionStorage.setItem("reports-chart-type", "bar");
								} else {
									sessionStorage.setItem("reports-chart-type", "line");
									setChartType("line");
								}
							}}
						/>
					</LabelledComponent>
					{!isMobile && (
						<LabelledComponent label="Download formats">
							<Flex>
								<Button
									text="PDF"
									variant="filled"
									disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate)}
									icon={<PDFIcon />}
									loading={downloadingPDF}
									buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
									onClick={() => {
										setDownloadingPDF(true);
										setDownloadPdf(true)
										//window.print();
										setDownloadingPDF(false);
									}}
								/>
								<Button
									text="CSV"
									variant="filled"
									disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate)}
									icon={<CSVIcon />}
									loading={downloadingCSV}
									buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
									onClick={async () => {
										const sites = selectedSites?.join();
										setDownloadingCSV(true);
										try {
											const response = await axios.get(
												`/api/reports?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${chartView}&responseType=csv`,
												{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
											);

											const url = window.URL.createObjectURL(new Blob([response.data]));
											const link = document.createElement("a");
											link.href = url;
											link.setAttribute("download", `reports_${dayjs().format("DD_MM_YYYY")}.zip`);
											document.body.appendChild(link);
											link.click();
										} catch (e) {}
										setDownloadingCSV(false);
									}}
								/>
							</Flex>
						</LabelledComponent>
					)}
				</Flex>
				<Flex style={{ width: '80%', marginLeft:"5px" }} justify="space-between" wrap="wrap">
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth], currentMonth) }}
					>{months[currentMonth]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1], currentMonth) }}
					>{months[currentMonth === 0 ? currentMonth + 11 : currentMonth - 1]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 3 ? currentMonth + 8 : currentMonth - 4]}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5], currentMonth) }}
					>{months[currentMonth >= 0 && currentMonth <= 4 ? currentMonth + 7 : currentMonth - 5]}
					</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6] ? `--active` : ""}`}
						onClick={() => { setDateRange(months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6], currentMonth) }}
					>
						{months[currentMonth >= 0 && currentMonth <= 5 ? currentMonth + 6 : currentMonth - 6]}
					</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "2 Months" ? `--active` : ""}`}
						onClick={() => { setDateRange("2 Months", currentMonth) }}
					>{`${dayjs().subtract(2, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "3 Months" ? `--active` : ""}`}
						onClick={() => { setDateRange("3 Months", currentMonth) }}
					>{`${dayjs().subtract(3, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "6 Months" ? `--active` : ""}`}

						onClick={() => { setDateRange("6 Months", currentMonth) }}
					>{`${dayjs().subtract(6, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>
					<button
						className={`tab__link--compact tab__link--color-dark ${selectedMonth === "12 Months" ? `--active` : ""}`}

						onClick={() => { setDateRange("12 Months", currentMonth) }}
					>{`${dayjs().subtract(12, "month").format("MMM")} - ${dayjs().subtract(1, "month").format("MMM")}`}</button>

				</Flex>
			</div>
			<>
			{loading && (				
				<ProgressBar/>
			)}
			{reports && (
				<div className="reports-area" style={{ marginTop: 32 }}>
					{Object.keys(reports).length > 0 &&
						Object.keys(reports).map((site: string) => {
							const dateFrmt = "DD MMM (YYYY)";
							const dateRangeStr = `${dayjs(fromDate).format(dateFrmt)} - ${dayjs(toDate).format(dateFrmt)}`;

							return (
								<CardWithTabs
									key={site}
									loading={loading}
									hideOnLoading={false}
									activeLabel={activeLabel?.[site] || "visits"}
									title={
										<Flex direction="column">
											<h2 style={{ margin: 0, marginRight: 8, marginBottom: 4, marginTop: 8 }}>
												<b>{Formatter.capitalizeSite(formatSite(site, email))}</b>
											</h2>
											<h4>{dateRangeStr}</h4>
										</Flex>
									}
									onItemClick={({ label }) => setActiveLabel({ ...activeLabel, [site]: label })}
									tabColor="dark"
									isOpen
									items={[
										{
											label: "Visits",
											value: "visits",
											content: (
												<ReportGraph
													key={site}
													color="blue"
													secondaryColor="yellow"
													label="Unique visits"
													secondaryLabel="Repeat visits"
													type="Visits"
													graphType={chartType}
													stacked
													data={{
														datasets: [
															{
																values:
																	reports[site] &&
																	reports[site]?.map(({ ins, unique }) => String(Math.floor((ins * unique) / 100)))
															},
															{
																values:
																	reports[site] &&
																	reports[site]?.map(({ ins, repeat }) => String(Math.floor((ins * repeat) / 100)))
															}
														],
														labels:
															reports[site] &&
															reports[site]?.map(({ when }) =>
																chartView === "daily" ? dayjs(when).format("MMM DD") : when
															)
													}}
												/>
											)
										},
										{
											label: "Occupancy",
											value: "occupancy",
											content: (
												<ReportGraph
													key={site}
													color="green"
													label="Occupancy (average)"
													type="Occupancy"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: reports[site] && reports[site]?.map(({ occupancy }) => String(occupancy))
															}
														],
														labels:
															reports[site] &&
															reports[site]?.map(({ when }) =>
																chartView === "daily" ? dayjs(when).format("MMM DD") : when
															)
													}}
												/>
											)
										},
										{
											label: "Dwell",
											value: "dwell",
											content: (
												<ReportGraph
													key={site}
													color="purple"
													label="Dwell (average)"
													type="Dwell"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: reports[site] && reports[site]?.map(({ dwell }) => String(dwell))
															}
														],
														labels:
															reports[site] &&
															reports[site]?.map(({ when }) =>
																chartView === "daily" ? dayjs(when).format("MMM DD") : when
															)
													}}
												/>
											)
										},
										{
											label: "Repeat Entry Time",
											value: "repeatEntryTime",
											content: (
												<ReportGraph
													key={site}
													color="magenta"
													label="Repeat Count"
													type="Repeat Entry Time"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: repeatTime[site] && Object.values(repeatTime[site])
															}
														],
														labels: repeatTime[site] && Object.keys(repeatTime[site])
													}}
												/>
											)
										},
										{
											label: "Repeat Frequency",
											value: "repeatFrequency",
											content: (
												<ReportGraph
													key={site}
													color="orange"
													label="Repeat Frequency"
													type="Repeat Frequency"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: repeatFrequency[site] && Object.values(repeatFrequency[site])
															}
														],
														labels: repeatFrequency[site] && Object.keys(repeatFrequency[site])
													}}
												/>
											)
										},
										{
											label: "Dwell (by hour)",
											value: "dwellByHour",
											content: (
												<ReportGraph
													key={site}
													color="yellow"
													secondaryColor="magenta"
													tertiaryColor="blue"
													label="Total Dwell(Avg)"
													secondaryLabel="Unique Visits Dwell(Avg)"
													tertiaryLabel="Repeat Visits Dwell(Avg)"
													type="Dwell By Hour"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val:any) => val.totalDwell)
															},
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val:any) => val.uniqueDwell)
															},
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val:any) => val.repeatDwell)
															}
														],
														labels: dwellByHour[site] && Object.keys(dwellByHour[site])
													}}
												/>
											)
										}
									]}
								/>
							);
						})}
				</div>
			)}
			</>

			<PdfTemplate
			    download = {downloadPdf}
				setDownload={setDownloadPdf}
				reports={reports}
				repeatTime={repeatTime}
				repeatFrequency={repeatFrequency}
				dwellByHour={dwellByHour}
				chartType={chartType}
				fromDate={fromDate}
				toDate={toDate}
				selectedSite={selectedSites}
				dateRange={`${dayjs(fromDate).format("DD MMM YYYY")} - ${dayjs(toDate).format("DD MMM YYYY")}`}
			/>
		</React.Fragment>
	);
};
