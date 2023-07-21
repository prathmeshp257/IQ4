import { LegendItem } from "chart.js";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import { ZoomType } from "../screens/Dashboard";
import { DashboardData, Dwell, Occupancy, Visits } from "../types";
import { GraphFormat, GraphType } from "../types/OverviewData";
import { generateGraphProps, generateGraphStyle } from "./helpers";

interface Props {
	data: DashboardData;
	type?: GraphType;
	zoom: ZoomType;
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

interface DataPoint {
	labels: any;
	values: any;
}

export const OverviewGraph: FC<Props> = ({
	data,
	loading = false,
	type = "Dwell",
	zoom,
	onTypeSwitch,
	isOverlayed,
	format,
	labelAxisX
}) => {
	const [dataPoints, setDataPoints] = useState<DataPoint[]>();
	const [label] = useState<GraphType>((type as GraphType) || "Dwell");
	const [occupancy, setOccupancy] = useState<Occupancy[]>();
	const [visits, setVisits] = useState<Visits[]>();
	const [dwell, setDwell] = useState<Dwell[][]>();
	const [sites, setSites] = useState<string | string[] | undefined>();

	useEffect(() => {
		if (data) {
			setOccupancy(data.occupancy);
			setVisits(data.visits);
			setDwell(data.dwell);
			setSites(data.sites);
		}
	}, [data, isOverlayed]);

	useEffect(() => {
		if (label === "Occupancy" && occupancy && occupancy[0]) {
			setDataPoints(occupancy?.map(({ data }: any) => data));
			onTypeSwitch && onTypeSwitch("Occupancy");
		}

		if (label === "Visits" && visits && visits[0]) {
			setDataPoints(visits?.map(({ data }: any) => data));
			onTypeSwitch && onTypeSwitch("Visits");
		}

		if (label === "Dwell" && dwell && dwell[0]) {
			let dwellData = [];

			if (dwell) {
				for (let i = 0; i < dwell.length; i++) {
					dwellData.push({
						labels: dwell?.[i].map((item: any) => Object.keys(item)[0]),
						values: dwell?.[i].map((item: any) => Object.values(item)[0])
					});
				}
			}

			setDataPoints(dwellData);
			onTypeSwitch && onTypeSwitch("Dwell");
		}
		// eslint-disable-next-line
	}, [occupancy, visits, dwell, label, format, isOverlayed]);

	let total = 0;

	const getGraphProps = (maxAxisY?: number) => ({
		...generateGraphProps({
			height: isMobile ? 230 : 80,
			total,
			type,
			stacked: false,
			displayLegend: isOverlayed,
			displayTicksX: !isMobile || type === "Dwell",
			labelSpacingAxisX: labelAxisX ? (isMobile ? 30 : 70) : isMobile ? 10 : 40,
			labelSpacingAxisY: isMobile ? 60 : 60,
			displayLabelsAxisX: !isMobile,
			maxTicksX: isMobile ? 3 : 6,
			maxAxisY,
			redraw: false,
			offsetX: type === "Dwell" ? true : isOverlayed
		}),
		data: {
			labels: dataPoints?.[0].labels.map((label: string) => {
				if (type === "Dwell") return label;

				if (zoom === "1d") {
					return dayjs(label).format("DD MMM, HH:mm");
				}
				if (zoom === "1w" || zoom === "wtd") {
					return dayjs(label).format("DD MMM, HH:mm");
				}
				if (zoom === "1m" || zoom === "mtd") {
					return dayjs(label).format("DD MMM, HH:mm");
				}

				return label;
			}),
			datasets: dataPoints?.map(({ values }, idx) => {
				return {
					...generateGraphStyle({
						index: idx,
						border: 2,
						isOverlayed,
						type: label as "Occupancy" | "Visits" | "Dwell"
					}),
					label: sites?.[idx],
					data: values
				};
			})
		}
	});

	const legendProps = {
		...getGraphProps().legend,
		position: (isMobile ? "bottom" : "left") as "top" | "left" | "right" | "bottom" | "chartArea" | undefined,
		align: "start" as "start" | "end" | "center",
		onClick: function (_: any, legendItem: LegendItem) {
			const index = legendItem.datasetIndex as number;
			const ci = ((this as any) as { chart: any }).chart as Chart;
			const meta = ci.getDatasetMeta(index);
			meta.hidden = !meta.hidden;
			ci.update();
		}
	};

	const currentCapacity = occupancy?.reduce((acc: any, { capacity }: any) => acc + capacity, 0) || 0;

	return (
		<div>
			{!loading && occupancy && occupancy[0] && (
				<>
					{format === "line" && dataPoints && (
						<Line type='line' key={sites?.[0]} {...getGraphProps(currentCapacity)} options={legendProps} />
					)}
					{format === "bar" && dataPoints && (
						<Bar type='bar' key={sites?.[0]} {...getGraphProps(currentCapacity)} options={legendProps} />
					)}
				</>
			)}
		</div>
	);
};
