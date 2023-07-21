import { ChartData } from "chart.js";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { GraphType } from "../types/OverviewData";

export const colors = [
	"#02b88d", // Teal
	"#e8ca05", // Yellow
	"#0095ff", // Blue
	"#ff002f", // Red
	"#6f00ff", // Purple
	"#0ec836", // Green
	"#ff5e7a", // Pink
	"#410ec2", // Indigo
	"#da7c02", // Orange
	"#CD5C5C", // IndianRed
	"#6A5ACD", // SlateBlue
	"#3CB371", // MediumSeaGreen
	"#20B2AA", // LightSeaGreen
	"#F5DEB3", // Wheat
	"#F0FFFF", // Azure
	"#9932CC", // DarkOrchid
	"#F0E68C", // Khaki
	"#7FFF00", // Chartreuse
	"#B0E0E6", // PowderBlue
	"#000000", // Black
	"#3f2401" // Brown
];

export const colorsFaded = [
	"#02b88d65", // Teal
	"#e8ca0565", // Yellow
	"#0095ff65", // Blue
	"#ff002f65", // Red
	"#6f00ff65", // Purple
	"#0ec83665", // Green
	"#ff5e7a65", // Pink
	"#410ec265", // Indigo
	"#da7c0265", // Orange
	"#CD5C5C65", // IndianRed
	"#6A5ACD65", // SlateBlue
	"#3CB37165", // MediumSeaGreen
	"#20B2AA65", // LightSeaGreen
	"#F5DEB365", // Wheat
	"#F0FFFF65", // Azure
	"#9932CC65", // DarkOrchid
	"#F0E68C65", // Khaki
	"#7FFF0065", // Chartreuse
	"#B0E0E665", // PowderBlue
	"#00000065", // Black
	"#3f240165" // Brown
];

export const colorsByType = {
	Occupancy: "#02b88d", // Teal
	Visits: "#0095ff", // Blue
	Dwell: "#6f00ff", // Purple
	Make: "#02b88d", // Teal
	Model: "#0095ff", // Blue
	Age: "#6f00ff", // Purple
	Fuel: "#ff002f", // Red
	Emissions: "#9932CC", // DarkOrchid
	CO2: "#F0E68C", // Khaki
	Color:"#0ec83665", //Green
	Valuations:"#6f00ff65", // Purple
	"EV-Total Visits": "#F5DEB365", // Wheat
	"EV-Dwell Time By Hour": "#6A5ACD65", // SlateBlue
	"EV-Average Dwell Time": "#CD5C5C65", // IndianRed
	"EV-Repeat Visits": "#20B2AA65", // LightSeaGreen
};

export const colorsFadedByType = {
	Occupancy: "#02b88d65", // Teal
	Visits: "#0095ff65", // Blue
	Dwell: "#6f00ff65", // Purple
	Make: "#02b88d65", // Teal
	Model: "#0095ff65", // Blue
	Age: "#6f00ff65", // Purple
	Fuel: "#ff002f65", // Red
	Emissions: "#9932CC65", // DarkOrchid
	CO2: "F0E68C6565", // Khaki
	Color:"#0ec83665", //Green
	Valuations:"#6f00ff65", // Purple
	"EV-Total Visits": "#F5DEB365", // Wheat
	"EV-Dwell Time By Hour": "#6A5ACD65", // SlateBlue
	"EV-Average Dwell Time": "#CD5C5C65", // IndianRed
	"EV-Repeat Visits": "#20B2AA65", // LightSeaGreen
};

