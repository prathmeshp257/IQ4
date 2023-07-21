import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const initialState = {
	email: "",
	sitesData: [] as any,
	resetSiteContext: () => {},
    reloadSitesData: () => {},
};

const SiteContext = React.createContext(initialState);

type SiteProviderProps = {
	children: React.ReactNode;
};

const SiteProvider = ({ children }: SiteProviderProps): any => {
	const { userData, loading } = useContext(AuthContext);
	const [sitesData, setSitesData] = useState<any>([]);
	const [email, setEmail] = useState<any>();

	useEffect(() => {
        const getData = async() => {
            setEmail(userData.email);
            const { data } = await axios.get("/api/sites/allSites", {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            const allSites = data.map(({_id, contractStart, contractEnd, contractExpired, capacity, status, apiAccess}: any) => {
                return {id: _id, contractStart, contractEnd, contractExpired, capacity, status, apiAccess};
            })
            setSitesData(allSites);
        }
        getData();
	}, [userData.email]);

	const resetSiteContext = async () => {
        setSitesData([]);
        setEmail("");
	};

    const reloadSitesData = async() => {
        setEmail(userData.email);
        const { data } = await axios.get("/api/sites/allSites", {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
        });
        const allSites = data.map(({_id, contractStart, contractEnd, contractExpired, capacity, status, apiAccess}: any) => {
            return {id: _id, contractStart, contractEnd, contractExpired, capacity, status, apiAccess};
        })
        setSitesData(allSites);
    }

	const value = { email, sitesData, loading, resetSiteContext, reloadSitesData };

	return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

const SiteConsumer = SiteContext.Consumer;

export { SiteProvider, SiteConsumer, SiteContext };
