import { Tooltip } from "@material-ui/core";
import DownIcon from "@material-ui/icons/ArrowDownward";
import UpIcon from "@material-ui/icons/ArrowUpward";
import StaleIcon from "@material-ui/icons/Remove";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { Flex } from "../Flex";

interface SingleStatCardProps {
	label: string;
	value: string | number | undefined;
	color: "success" | "teal" | "warning" | "blue" | "purple" | "red";
	hoverColor?: string;
	hidden?: boolean;
	active?: boolean;
	tooltip?: string;
	style?: CSSProperties;
	onClick?: () => void;
	diff?: {
		value: number;
		percent: string;
	};
}

export const SingleStatCard: FC<SingleStatCardProps> = ({
	label,
	style,
	value = 0,
	color,
	hoverColor,
	onClick,
	active,
	tooltip,
	hidden = false,
	diff
}) => {
	const [backgroundColor, setBackgroundColor] = useState(active ? hoverColor : "#eeeeee");

	useEffect(() => {
		setBackgroundColor(active ? hoverColor : "#eeeeee");
	}, [active, hoverColor]);

	return (
		<div
			tabIndex={0}
			onKeyDown={(e) => {
				if (![" ", "Enter"].includes(e.key)) return;
				e.preventDefault();
				setBackgroundColor(hoverColor || "#c5c5c538");
				if (onClick) onClick();
			}}
			onBlur={() => setBackgroundColor(active ? hoverColor : "#eeeeee")}
			onMouseOut={() => setBackgroundColor(active ? hoverColor : "#eeeeee")}
			className={`single-stat-card ${hidden ? "--hidden" : ""}`}
			style={{ background: backgroundColor, ...style }}
			onClick={onClick}
		>
			{color && (
				<div className="single-stat-card__left-area">
					<div style={{ width: "100%" }}>
						<Flex direction="row" justify="space-between" style={{ marginBottom: 4 }}>
							<Flex align="center">
								<div className={`single-stat-card__dot --bg-color-${color}`} />
								{label && <p className={`single-stat-card__label --color-${color}`}>{label}</p>}
							</Flex>
							{diff && diff.percent.charAt(0) === "+" && (
								<Flex className="single-stat-card__diff">
									<Tooltip title={tooltip || ""}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<div className="single-stat-card__diff-icon --color-teal">
												<UpIcon fontSize="inherit" />
											</div>
											<div className="single-stat-card__diff-percent-up --color-teal --margin-left-medium">
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
											<div className="single-stat-card__diff-icon --color-dark">
												<StaleIcon fontSize="inherit" />
											</div>
											<div className="dash-card__diff-percent-stale  --margin-left-medium">
												{diff.value} ({diff.percent})
											</div>
										</div>
									</Tooltip>
								</Flex>
							)}
							{diff && diff.percent.charAt(0) === "-" && (
								<Flex className="single-stat-card__diff">
									<Tooltip title={tooltip || ""}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<div className="single-stat-card__diff-icon --color-danger">
												<DownIcon fontSize="inherit" />
											</div>
											<div className="single-stat-card__diff-percent-down --color-danger --margin-left-medium">
												{diff.value} ({diff.percent.slice(1)})
											</div>
										</div>
									</Tooltip>
								</Flex>
							)}
						</Flex>
						<Flex align="center">
							<div
								className={`single-stat-card__dot --bg-color-${color}`}
								style={{ visibility: "hidden", marginRight: 4 }}
							/>
							{value != null && <h3 className={`single-stat-card__value`}>{value || 0}</h3>}
						</Flex>
					</div>
				</div>
			)}
		</div>
	);
};
