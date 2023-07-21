import React, { FC } from "react";
import { isMobile } from "react-device-detect";
import { Flex } from "../Flex";

interface TabProps {
	id?: string;
	label?: string;
	active?: boolean;
	disabled?: boolean;
	beforeSlot?: JSX.Element;
	afterSlot?: JSX.Element;
	color?: "light" | "dark" | "yellow" | "blue" | "green" | "purple";
	variant?: "default" | "compact";
	onClick?: () => void;
	style?: React.CSSProperties;
}

export const Tab: FC<TabProps> = ({
	id,
	label,
	active,
	disabled = false,
	beforeSlot,
	afterSlot,
	variant = "default",
	color,
	onClick,
	style
}) => {
	return (
		<Flex align="center" justify="center" className="tab" style={{...style, margin:'5px'}}>
			<button
				id={id}
				className={`tab__link--${variant} ${color ? `tab__link--color-${color}` : ""} ${active ? `--active` : ""} ${
					disabled ? "--disabled" : ""
				}`}
				disabled={disabled}
				onClick={onClick}
			>
				{beforeSlot && (
					<Flex style={{ margin: "auto", marginRight: label ? (isMobile ? "auto" : 4) : 0 }}>{beforeSlot}</Flex>
				)}
				<p className="--no-margin">{label}</p>
				{afterSlot && <Flex style={{ margin: "auto", marginLeft: label ? 4 : 0 }}>{afterSlot}</Flex>}
			</button>
		</Flex>
	);
};
