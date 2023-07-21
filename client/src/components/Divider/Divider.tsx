import React from "react";

export const Divider = ({ light = false }) => {
	return <hr className={`divider-${light ? "light" : "default"}`} />;
};
