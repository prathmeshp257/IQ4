import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { PATHS } from "../../constants";
import { Flex } from "../Flex";

export const Footer: FC = () => {
	const history = useHistory();

	return (
		<div className="footer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Flex justify="center" className="footer__container" align="center" onClick={() => history.push(PATHS.LIVE)}>
				<h4 style={{ color: "#eee", margin: 0, marginRight: 4, fontSize: 10 }}>Powered by iQ⁴</h4>
			</Flex>
		</div>
	);
};
