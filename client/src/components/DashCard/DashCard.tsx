import { Tooltip } from "@material-ui/core";
import DownIcon from "@material-ui/icons/ArrowDownward";
import UpIcon from "@material-ui/icons/ArrowUpward";
import StaleIcon from "@material-ui/icons/Remove";
import React, { FC } from "react";
import { Flex } from "../Flex";
import { RatioBar } from "./RatioBar";

interface DashCardProps {
	title: string;
	value: string | number | undefined;
	type?: string;
	titleColor: string;
	ratio?: string | number | undefined;
	ratioColor?: string;
	tooltip?: string;
	diff?: {
		value: string;
		percent: string;
	};
	cardType?:string;
	mode?:string;
}

export const DashCard: FC<DashCardProps> = ({
	title,
	value,
	diff,
	tooltip,
	type,
	titleColor = "teal",
	ratio,
	ratioColor,
	cardType,
	mode
}) => {
	return (
		<div className={`dash-card dash-card__variant-${cardType === "iqStat" ? "stat" : cardType === 'live' && mode === 'row' ? 'live' : ratio != null || cardType === "health" ? "default" : "compact"}`}>
			<div className={`dash-card__main-${ratio ? "default" : "compact"}`}>
				<Flex direction="row" justify="space-between">
					<h4 className={`dash-card__title --color-${titleColor} --no-margin`}>{title}</h4>
					{diff && diff.percent.charAt(0) === "+" && (
						<Flex className="dash-card__diff">
							<Tooltip title={tooltip || ""}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<div className="dash-card__diff-icon --bg-color-teal">
										<UpIcon fontSize="inherit" />
									</div>
									<div className="dash-card__diff-percent-up --color-teal --margin-left-medium">
										{diff.value} ({diff.percent.slice(1)})
									</div>
								</div>
							</Tooltip>
						</Flex>
					)}
					{diff && diff.percent.charAt(0) !== "+" && diff.percent.charAt(0) !== "-" && (
						<Flex className="dash-card__diff">
							<Tooltip title={tooltip || ""}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<div className="dash-card__diff-icon --bg-color-gray">
										<StaleIcon fontSize="inherit" />
									</div>
									<div className="dash-card__diff-percent-stale --color-gray --margin-left-medium">
										{diff.value} ({diff.percent})
									</div>
								</div>
							</Tooltip>
						</Flex>
					)}
					{diff && diff.percent.charAt(0) === "-" && (
						<Flex className="dash-card__diff">
							<Tooltip title={tooltip || ""}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<div className="dash-card__diff-icon --bg-color-danger">
										<DownIcon fontSize="inherit" />
									</div>
									<div className="dash-card__diff-percent-down --color-danger --margin-left-medium">
										{diff.value} ({diff.percent.slice(1)})
									</div>
								</div>
							</Tooltip>
						</Flex>
					)}
				</Flex>
				<div className="dash-card__content">
					<h2 className="dash-card__value --no-margin">{value || 0}</h2>
					{type && <span className="dash-card__type --no-margin">{type}</span>}
				</div>
			</div>

			{ratio != null && (
				<div className={mode === 'row' ? "dash-card__ratio-row" : "dash-card__ratio"}>
					<RatioBar percentage={ratio} color={ratioColor || ""} />
				</div>
			)}
		</div>
	);
};
