import React, { useContext, useEffect, useState } from "react";
import { LinearProgress, LinearProgressProps } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { colors } from "../../utils/constants";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const theme = createMuiTheme({ palette: { primary: { main: colors.purpleDark } } });

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
const ProgressBar = () => {
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
        <div className="shell__loader">
            <MuiThemeProvider theme={theme}>
                <LinearProgressWithLabel className="shell__loading-bar" color="primary" value={progress}/>
            </MuiThemeProvider>
        </div>
    );
};

export default ProgressBar;