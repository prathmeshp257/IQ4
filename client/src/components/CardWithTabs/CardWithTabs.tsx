import { createMuiTheme, LinearProgress, LinearProgressProps, MuiThemeProvider } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { colors } from "../../utils";
import { Divider } from "../Divider";
import { Flex } from "../Flex";
import { Tab } from "../Tab";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const theme = createMuiTheme({
	palette: { primary: { main: colors.purpleDark } }
});

interface ActionTab {
	label: string;
	value: string;
	onClick?: () => void;
	content?: JSX.Element;
	disabled?: boolean;
	afterSlot?: JSX.Element;
}

type ActionTabColor = "light" | "dark" | "yellow" | "blue" | "green" | "purple";

interface CardWithTabsProps {
	title: string | JSX.Element;
	htmlElement?: string | JSX.Element;
	activeLabel?: string;
	loading?: boolean;
	height?: number;
	mHeight?: number;
	snippet?: JSX.Element | boolean;
	tabColor?: ActionTabColor;
	onItemClick?: ({ label }: { label: string }) => void;
	items: ActionTab[];
	mainContent?: JSX.Element;
	isOpen?: boolean;
	reverseActionBar?: boolean;
	hideOnLoading?: boolean;
	style?: React.CSSProperties;
}

interface ActionBarProps {
	items: ActionTab[];
	activeLabel?: string;
	tabColor?: ActionTabColor;
	style?: React.CSSProperties;
	onItemClick?: ({ label }: { label: string }) => void;
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

const ActionBar: FC<ActionBarProps> = ({ items, activeLabel, tabColor, onItemClick, style }) => {
	return (
		<div className="card-with-tabs__tabs" style={{...style}}>
			{items.map(({ label, value, onClick, disabled, afterSlot }) => {
				const normalizedLabel = value.replace(/\s/g, "").toLowerCase();
				const normalizedActiveLabel = activeLabel?.replace(/\s/g, "").toLowerCase();

				return (
					<Tab
						key={label}
						label={label}
						active={normalizedLabel === normalizedActiveLabel}
						variant="compact"
						disabled={disabled}
						color={tabColor}
						afterSlot={afterSlot ? afterSlot : undefined}
						onClick={() => {
							onClick?.();
							onItemClick?.({ label: value });
						}}
					/>
				);
			})}
		</div>
	);
};

const Spinner: FC<{ loading: boolean }> = ({ loading }) => {

	const [progress, setProgress] = useState(10);

    useEffect(() => {
		const timer = setInterval(() => {
		  setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
		}, 800);
		return () => {
		  clearInterval(timer);
		};
	}, []);

	return (
		<div className="card-with-tabs__spinner" style={{ display: loading ? "block" : "none" }}>
			<div className="shell__loader">
				<MuiThemeProvider theme={theme}>
					<LinearProgressWithLabel className="shell__loading-bar" color="primary" value={progress}/>
				</MuiThemeProvider>
			</div>
			<div style={{ paddingBottom: 0 }} />
		</div>
	);
};

export const CardWithTabs: FC<CardWithTabsProps> = ({
	title,
	htmlElement,
	activeLabel,
	items,
	tabColor = "light",
	onItemClick,
	height,
	mHeight,
	loading = false,
	hideOnLoading = false,
	reverseActionBar = false,
	snippet,
	mainContent,
	isOpen = true,
	style
}) => {
	const [showContent, setShowContent] = useState(isOpen);
	const [content, setContent] = useState<JSX.Element | undefined>();

	useEffect(() => {
		setShowContent(isOpen);
	}, [isOpen]);

	useEffect(() => {
		const c = items?.find(({ value }) => {
			const normalizedLabel = value.replace(/\s/g, "").toLowerCase();
			const normalizedActiveLabel = activeLabel?.replace(/\s/g, "").toLowerCase();
			return normalizedLabel === normalizedActiveLabel;
		})?.content;

		setContent(c);
	}, [items, activeLabel]);

	return (
		<div
			style={style ? style : {height: isMobile ? mHeight || 520 : height || 520 }}
			className={`card-with-tabs ${showContent ? "--open" : "--close"}`}
		>
			
			<Flex justify="space-between" wrap="wrap" align="center">
			
				<h2 className={`card-with-tabs__title-${showContent ? "nowrap" : "wrap"}`}>{title}</h2>
				{htmlElement && <div style={{display:'flex',justifyContent:'end'}}>{htmlElement}</div>}
			
				<Flex justify="space-between" wrap="wrap-reverse">
					<div className={`card-with-tabs__snippet ${!showContent ? "" : "--hidden"}`}>{snippet}</div>
					{!reverseActionBar && (
						<ActionBar items={items} tabColor={tabColor} onItemClick={onItemClick} activeLabel={activeLabel} />
					)}
				</Flex>
			</Flex>
			{showContent && <Divider light />}
			{!reverseActionBar && <Spinner loading={loading} />}
			{showContent && (!loading || !hideOnLoading) && <div className="card-with-tabs__content">{content}</div>}
			{showContent && mainContent && (!loading || !hideOnLoading) && (
				<div className="card-with-tabs__content">{mainContent}</div>
			)}
			{showContent && reverseActionBar && <Divider light />}
			{reverseActionBar && <Spinner loading={loading} />}
			{reverseActionBar && (
				<ActionBar
					style={{ maxWidth: isMobile ? "100%" : "60%", marginRight: "auto" }}
					items={items}
					tabColor={tabColor}
					onItemClick={onItemClick}
					activeLabel={activeLabel}
				/>
			)}
		</div>
	);
};
