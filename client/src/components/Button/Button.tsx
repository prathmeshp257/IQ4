import { CircularProgress } from "@material-ui/core";
import React, { FC } from "react";

import { Flex } from "../Flex";

interface ButtonProps {
	text: string;
	onClick?: () => void;
	loading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	variant?: "filled" | "outline";
	fullWidth?: boolean;
	color?: string;
	className?: string;
	icon?: JSX.Element;
	iconPosition?: "before" | "after";
	buttonStyle?: React.CSSProperties;
	textStyle?: React.CSSProperties;
	iconStyle?: React.CSSProperties;
	forwardRef?: any;
}

export const Button: FC<ButtonProps> = ({
	forwardRef,
	text,
	onClick,
	loading,
	disabled = false,
	type,
	variant,
	fullWidth,
	color,
	icon,
	className = "",
	iconPosition,
	buttonStyle,
	textStyle,
	iconStyle
}) => {
	return (
		<button
			ref={forwardRef}
			className={`button button--${variant} ${fullWidth ? "button--full-width" : ""} ${className}`}
			type={type}
			disabled={loading || disabled}
			onClick={onClick}
			color={color}
			style={{ background: disabled ? "#676767" : color, cursor: disabled ? "not-allowed" : "pointer", ...buttonStyle }}
		>
			{loading && <CircularProgress color="inherit" size={20} />}
			{!loading && (
				<Flex>
					{icon && iconPosition === "before" && (
						<div className="button__icon" style={{ fontSize: 20, marginRight: 4, ...iconStyle }}>
							{React.cloneElement(icon, { fontSize: "inherit" })}
						</div>
					)}
					<p className="button__text" style={textStyle}>
						{text}
					</p>
					{icon && iconPosition === "after" && (
						<div className="button__icon" style={{ fontSize: 20, marginLeft: 4, ...iconStyle }}>
							{React.cloneElement(icon, { fontSize: "inherit" })}
						</div>
					)}
				</Flex>
			)}
		</button>
	);
};

Button.defaultProps = {
	iconPosition: "before",
	variant: "filled",
	fullWidth: false,
	loading: false,
	type: "button"
};
