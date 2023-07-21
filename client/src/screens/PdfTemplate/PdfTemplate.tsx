import axios from "axios";
import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { Flex } from "../../components";
import { UserContext } from "../../context";
import { ReportGraph } from "../../graphs";
import { ReportData } from "../../types";
import { formatSite, Formatter } from "../../utils";

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'


interface PdfTemplateProps {
	reports?: ReportData;
	repeatTime?: any;
	repeatFrequency?: any;
	dwellByHour?: any;
	dateRange: string;
	download: any;
	setDownload: any;
	fromDate: any;
	toDate: any;
	selectedSite: any;
	chartType: "line" | "bar";
}

const DocumentTemplate: FC<PdfTemplateProps> = ({ dateRange, reports, repeatTime, repeatFrequency, chartType, dwellByHour, setDownload, download, fromDate, toDate, selectedSite }) => {
	const { email } = useContext(UserContext);
	const [pdf, setPdf] = useState<any>();





	const toImage = async (reports: any) => {
	
		const pdfDoc = await PDFDocument.create()
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
		const fontSize = 10;
		let i = 0;
		for (const site of Object.keys(reports)) {

			let visitGraph = document.getElementById(`visitGraph${site}`) as any;
			let occupancyGraph = document.getElementById(`occupancyGraph${site}`) as any;
			let dwellGraph = document.getElementById(`dwellGraph${site}`) as any;
			let repeatGraph = document.getElementById(`repeatGraph${site}`) as any;
			let repeatFrequencyGraph = document.getElementById(`repeatFrequencyGraph${site}`) as any;
			let totalDwellAverageGraph = document.getElementById(`totalDwellAverageGraph${site}`) as any

			let visitGraphURL = visitGraph.toDataURL('image/png');
			let dwellGraphURL = dwellGraph.toDataURL('image/png');
			let occupancyGraphURL = occupancyGraph.toDataURL('image/png');
			let repeatGraphURL = repeatGraph.toDataURL('image/png');
			let repeatFrequencyGraphURL = repeatFrequencyGraph.toDataURL('image/png');
			let totalDwellAverageGraphURL = totalDwellAverageGraph.toDataURL('image/png');


			try {

				const page1 = pdfDoc.addPage();
				const page2 = pdfDoc.addPage();

				
				const defaultPdf = 'https://iq4images.s3.eu-west-1.amazonaws.com/PdfTemplate/default/default.pdf';
				
				const url = pdf ? pdf : defaultPdf;
			
					const { data: pdfFile } = await axios({
						url: url,
						responseType: "arraybuffer",
						headers: {
							"Content-Type": "application/pdf",
							"Access-Control-Allow-Origin": '*'
						}
					});
	
					const [pdfTemplate] = await pdfDoc.embedPdf(pdfFile);
					page1.drawPage(pdfTemplate);
					page2.drawPage(pdfTemplate);
			
				const pages = pdfDoc.getPages()
				const firstPage = pages[i * 2 + 0];
				const secondPage = pages[i * 2 + 1];
				const jpgUrl = visitGraphURL;
				const jpgUrl1 = occupancyGraphURL;

				const jpgUrl2 = dwellGraphURL;
				const jpgUrl3 = repeatGraphURL;
				const jpgUrl4 = repeatFrequencyGraphURL;
				const jpgUrl5 = totalDwellAverageGraphURL;

				const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer())
				const jpgImageBytes1 = await fetch(jpgUrl1).then((res) => res.arrayBuffer())
				const jpgImageBytes2 = await fetch(jpgUrl2).then((res) => res.arrayBuffer())
				const jpgImageBytes3 = await fetch(jpgUrl3).then((res) => res.arrayBuffer())
				const jpgImageBytes4 = await fetch(jpgUrl4).then((res) => res.arrayBuffer())
				const jpgImageBytes5 = await fetch(jpgUrl5).then((res) => res.arrayBuffer())



				const jpgImage = await pdfDoc.embedPng(jpgImageBytes)
				const jpgImage1 = await pdfDoc.embedPng(jpgImageBytes1)
				const jpgImage2 = await pdfDoc.embedPng(jpgImageBytes2)
				const jpgImage3 = await pdfDoc.embedPng(jpgImageBytes3)
				const jpgImage4 = await pdfDoc.embedPng(jpgImageBytes4)
				const jpgImage5 = await pdfDoc.embedPng(jpgImageBytes5)

				const jpgDims = jpgImage.scale(0.5)
				const jpgDims1 = jpgImage1.scale(0.5)
				const jpgDims2 = jpgImage2.scale(0.5)
				const jpgDims3 = jpgImage3.scale(0.5)
				const jpgDims4 = jpgImage4.scale(0.5)
				const jpgDims5 = jpgImage5.scale(0.5)


				firstPage.drawText(`${Formatter.capitalizeSite(formatSite(site, email))}`, {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 400,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})


				firstPage.drawText(`${dateRange}`, {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 380,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})
				firstPage.drawText('Visits', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 360,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})



				firstPage.drawImage(jpgImage, {
					x: firstPage.getWidth() / 2 - jpgDims.width / 2,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 210,
					width: jpgDims.width,
					height: jpgDims.height,
				})

				firstPage.drawText('Occupancy (Average)', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 190,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})

				firstPage.drawImage(jpgImage1, {
					x: firstPage.getWidth() / 2 - jpgDims1.width / 2,
					y: firstPage.getHeight() / 2 - jpgDims1.height / 2 + 40,
					width: jpgDims1.width,
					height: jpgDims1.height,
				})

				firstPage.drawText('Dwell (average)', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 20,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})

				firstPage.drawImage(jpgImage2, {
					x: firstPage.getWidth() / 2 - jpgDims2.width / 2,
					y: firstPage.getHeight() / 2 - jpgDims2.height / 2 - 130,
					width: jpgDims2.width,
					height: jpgDims2.height,
				})

				secondPage.drawText('Repeat Entry Time', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 380,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})


				secondPage.drawImage(jpgImage3, {
					x: secondPage.getWidth() / 2 - jpgDims3.width / 2,
					y: secondPage.getHeight() / 2 - jpgDims3.height / 2 + 210,
					width: jpgDims3.width,
					height: jpgDims3.height,
				})

				secondPage.drawText('Repeat Frequency', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 190,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})

				secondPage.drawImage(jpgImage4, {
					x: secondPage.getWidth() / 2 - jpgDims4.width / 2,
					y: secondPage.getHeight() / 2 - jpgDims4.height / 2 + 40,
					width: jpgDims4.width,
					height: jpgDims4.height,
				})

				secondPage.drawText('Dwell (by hour)', {
					x: 50,
					y: firstPage.getHeight() / 2 - jpgDims.height / 2 + 20,
					size: fontSize,
					font: timesRomanFont,
					color: rgb(0, 0.53, 0.71),
				})

				secondPage.drawImage(jpgImage5, {
					x: secondPage.getWidth() / 2 - jpgDims5.width / 2,
					y: secondPage.getHeight() / 2 - jpgDims5.height / 2 - 130,
					width: jpgDims5.width,
					height: jpgDims5.height,
				})

			} catch (error) {
				console.log("error", error);
			}
			i++;
		}
		const pdfBytes = await pdfDoc.save()
		const docUrl = window.URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
		const link = document.createElement('a');
		link.download = "report.pdf";
		link.href = docUrl;
		link.click();
		setDownload(false)


	}
	useEffect(() => {

		if (download) {
			toImage(reports)
		}

	}, [download])

	useEffect(() => {
		const getPdfTemplate = async (email: string) => {

			const { data } = await axios.get(`/api/users?email=${email}`, {
				headers: {
					authorization: "Bearer " + localStorage.getItem("token"),
				}
			});
			let pdf = data[0] && data[0].pdfTemplate ? data[0].pdfTemplate : ''
			setPdf(pdf);
		};

		try {
			if (email) {
				getPdfTemplate(email);
			}

		} catch { }
	}, [email]);





	return (
		<div>

			<div>
				<div
					style={{
						display: "flex",
						width: "1080px",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center"
					}}
				>
					{reports && (
						<div className="pdf__content">
							{Object.keys(reports).length > 0 &&
								Object.keys(reports).map((site: string) => {
									return (
										<div style={{ marginBottom: 32 }} className="report" key={site}>

											<div >
												<h2 style={{ fontWeight: "bolder" }}>
													{Formatter.capitalizeSite(formatSite(site, email))}
												</h2>
												<h4 style={{ fontWeight: "bold", fontSize: 12 }}>{dateRange}</h4>
											</div>
											<hr />

											<h4 style={{ marginTop: 24, marginBottom: 8 }}>Visits</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`visitGraph${site}`}
													key={site}
													color="blue"
													secondaryColor="yellow"
													label="Unique visits"
													secondaryLabel="Repeat visits"
													type="Visits"
													graphType={chartType}
													stacked
													data={{
														datasets: [
															{
																values:
																	reports[site] &&
																	reports[site]?.map(({ ins, unique }) => String(Math.floor((ins * unique) / 100)))
															},
															{
																values:
																	reports[site] &&
																	reports[site]?.map(({ ins, repeat }) => String(Math.floor((ins * repeat) / 100)))
															}
														],
														labels: reports[site] && reports[site]?.map(({ when }) => when)
													}}
												/>
											</div>
											<h4 style={{ marginTop: 16, marginBottom: 8 }}>Occupancy (average)</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`occupancyGraph${site}`}
													key={site}
													color="green"
													label="Occupancy"
													type="Occupancy"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: reports[site] && reports[site]?.map(({ occupancy }) => String(occupancy))
															}
														],
														labels: reports[site] && reports[site]?.map(({ when }) => when)
													}}
												/>
											</div>
											<h4 style={{ marginTop: 16 }}>Dwell (average)</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`dwellGraph${site}`}
													key={site}
													color="purple"
													label="Dwell"
													type="Dwell"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: reports[site] && reports[site]?.map(({ dwell }) => String(dwell))
															}
														],
														labels: reports[site] && reports[site]?.map(({ when }) => when)
													}}
												/>
											</div>


											<h4 className="graph2" >Repeat Entry Time</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`repeatGraph${site}`}
													key={site}
													color="magenta"
													label="Repeat Count"
													type="Repeat Entry Time"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: repeatTime[site] && Object.values(repeatTime[site])
															}
														],
														labels: repeatTime[site] && Object.keys(repeatTime[site])
													}}
												/>
											</div>
											<h4 style={{ marginTop: 16 }}>Repeat Frequency</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`repeatFrequencyGraph${site}`}
													key={site}
													color="orange"
													label="Repeat Frequency"
													type="Repeat Frequency"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: repeatFrequency[site] && Object.values(repeatFrequency[site])
															}
														],
														labels: repeatFrequency[site] && Object.keys(repeatFrequency[site])
													}}
												/>
											</div>
											<h4 style={{ marginTop: 16 }}>Dwell (by hour)</h4>
											<div style={{ border: "1px solid lightgray" }}>
												<ReportGraph
													id={`totalDwellAverageGraph${site}`}
													key={site}
													color="yellow"
													secondaryColor="magenta"
													tertiaryColor="blue"
													label='Total Dwell(Avg)'
													secondaryLabel="Unique Visits Dwell(Avg)"
													tertiaryLabel="Repeat Visits Dwell(Avg)"
													type="Dwell By Hour"
													graphType={chartType}
													data={{
														datasets: [
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val: any) => val.totalDwell)
															},
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val: any) => val.uniqueDwell)
															},
															{
																values: dwellByHour[site] && Object.values(dwellByHour[site]).map((val: any) => val.repeatDwell)
															}
														],
														labels: dwellByHour[site] && Object.keys(dwellByHour[site])
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
	

		</div>
	);
};

export const PdfTemplate: FC<PdfTemplateProps> = (templateProps) => {
	return (
		<div className="pdf">
			<DocumentTemplate {...templateProps} />
		</div>
	);
};
