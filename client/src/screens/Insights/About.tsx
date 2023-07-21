import React, { FC } from "react";

export const About: FC = () => {
	return (
        <div style={{textAlign:'center', fontSize:'18px'}}>
            <div style={{width:'60%', margin:'auto'}}>
                We have partnered with service providers who offer government backed carbon offsetting programmes. 
                We use an extraction of the <strong>ISO 14064</strong> and <strong>GHG Emissions</strong> Protocol Accounting Standards to calculate the correct level carbon emission. 
                The GHG Protocol refers to a family of greenhouse gas accounting and reporting standards and guidelines. 
                It launched in 2001 with the groundbreaking Corporate Accounting and Reporting Standard. 
                Each is rigorously developed by global multi-stakeholder partnerships of businesses, NGOs, governments and other bodies, convened by the World Resources Institute and the World Business Council for Sustainable Development.
            </div>
            <br />
            <br />
            <div style={{width:'60%', margin:'auto'}}>
                All Projects invested in are Certified to the highest standards, all the carbon offsetting projects that we support are regulated through the Verra - <strong>Verified Carbon Standard (VCS)</strong>, the Gold Standard - <strong>Voluntary Emission Reductions (VER)</strong> and the United Nations - <strong>Certified Emission Reductions (CER)</strong> programmes.  
                As the three largest, and most regulated carbon offsetting standards in the world - this ensures the measurements, and tonnes of CO²e offset are accurate, and verified. 
                We Purchase credits across a diverse range of projects, changing annually, to support as many as we possibley can. 
            </div>
            <br />
            <br />
        </div>
	);
};