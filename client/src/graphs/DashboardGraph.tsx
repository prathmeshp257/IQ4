import { createMuiTheme, LinearProgress, LinearProgressProps, MuiThemeProvider } from "@material-ui/core";
import dayjs from "dayjs";
import React, { FC, useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { isMobile } from "react-device-detect";
import { Flex } from "../components/Flex/Flex";
import { SingleStatCard } from "../components/SingleStatCard";
import { AuthContext, UserContext } from "../context";
import { ZoomType } from "../screens/Dashboard";
import { DashboardData, Dwell, Historic, Occupancy, Visits, RepeatTime, RepeatFrequency, DwellByHour } from "../types";
import { GraphFormat, GraphType } from "../types/OverviewData";
import { colors as utilsColors, formatSite, Formatter } from "../utils";
import { colors } from "./helpers";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const chart = {
	options: {
		chart: {
			id: "dashboard-graph",
			type: "area" as any,
			animations: {
				enabled: false,
				easing: "easeinout" as any,
				speed: 400,
				animateGradually: {
					enabled: true,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 500
				}
			},
			toolbar: {
				show: true,
				offsetX: 0,
				offsetY: 0,
				tools: {
					download: false,
					selection: true,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: false,
					reset: true,
					customIcons: []
				},
				export: undefined,
				autoSelected: "zoom" as any
			},
			zoom: {
				enabled: true,
				type: "x" as any,
				autoScaleYaxis: true,
				zoomedArea: {
					fill: {
						color: "#90CAF9",
						opacity: 0.4
					},
					stroke: {
						color: "#0D47A1",
						opacity: 0.4,
						width: 1
					}
				}
			}
		},
		colors: colors,
		dataLabels: {
			enabled: false,
			// enabledOnSeries: [1] as any
		},
		fill: {
			type: "solid",
			opacity: 0.35
		},
		grid: {
			show: true,
			borderColor: "#dddddd",
			strokeDashArray: 0,
			position: "back" as any,
			xaxis: {
				lines: {
					show: false
				}
			},
			yaxis: {
				lines: {
					show: true
				}
			},
			padding: {
				top: 10,
				right: 15,
				bottom: isMobile ? 20 : 0,
				left: 13
			}
		},
		legend: {
			show: true,
			showForSingleSeries: true,
			showForNullSeries: true,
			showForZeroSeries: true,
			position: isMobile ? "bottom" : "left" as any,
			tooltipHoverFormatter: function (seriesName: any, opts: any) {
				return seriesName + " - <strong>" + (opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] || 0) + "</strong>";
			},
			itemMargin: {
				horizontal: 8,
				vertical: 3
			},
			fontSize: "12px",
			offsetX: -20,
			offsetY: isMobile ? 0 : 30,
			labels: {
				colors: ["#747070"],
				useSeriesColors: false
			},
			markers: {
				width: 8,
				height: 8,
				strokeWidth: 0,
				strokeColor: "#fff",
				fillColors: undefined,
				radius: 8,
				customHTML: undefined,
				onClick: undefined,
				offsetX: 0,
				offsetY: 0
			}
		},
		markers: {
			size: [0],
			colors: undefined,
			strokeColors: "#fff",
			strokeWidth: 2,
			strokeOpacity: 0.9,
			strokeDashArray: 0,
			fillOpacity: 1,
			discrete: [],
			shape: "circle" as any,
			radius: 2,
			offsetX: 0,
			offsetY: 0,
			onClick: () => alert("click"),
			onDblClick: () => alert("dbclick"),
			showNullDataPoints: true,
			hover: {
				size: 6
			}
		},
		noData: {
			text: "No Data",
			align: "center" as any,
			verticalAlign: "middle" as any,
			offsetX: 0,
			offsetY: 0,
			style: {
				color: undefined,
				fontSize: "14px",
				fontFamily: undefined
			}
		},
		stroke: {
			show: true,
			curve: "smooth" as any,
			lineCap: "straight" as any,
			colors: undefined,
			width: 2,
			dashArray: 0
		},
		theme: {
			mode: "light" as any,
			palette: "palette1",
			monochrome: {
				enabled: false,
				color: "#255aee",
				shadeTo: "light" as any,
				shadeIntensity: 0.65
			}
		},
		tooltip: {
			enabled: true,
			enabledOnSeries: false as any,
			shared: true,
			followCursor: true,
			intersect: false,
			inverseOrder: false,
			custom: undefined,
			fillSeriesColor: false,
			theme: "dark",
			style: {
				fontSize: "10px",
				fontFamily: undefined
			},
			onDatasetHover: {
				highlightDataSeries: false
			},
			x: {
				show: true,
				format: "DD MMM",
				formatter: undefined
			},
			y: {
				formatter: undefined,
				title: {
					formatter: (seriesName: string) => seriesName
				}
			},
			z: {
				formatter: undefined,
				title: "Size: "
			},
			marker: {
				show: true
			},
			items: {
				display: "flex"
			},
			fixed: {
				enabled: true,
				position: "topLeft",
				offsetX: -2000,
				offsetY: 0
			}
		},
		xaxis: {
			type: "datetime" as any,
			categories: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			labels: {
				show: true,
				rotate: -45,
				rotateAlways: false,
				hideOverlappingLabels: true,
				showDuplicates: false,
				trim: false,
				minHeight: 0,
				maxHeight: 120,
				style: {
					colors: [],
					fontSize: "12px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: 400,
					cssClass: "apexcharts-xaxis-label"
				},
				offsetX: 0,
				offsetY: 0,
				datetimeUTC: true,
				formatter: (x: any) => dayjs(x).format("DD MMM"),
				datetimeFormatter: {
					year: "yyyy",
					month: "MMM 'yy",
					day: "dd MMM",
					hour: "HH:mm"
				}
			},
			axisBorder: {
				show: true,
				color: "#78909C",
				height: 1,
				width: "100%",
				offsetX: 0,
				offsetY: 0
			},
			axisTicks: {
				show: true,
				borderType: "solid",
				color: "#78909C",
				height: 6,
				offsetX: 0,
				offsetY: 0
			},
			tickAmount: isMobile ? 5 : 12,
			tickPlacement: "between",
			min: undefined,
			max: undefined,
			range: undefined,
			floating: false,
			position: "bottom",
			title: {
				text: undefined,
				offsetX: 0,
				offsetY: 0,
				style: {
					color: undefined,
					fontSize: "12px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: 600,
					cssClass: "apexcharts-xaxis-title"
				}
			},
			crosshairs: {
				show: true,
				width: 1,
				position: "front",
				opacity: 1,
				stroke: {
					color: "#cccccc",
					width: 1,
					dashArray: 2
				},
				fill: {
					type: "solid",
					color: "#B1B9C4",
					gradient: {
						colorFrom: "#D8E3F0",
						colorTo: "#BED1E6",
						stops: [0, 100],
						opacityFrom: 0.4,
						opacityTo: 0.5
					}
				}
			},
			tooltip: {
				enabled: true,
				offsetY: 0
			}
		},
		yaxis: {
			floating: false,
			decimalsInFloat: 0,
			tickAmount: 3,
			min: 0,
			borderColor: "#00E396",
			axisBorder: {
				show: true,
				color: "#dddddd",
				offsetX: 0,
				offsetY: 0
			},
			crosshairs: {
				show: true,
				width: 1,
				position: "front",
				opacity: 1,
				stroke: {
					color: "#009fff",
					width: 1,
					dashArray: 0
				},
				fill: {
					type: "solid",
					color: "#B1B9C4",
					gradient: {
						colorFrom: "#D8E3F0",
						colorTo: "#BED1E6",
						stops: [0, 100],
						opacityFrom: 0.4,
						opacityTo: 0.5
					}
				}
			},
			tooltip: {
				enabled: true,
				offsetX: 0
			}
		}
	}
};

