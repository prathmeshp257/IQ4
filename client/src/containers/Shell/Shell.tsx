import { LinearProgress, LinearProgressProps } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import React, { FC, useContext, useEffect, useState } from "react";
import { Flex } from "../../components";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { colors } from "../../utils/constants";

const theme = createMuiTheme({ palette: { primary: { main: colors.purpleDark } } });

type BadgeVariants =
	| "gray"
	| "danger"
	| "magenta"
	| "warning"
	| "orange"
	| "success"
	| "teal"
	| "blue"
	| "purple"
	| "white";
interface ShellProps {
	title: string;
	subtitle: string;
	endSlot?: JSX.Element;
	loading?: boolean;
	error?: boolean;
	badge?: {
		text: string;
		variant?: BadgeVariants;
	};
	children?: JSX.Element | any;
}

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

export const Shell: FC<ShellProps> = ({ title, subtitle, endSlot, loading, error, badge, children }) => {
	const [progress, setProgress] = useState(10);

    useEffect(() => {
		const timer = setInterval(() => {
		  setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
		}, 1500);
		return () => {
		  clearInterval(timer);
		};
	}, []);

	return (
		<div className="shell">
			<div className="shell__center">
				<div className="shell__heading">
					<div className="shell__heading-left-group">
						<Flex align="center" className="--margin-bottom-small">
							<h1 className="shell__heading-title">{title}</h1>
							{badge && badge.text && (
								<div className={`shell__heading-badge --bg-color-${badge.variant || "gray"}`}>{badge.text}</div>
							)}
						</Flex>
						<h4 className="shell__heading-subtitle">{subtitle}</h4>
					</div>
					<div className="shell__heading-end-slot">{endSlot}</div>
				</div>
				{loading && (
					<div className="shell__loader">
						<MuiThemeProvider theme={theme}>
							<LinearProgressWithLabel className="shell__loading-bar" color="primary" value={progress}/>
						</MuiThemeProvider>
					</div>
				)}
				{!loading && !error && children}
			</div>
		</div>
	);
};