export const stackedTooltip = ({ total, type }: { total: number; type: GraphType; stacked?: boolean }) => {
	return {
		mode: type === "Emissions" ? ("nearest" as "nearest") : ("index" as "index"),
		position: "nearest",
		intersect: true,
		cornerRadius: 16,
		backgroundColor: "#fbfbfb",
		bodyFontColor: "#414454",
		titleFontColor: "#414454",
		titleFontSize: 14,
		footerFontColor: "#414454",
		footerFontSize: 14,
		borderColor: "#8a8a8a",
		borderWidth: 0,
		xPadding: 12,
		yPadding: 12,
		caretSize: 10,
		multiKeyBackground: "#00000000",
		caretPadding: 10,
		callbacks: {
			title: (titleItem: any) => {
				const labelX = titleItem[0].xLabel;
				if (type === "Dwell") {
					return "Duration: " + labelX;
				} else if (["Make", "Model", "Color"].includes(type)) {
					return titleItem[0].yLabel;
				} else if (["Age"].includes(type)) {
					return "Vehicle age: " + labelX;
				} else if (["Fuel", "EV-Dwell Time By Hour", "EV-Repeat Visits"].includes(type)) {
					return labelX;
				} else if (["Emissions"].includes(type)) {
					return "";
				} else if (["Occupancy", "Visits"].includes(type)) {
					if (labelX.length === 4) {
						return labelX;
					}
					if (dayjs(labelX).isValid()) {
						return dayjs(labelX).format("ddd DD MMM, HH:mm");
					}
					return labelX;
				} else {
					if (dayjs(labelX).isValid()) {
						return dayjs(labelX).format("ddd DD MMM");
					}
					return labelX;
				}
			},
			afterTitle: () => {
				total = 0;
				if (type === "Emissions") return "";
				return " ";
			},
			label: (tooltipItem: any, data: ChartData): string | string[] => {
				const label = data?.datasets?.[tooltipItem?.datasetIndex || 0].label;
				const value = data?.datasets?.[tooltipItem?.datasetIndex || 0]?.data?.[tooltipItem?.index || 0] || 0;
				if (Number(value) === 0) return "";
				total += Number(value);

				return ` ${label}: ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
			},
			afterLabel: () => {
				return "";
			},
			footer: () => {
				return "\nTotal: " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		}
	};
};

const getLabelYString = (type: any) => {
	switch (type) {
		case "Dwell":
			return "Average stay (mins)";
		case "Make":
			return "Manufacturers";
		case "Model":
			return "Make & Model";
		case "Color":
			return "Color";
		case "Age":
			return "Vehicles";
		case "Fuel":
			return "Vehicles";
		case "Emissions":
			return "Vehicles";
		case "CO2":
			return "Emissions (average)";
		case "Valuations":
			return "Valuations (average)";
		default:
			return "";
	}
};

const getLabelXString = (type: any) => {
	switch (type) {
		case "Make":
			return "Num of vehicles";
		case "Color":
			return "Num of vehicles";
		case "Model":
			return "Num of vehicles";
		case "Emissions":
			return "CO₂ emissions";
		default:
			return "";
	}
};

export const generateGraphProps = ({
	height = isMobile ? 500 : 120,
	total,
	maxTicksX = 12,
	maxTicksY,
	maxAxisX,
	maxAxisY,
	type,
	stacked,
	offsetX = false,
	isHorizontal = false,
	displayLegend = true,
	labelAxisX,
	labelAxisY,
	labelSpacingAxisX = 40,
	labelSpacingAxisY = 120,
	redraw = false,
	displayLabelAxisX = true,
	displayLabelAxisY = true,
	displayTicksX = true
}: {
	height?: number;
	total: number;
	maxTicksX?: number;
	maxTicksY?: number;
	maxAxisX?: number;
	maxAxisY?: number;
	type: GraphType;
	stacked: boolean;
	redraw?: boolean;
	offsetX?: boolean;
	labelAxisX?: string;
	labelAxisY?: string;
	labelSpacingAxisX?: number;
	labelSpacingAxisY?: number;
	isHorizontal?: boolean;
	displayLegend?: boolean;
	displayLabelAxisX?: boolean;
	displayLabelAxisY?: boolean;
	displayTicksX?: boolean;
	displayLabelsAxisX?: boolean;
	displayLabelsAxisY?: boolean;
}) => {
	return {
		redraw,
		height,
		responsive: true,
		legend: {
			display: displayLegend,
			labels: { padding: 20, boxWidth: 5, usePointStyle: true, fullWidth: false, fontSize: isMobile ? 10 : 10 }
		},
		options: {
			tooltips: stackedTooltip({ total, type, stacked }),
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 20,
					bottom: 0
				}
			},
			scales: {
				xAxes: [
					{
						scaleLabel: {
							display: displayLabelAxisX,
							labelString: labelAxisX !== undefined ? labelAxisX : getLabelXString(type)
						},
						afterFit: function (scale: any) {
							scale.height = isMobile ? (displayTicksX ? scale.height : false) : labelSpacingAxisX;
						},
						stacked,
						offset: offsetX,
						gridLines: { drawOnChartArea: !isMobile && isHorizontal, drawBorder: !isMobile },
						ticks: {
							display: displayTicksX,
							fontSize: 10,
							max: maxAxisX,
							major: { enabled: true },
							minRotation: isMobile ? 35 : 0,
							maxRotation: isMobile ? 35 : 0,
							maxBarThickness: isMobile ? 15 : 30,
							maxTicksLimit: isMobile ? 5 : maxTicksX
						}
					}
				],
				yAxes: [
					{
						scaleLabel: {
							display: !isMobile && displayLabelAxisY,
							labelString: labelAxisY !== undefined ? labelAxisY : getLabelYString(type)
						},
						afterFit: function (scale: any) {
							scale.width = isMobile ? scale.width : labelSpacingAxisY;
						},
						offset: isHorizontal,
						position: isMobile ? "right" : "left",
						stacked,
						gridLines: { drawOnChartArea: !isMobile && !isHorizontal, drawBorder: !isMobile },
						label: type === "Dwell" ? "Stays" : type,
						ticks: {
							fontSize: 10,
							beginAtZero: true,
							max: (type === "Occupancy" && maxAxisY) || undefined,
							maxTicksLimit: isMobile ? 7 : maxTicksY || 5,
							maxBarThickness: isMobile ? 15 : 30
						},
						display: true
					}
				]
			}
		}
	};
};

export const generateGraphStyle = ({
	index,
	border = 0,
	isOverlayed = false,
	isHorizontal = false,
	type
}: {
	index: number;
	border?: number;
	isOverlayed?: boolean;
	isHorizontal?: boolean;
	type: "Occupancy" | "Visits" | "Dwell" | "Make" | "Model" | "Age" | "Fuel" | "Emissions" | "CO2" | "Color" | "Valuations" | "EV-Total Visits" | "EV-Dwell Time By Hour" | "EV-Average Dwell Time" | "EV-Repeat Visits";
}) => {
	return {
		fill: true,
		lineTension: 0,
		borderColor: isOverlayed ? colors[index] : colorsByType[type],
		backgroundColor: isOverlayed ? colorsFaded[index] : colorsFadedByType[type],
		pointBorderColor: isOverlayed ? colors[index] : colorsByType[type],
		borderWidth: border,
		borderDash: [],
		pointBackgroundColor: isOverlayed ? colors[index] : colorsByType[type],
		maxBarThickness: isHorizontal ? 10 : isMobile ? 15 : 70,
		pointBorderWidth: 0,
		pointHoverRadius: 6,
		pointRadius: 0,
		pointHitRadius: 6,
		spanGaps: true
	};
};