interface Props {
	data: DashboardData;
	type?: GraphType;
	zoom: ZoomType;
	site?: string;
	format: GraphFormat;
	loading?: boolean;
	isOverlayed: boolean;
	labelAxisX?: string;
	onTypeSwitch?: (type: string) => void;
	diff?: {
		occupancy: {
			value: number;
			percent: string;
		};
		visits: {
			value: number;
			percent: string;
		};
	};
}

const theme = createMuiTheme({ palette: { secondary: { main: utilsColors.secondary } } });

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
		<Box sx={{ width: '100%', mr: 1 }}>
			<LinearProgress variant="determinate" {...props} />
		</Box>
		<Box sx={{ minWidth: 35 }}>
			<Typography variant="body2" color="text.secondary">{`${Math.round(
			props.value,
			)}%`}</Typography>
		</Box>
		</Box>
	);
}

export const DashboardGraph: FC<Props> = ({
	loading = false,
	data,
	type = "Occupancy",
	zoom,
	onTypeSwitch,
	isOverlayed,
	format,
	site,
	diff
}) => {
	const [axisX, setAxisX] = useState<Array<any>>();
	const [series, setSeries] = useState<Array<any>>();
	const [occupancy, setOccupancy] = useState<Occupancy[]>();
	const [historic, setHistoric] = useState<Historic[]>();
	const [visits, setVisits] = useState<Visits[]>();
	const [dwell, setDwell] = useState<Dwell[][]>();
	const [sites, setSites] = useState<any>();
	const [repeatTime, setRepeatTime] = useState<RepeatTime[]>();
	const [repeatFrequency, setRepeatFrequency] = useState<RepeatFrequency[]>();
	const [dwellByHour, setDwellByHour] = useState<DwellByHour[]>();

	const [currentOccupancy, setCurrentOccupancy] = useState(0);
	const [currentCapacity, setCurrentCapacity] = useState(0);
	const [totalVisits, setTotalVisits] = useState(0);
	const [currentDwell, setCurrentDwell] = useState(0);
	const [currentRepeatFrequency, setCurrentRepeatFrequency] = useState(0);
	const [currentDwellByHour, setCurrentDwellByHour] = useState(0);
	const [hiddenSites, setHiddenSites] = useState<any>([]);
	const [indexesToHide, setIndexesToHide] = useState<any>([]);

	const { email } = useContext(UserContext);
	const {userData} = useContext(AuthContext);

	const [progress, setProgress] = useState(10);

    useEffect(() => {
		const timer = setInterval(() => {
		  setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
		}, 1500);
		return () => {
		  clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		if (data && !site) {
			setOccupancy(data && data.occupancy ? data.occupancy : []);
			setHistoric(data && data.historic ? data.historic : []);
			setVisits(data && data.visits ? data.visits : []);
			setDwell(data && data.dwell ? data.dwell : []);
			setRepeatTime(data && data.repeatTime ? data.repeatTime : []);
			setRepeatFrequency(data && data.repeatFrequency ? data.repeatFrequency : []);
			setDwellByHour(data && data.dwellByHour ? data.dwellByHour : []);
			setSites(
				["guykendall@eurocarparks.com"].includes(email)
					? data.sites.map((site) => {
							if (site === "king-st-west-stockport") return "king-st";
							if (site === "test") return "office";
							return site;
					  })
					: data && data.sites ? data.sites : []
			);
		}
		if (data && site) {
			const siteIndex = data.sites?.findIndex((siteName) => Formatter.normalizeSite(siteName) === Formatter.normalizeSite(site)) || 0;

			setOccupancy(data && data.occupancy && data.occupancy[siteIndex] ? [data.occupancy[siteIndex]] : []);
			setHistoric(data && data.historic && data.historic[siteIndex] ? [data.historic[siteIndex]]: []);
			setVisits(data && data.visits && data.visits[siteIndex] ? [data.visits[siteIndex]] : [] );
			setDwell(data && data.dwell && data.dwell[siteIndex] ? [data.dwell[siteIndex]] : []);
			setSites(data && data.sites && data.sites[siteIndex] ? [data.sites[siteIndex]] : []);
			setRepeatTime(data && data.repeatTime && data.repeatTime[siteIndex] ? [data.repeatTime[siteIndex]] : []);
			setRepeatFrequency(data && data.repeatFrequency && data.repeatFrequency[siteIndex] ? [data.repeatFrequency[siteIndex]] : []);
			setDwellByHour(data && data.dwellByHour && data.dwellByHour[siteIndex] ? [data.dwellByHour[siteIndex]] : []);
		}
	}, [data, site, email]);

	useEffect(() => {
		if (!sites) return;
		const dataSites = isOverlayed && data && data.sites
			? data.sites.map((site) => formatSite(site, email))
			: sites.map((site: string) => formatSite(site, email));

		if (type === "Occupancy" && occupancy && occupancy[0]) {
			setSeries(dataSites?.map((site: any, idx: any) => ({ name: site, data: occupancy[idx].data.values })));
			setAxisX(occupancy[0].data.labels);
		}

		if (type === "Visits" && visits && visits[0]) {
			setSeries(dataSites?.map((site: any, idx: any) => ({ name: site, data: visits[idx].data.values })));
			setAxisX(visits[0].data.labels);
		}

		if (type === "Dwell" && dwell && dwell[0]) {
			setSeries(
				dataSites?.map((site: any, idx: any) => ({
					name: site,
					data: dwell[idx].map((v) => Object.values(v)[0])
				}))
			);
			setAxisX(dwell[0].map((v) => Object.keys(v)));
		}

		if (type === "Repeat Time" && repeatTime && repeatTime[0]) {
			setSeries(dataSites?.map((site: any, idx: any) => ({ name: site, data: repeatTime[idx].data.values })));
			setAxisX(repeatTime[0].data.labels);
		}
		
		if (type === "Repeat Frequency" && repeatFrequency && repeatFrequency[0]) {
			setSeries(dataSites?.map((site: any, idx: any) => ({ name: site, data: repeatFrequency[idx].data.values })));
			let maxRepeatIndex = 0;
			let maxRepeat = 2;
			repeatFrequency.map((freq, index) => {
				if(freq.data.labels.length > maxRepeat){
					maxRepeat = freq.data.labels.length;
					return maxRepeatIndex = index;
				}
				else{
					return maxRepeatIndex;
				}
			})
			setAxisX(repeatFrequency[maxRepeatIndex].data.labels);
		}

		if (type === "Dwell (by hour)" && dwellByHour && dwellByHour[0]) {
			setSeries(dataSites?.map((site: any, idx: any) => ({ name: site, data: dwellByHour[idx].data.values })));
			setAxisX(dwellByHour[0].data.labels);
		}

		// eslint-disable-next-line
	}, [occupancy, visits, dwell, format, isOverlayed, type, sites, repeatTime, repeatFrequency, dwellByHour]);

	useEffect(() => {
		setIndexesToHide(
			hiddenSites.map((hiddenSite: string) => {
				return sites?.indexOf(Formatter.capitalizeSite(hiddenSite) || "");
			})
		);

		// eslint-disable-next-line
	}, [data, hiddenSites]);

	useEffect(() => {
		setHiddenSites([]);
		setIndexesToHide([]);
	}, [format]);

	useEffect(() => {
		const historicLength = historic?.filter((_: any, idx: number) => !indexesToHide.includes(idx)).length || 1;

		const newCurrentOccupancy = occupancy
			?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
			?.reduce((acc: any, { current: c }: any) => acc + Number(Number.isNaN(c) ? 0 : c), 0);

		const newCurrentCapacity =
			occupancy
				?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
				?.reduce((acc: any, { capacity }: any) => acc + capacity, 0) || 0;

		const newTotalVisits =
			visits
				?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
				?.reduce((acc: any, { total }: any) => acc + total, 0) || 0;

		const newCurrentDwell = Math.round(
			historic
				?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
				?.reduce((acc: any, { dwell }: any) => acc + dwell, 0) / historicLength || 0
		);

		const newCurrentRepeatFrequency =
			repeatFrequency
				?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
				?.reduce((acc: any, { total }: any) => acc + total, 0) || 0;
				
		const NewCurrentDwellByHour = Math.round(
			dwellByHour
				?.filter((_: any, idx: number) => !indexesToHide.includes(idx))
				?.reduce((acc: any, { average }: any) => acc + average, 0) / historicLength || 0
		);

		setCurrentOccupancy(newCurrentOccupancy);
		setCurrentCapacity(newCurrentCapacity);
		setTotalVisits(newTotalVisits);
		setCurrentRepeatFrequency(newCurrentRepeatFrequency);
		setCurrentDwellByHour(NewCurrentDwellByHour)
		setCurrentDwell(newCurrentDwell);
	}, [occupancy, historic, visits, dwell, indexesToHide, zoom, repeatFrequency, dwellByHour]);

	const getColorsByType = (type: GraphType) => {
		if (type === "Occupancy") {
			return [colors[0]];
		}

		if (type === "Visits") {
			return [colors[2]];
		}

		if (type === "Dwell") {
			return [colors[4]];
		}

		if (type === "Repeat Time") {
			return [colors[5]];
		}

		if (type === "Repeat Frequency") {
			return [colors[6]];
		}

		if (type === "Dwell (by hour)") {
			return [colors[8]];
		}
		return colors;
	};

	const getMaxByType = (type: GraphType) => {
		if (type === "Occupancy") {
			return currentCapacity;
		}

		return undefined;
	};

	const chartOpts = {
		...chart.options,
		chart: {
			...chart.options.chart,
			animations: {
				...chart.options.chart.animations,
				enabled: true
			},
			events: {
				legendClick: function (_: any, seriesIndex: number) {
					const alreadyExists = indexesToHide.find((idx: any) => idx === seriesIndex);

					if (alreadyExists === undefined) {
						setIndexesToHide([...indexesToHide, seriesIndex]);
					} else {
						const newIndexesToHide = indexesToHide.filter((idx: any) => idx !== seriesIndex);
						setIndexesToHide(newIndexesToHide);
					}
				}
			}
		},
		colors: isOverlayed ? colors : getColorsByType(type),
		tooltip: {
			...chart.options.tooltip,
			x: {
				...chart.options.tooltip.x,
				format: type === "Occupancy" ? chart.options.tooltip.x.format : undefined,
				formatter: type === "Occupancy" ? chart.options.tooltip.x.formatter : undefined
			}
		},
		xaxis: {
			...chart.options.xaxis,
			categories: axisX,
			type: undefined,
			tickAmount:
				type === "Occupancy" ? (zoom === "1d" ? 11 : chart.options.xaxis.tickAmount) : chart.options.xaxis.tickAmount,
			labels: {
				...chart.options.xaxis.labels,
				formatter:
					type === "Occupancy"
						? zoom === "1d"
							? (x: any) => dayjs(x).format("HH:mm")
							: chart.options.xaxis.labels.formatter
						: undefined,
				datetimeFormatter: type === "Occupancy" ? chart.options.xaxis.labels.datetimeFormatter : undefined
			}
		},
		yaxis: { ...chart.options.yaxis, max: getMaxByType(type) }
	};
	return (
		<div>
			{loading && (
				<div className="shell__loader">
					<MuiThemeProvider theme={theme}>
						<LinearProgressWithLabel className="shell__loading-bar" color="secondary" value={progress}/>
					</MuiThemeProvider>
				</div>
			)}
			{!loading && occupancy && occupancy[0] && (
				<div>
					<Flex wrap="wrap">
						{(userData.userType === "Admin" || (userData.occupancyProAccess && userData.occupancyProAccessSites.length>0)) &&<SingleStatCard
							label={zoom === "1d" ? "Occupancy" : "Occupancy (average)"}
							value={`${currentOccupancy}/${currentCapacity}`}
							color="teal"
							hoverColor="#02b88d25"
							active={type === "Occupancy"}
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Occupancy");
							}}
							diff={(diff && diff.occupancy) || undefined}
							tooltip={`Compared to ${dayjs().subtract(1, "day").format("DD MMM [at] HH:mm")}`}
						/>}
						<SingleStatCard
							label={"Total visits"}
							value={totalVisits}
							color="blue"
							active={type === "Visits"}
							hoverColor="#0095ff25"
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Visits");
							}}
							diff={(diff && diff.visits) || undefined}
							tooltip={`Compared to ${dayjs().subtract(1, "day").format("DD MMM [at] HH:mm")}`}
						/>
						<SingleStatCard
							label="Dwell (average)"
							value={`${currentDwell} minutes`}
							color="purple"
							active={type === "Dwell"}
							hoverColor="#6f00ff25"
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Dwell");
							}}
						/>
						<SingleStatCard
							label="Repeat Entry Time"
							value="See Graph"
							color="success"
							active={type === "Repeat Time"}
							hoverColor="#6f00ff25"
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Repeat Time");
							}}
						/>
						<SingleStatCard
							label="Repeat Frequency"
							value={currentRepeatFrequency}
							color="warning"
							active={type === "Repeat Frequency"}
							hoverColor="#6f00ff25"
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Repeat Frequency");
							}}
						/>
						<SingleStatCard
							label="Dwell (by hour)"
							value="See Graph"
							color="teal"
							active={type === "Dwell (by hour)"}
							hoverColor="#6f00ff25"
							onClick={() => {
								onTypeSwitch && onTypeSwitch("Dwell (by hour)");
							}}
						/>
					</Flex>

					{!loading && series && (
						<div key={historic?.[0].ins}>
							{format === "line" && (
								<Chart options={chartOpts} series={series} type="area" height={isMobile ? 400 : 200} />
							)}
							{format === "bar" && (
								<Chart options={chartOpts} series={series} type="bar" height={isMobile ? 400 : 200} />
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
