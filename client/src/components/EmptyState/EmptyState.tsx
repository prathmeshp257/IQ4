import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../../utils/constants";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	background: ${colors.white};
	border: 1px solid ${colors.lightGray};
	padding: 16px;
	height: 211px;
	justify-content: center;
	text-align: center;
	align-items: center;
	border-radius: 10px;
`;

const Title = styled.h2`
	color: ${colors.dark};
	margin: 16px 0 16px 0;
`;

const Subtitle = styled.h4`
	margin: 0;
	font-weight: 400;
	font-size: 14px;
	color: ${colors.darkGray};
`;

interface EmptyStateProps {
	title: string;
	subtitle: string;
	icon: JSX.Element;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, subtitle, icon }) => {
	return (
		<Container>
			{icon}
			<Title>{title}</Title>
			<Subtitle>{subtitle}</Subtitle>
		</Container>
	);
};
