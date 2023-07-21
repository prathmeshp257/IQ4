import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { Flex } from "../../components";
import { UserContext } from "../../context";
import { VehiclesGraph, TwoYAxisGraph } from "../../graphs";
import { VehicleData, ValuationsData, EmissionsData } from "../../types";
import { formatSite, Formatter, sortBy } from "../../utils";
import dayjs from "dayjs";

interface PdfTemplateProps {
	make?:any;
	model?:any;
	fuel?:any;
	age?:any;
	co2?:any;
	color?: any;
	vehicles?: VehicleData;
	dateRange: string;
	chartType: "line" | "bar";
	originalSampleSize?: any;
	valuations: ValuationsData;
	evVisits: any;
	evRepeatVisits: any;
	evDwellAverage: any;
	evDwellByHour: any;
	emissions: EmissionsData;
	typeApproval?: any;
	selectedRange: string | null;
	selectedMake: string | null;
	emissionTabData: any;
}

const DocumentTemplate: FC<PdfTemplateProps> = ({ make, model, fuel, age, co2, color, dateRange, vehicles, chartType, valuations, evVisits, evRepeatVisits, evDwellAverage, evDwellByHour, emissions, selectedRange, selectedMake, emissionTabData, typeApproval }) => {
	const { email } = useContext(UserContext);
	const [pdfOptions, setPdfOptions] = useState<any>();

	useEffect(() => {
		const getPdfTemplate = async (email: string) => {
			const { data } = await axios.get(`/api/retailers?email=${email}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setPdfOptions(data);
		};

		try {
			getPdfTemplate(email);
		} catch {}
	}, [email]);

	const logoSrc = pdfOptions ? `data:image/png;base64,${pdfOptions.headerLogo}` : "data:image/png;base64";
	const footerSrc = pdfOptions ? `data:image/png;base64,${pdfOptions.footerImg}` : "data:image/png;base64";

	return (
		<div>
			<div className="pdf__header">
				<div className="pdf__header__left" />
				<div className="pdf__header__right">
					{pdfOptions && pdfOptions.headerLogo && <img src={logoSrc} alt="" height={50} style={{marginRight:'15px'}} />}
				</div>
			</div>

			<div className="pdf__overlay">
				{pdfOptions && pdfOptions.headerLogo && <img src={logoSrc} alt="" height={180} />}
			</div>

			<div>
				<div
					style={{
						display: "flex",
						width: "100%",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center"
					}}
				>
					{make && (
						<div className="pdf__content">
							{Object.keys(make).length > 0 &&
								Object.keys(make).map((site: string) => {
									return (
										<div style={{ marginBottom: 32 }} className="report" key={site}>
											<div style={{ height: 120 }} />
											<Flex direction="row" align="center" justify="space-between" className="pdf__title">
												<h2 style={{ fontWeight: "bold", marginRight: 8 }}>
													{Formatter.capitalizeSite(formatSite(site, email))}
												</h2>
												<h4 style={{ fontWeight: "bold", fontSize: 12 }}>{dateRange}</h4>
											</Flex>
											<hr />
											<h4 style={{ marginTop: 24, marginBottom: 8 }}>Make</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="magenta"
													label="Visits"
													labelAxisX="Visits"
													type="Make"
													height={140}
													data={{
														datasets: [
															{
																values: make[site] && make[site].make && Object.keys(make[site].make).length > 0 ? make[site].make
																			.slice(0, 20)
																			.sort(sortBy("total", 1))
																			.map(({ total } : any) => String(total)) 
																		: []
															}
														],
														labels: make[site] && make[site].make && Object.keys(make[site].make).length > 0 ? make[site].make
																	.slice(0, 20)
																	.sort(sortBy("total", 1))
																	.map(({ name } : any) => Formatter.capitalize(name))
																: []
													}}
												/>
											</div>
											<h4 className="graph" >Model</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px'}}>
												<VehiclesGraph
													key={site}
													color="purple"
													label="Visits"
													labelAxisX="Visits"
													type="Model"
													height={140}
													data={{
														datasets: [
															{
																values: model[site] && model[site].model && Object.keys(model[site].model).length > 0 ? model[site].model
																			.slice(0, 20)
																			.sort(sortBy("total", 1))
																			.map(({ total } : any) => String(total))
																		: []
															}
														],
														labels: model[site] && model[site].model && Object.keys(model[site].model).length > 0 ? model[site].model
																	.slice(0, 20)
																	.sort(sortBy("total", 1))
																	.map(({ name } : any) => Formatter.capitalize(name))
																: []
													}}
												/>
											</div>
											<h4 className="graph2" >Colour</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px'}}>
												<VehiclesGraph
													key={site}
													color="green"
													label="Visits"
													labelAxisX="Visits"
													isHorizontal={false}
													type="Color"
													height={150}
													data={{
														datasets: [
															{
																values: color[site] && color[site].colorType && Object.keys(color[site].colorType).length > 0 ? color[site].colorType
																			.slice(0, 20)
																			.sort(sortBy("total", 1))
																			.map(({ total } : any) => String(total))
																		: []
															}
														],
														labels: color[site] && color[site].colorType && Object.keys(color[site].colorType).length > 0 ? color[site].colorType
																	.slice(0, 20)
																	.sort(sortBy("total", 1))
																	.map(({ name } : any) => Formatter.capitalize(name))
																: []
													}}
												/>
											</div>
											<h4 className="graph" >Age</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<TwoYAxisGraph
													height={150}
													leftTitle="Visits"
													rightTitle="Emissions"
													data={{
														datasets: [
															{
																values: age[site] && age[site].age && Object.keys(age[site].age).length > 0 ? age[site].age.map(({ total } : any) => String(total)) : [],
																label: "Total Visits",
																yAxisID: "left",
																color:"yellow"
															},
															{
																values: age[site] && age[site].age && Object.keys(age[site].age).length > 0 ? age[site].age.map(({ emissions } : any) => String(emissions)) : [],
																label: "CO2 Emissions(Average)",
																yAxisID: "right",
																color:"purple"
															}
														],
														labels: age[site] && age[site].age && Object.keys(age[site].age).length > 0 ? age[site].age.map(({ ageGap } : any) => String(ageGap).replace(" yrs", "")) : []
													}}
												/>
											</div>
											<h4 className="graph2" >Fuel</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
													<VehiclesGraph
														key={site}
														color="blue"
														label="Vehicles"
														type="Fuel"
														height={150}
														labelAxisX="Fuel type"
														isHorizontal={false}
														data={{
															datasets: [
																{
																	label: "Visits",
																	values: fuel[site] && fuel[site].fuel && Object.keys(fuel[site].fuel).length > 0 ? fuel[site].fuel.map(({ total } : any ) => String(total)) : []
																},
																{
																	values: fuel[site] && fuel[site].fuel && Object.keys(fuel[site].fuel).length > 0 ? fuel[site].fuel.map(({ emissions } : any) => String(emissions)) : [],
																	label: "CO₂ Emissions (average)"
																}
															],
															labels: fuel[site] && fuel[site].fuel && Object.keys(fuel[site].fuel).length > 0 ? fuel[site].fuel.map(({ fuel } : any) => Formatter.capitalize(fuel)) : []
														}}
													/>
											</div>
											<h4 className="graph" >CO2</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px'}}>
												<TwoYAxisGraph
													height={150}
													leftTitle="CO₂ Emissions (average)"
													rightTitle='Visits'
													data={{
														datasets: [
															{
																values: co2 && co2[site] && co2[site].co2 ? co2[site].co2.map(({ emissionsAverage } : any ) => String(emissionsAverage)) : [],
																label: "CO₂ Emissions (average)",
																yAxisID: "left",
																color: "yellow"
															},
															{
																values: co2 && co2[site] && co2[site].co2 ? co2[site].co2.map(({ vehicles } : any ) => String(vehicles)) : [],
																label: "Visits",
																yAxisID: "right",
																color: "purple"
															},
														],
														labels: co2 && co2[site] && co2[site].co2 ? co2[site].co2.map(({ when } : any ) => dayjs(when).format("DD MMM")) : []
													}}
												/>
											</div>
											<h4 className="graph2" >Emissions</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<VehiclesGraph
													color="green"
													key={site}
													label="Vehicles"
													type="Emissions"
													// maxAxisY={originalSampleSize && originalSampleSize[site]}
													height={150}
													isHorizontal={true}
													labelAxisY={"CO₂ emissions"}
													labelAxisX={"Vehicles"}
													labelSpacingAxisY={100}
													data={ emissionTabData }
												/>
											</div>
											<h4 className="graph" >Valuations</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<TwoYAxisGraph
													height={150}
													leftTitle="Maximum"
													rightTitle='Minimum And Average'
													data={{
														datasets: [
															{
																values:valuations[site] ? Object.values(valuations[site]).map((value) => value.maxPrice) : [],
																label: "Valuations (max)",
																yAxisID: "left",
																color:"yellow"
															},
															{
																values:valuations[site] ? Object.values(valuations[site]).map((value) => value.minPrice) : [],
																label: "Valuations (min)",
																yAxisID: "right",
																color:"purple"
															},
															{
																values:valuations[site] ? Object.values(valuations[site]).map((value) => value.averagePrice) : [],
																label: "Valuations (average)",
																yAxisID: "right",
																color:"magenta"
															}
														],
														labels: valuations[site] ? Object.keys(valuations[site]).map((date) => dayjs(date).format("DD MMM")) : []
													}}
												/>
											</div>
											<h4 className="graph2" >EV - Visits</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="blue"
													label="Visits"
													type="EV-Total Visits"
													height={150}
													labelAxisX="Date"
													isHorizontal={false}
													data={{
														datasets: evVisits[site] ? evVisits[site].datasets : [],
														labels: evVisits[site] ? evVisits[site].labels : [],
													}}
												/>
											</div>
											<h4 className="graph" >EV - Repeat Visits</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="green"
													label="Repeat Frequency"
													labelAxisY="Time"
													type="EV-Repeat Visits"
													height={150}
													isHorizontal={false}
													data={{
														datasets: evRepeatVisits[site] ? evRepeatVisits[site].datasets : [],
														labels: evRepeatVisits[site] ? evRepeatVisits[site].labels : [],
													}}
												/>
											</div>
											<h4 className="graph2" >EV - Dwell</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="green"
													label="Dwell(average)"
													labelAxisY="Date"
													type="EV-Average Dwell Time"
													height={150}
													isHorizontal={false}
													data={{
														datasets: evDwellAverage[site] ? evDwellAverage[site].datasets : [],
														labels: evDwellAverage[site] ? evDwellAverage[site].labels : [],
													}}
												/>
											</div>
											<h4 className="graph" >EV - Dwell By Hour</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="yellow"
													label="Dwell(average)"
													type="EV-Dwell Time By Hour"
													labelAxisX="Time"
													height={150}
													isHorizontal={false}
													data={{
														datasets: evDwellByHour[site] ? evDwellByHour[site].datasets : [],
														labels: evDwellByHour[site] ? evDwellByHour[site].labels : [],
													}}
												/>
											</div>
											<h4 className="graph2" >Vehicle Type</h4>
											<div style={{ border: "1px solid lightgray", paddingRight:'70px' }}>
												<VehiclesGraph
													key={site}
													color="blue"
													label="Vehicle Type"
													type="Vehicle Type"
													labelAxisX="Time"
													height={150}
													isHorizontal={false}
													data={{
														datasets: typeApproval[site] ? typeApproval[site].datasets : [],
														labels: typeApproval[site] ? typeApproval[site].labels : [],
													}}
												/>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</div>
			</div>
			<div className="pdf__footer"  style={{marginTop:'20px'}}>
				{pdfOptions && pdfOptions.footerImg && <img src={footerSrc} alt="footer" height={150} />}
			</div>
		</div>
	);
};

export const InsightPdfTemplate: FC<PdfTemplateProps> = (templateProps) => {
	return (
		<div className="pdf">
			<DocumentTemplate {...templateProps} />
		</div>
	);
};
