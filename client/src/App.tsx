import "antd/dist/antd.css";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./assets/css/index.scss";
import { Page } from "./containers";
import ProtectedRoute from "./containers/ProtectedRoute/ProtectedRoute";
import { MainProvider } from "./context";
import { Dashboard, EditUser, Live, Login, ReportsHome, InsightsHome, Users, SystemHealthHome, IqStats, VRMCorrection, VOI,EditVRM } from "./screens";
import { IqVision } from "./screens/IqVision";

const App = () => {
	return (
		<MainProvider>
			<BrowserRouter>
				<Switch>
					<Route path="/login" exact component={Login} />
					<Route path="/adminaccess" exact component={Login} />
					<Page>
						<ProtectedRoute path="/" exact component={Live} />
						<ProtectedRoute path="/vrmcorrectionmanual" exact component={EditVRM}/>
						<ProtectedRoute path="/dashboard" exact component={Dashboard} />
						<ProtectedRoute path="/insights" exact component={InsightsHome} />
						<ProtectedRoute path="/reports" exact component={ReportsHome} />
						<ProtectedRoute path="/settings/users/edit" exact component={EditUser} />
						<ProtectedRoute path="/users" exact component={Users} />
						<ProtectedRoute path="/systemHealth" exact component={SystemHealthHome} />
						<ProtectedRoute path="/iqStats" exact component={IqStats} />
						<ProtectedRoute path="/vrmCorrection" exact component={VRMCorrection} />
						<ProtectedRoute path="/voi" exact component={VOI} />
						<ProtectedRoute path="/iqVision" exact component={IqVision}/>
					</Page>
				</Switch>
			</BrowserRouter>
		</MainProvider>
	);
};

export default App;
