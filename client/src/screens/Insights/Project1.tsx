import React, { FC } from "react";
import Image1 from '../../assets/images/Project1Image1.png';
import Image2 from '../../assets/images/Project1Image2.png';

export const Project1: FC = () => {
	return (
        <div style={{textAlign:'center', fontSize:'18px'}}>
            <h1>South West Australia Reforestation – Australia</h1>
            <h3>
                Certification:  Gold Standard Voluntary Emission Reductions (VER)​
                <br/>
                Serial no: Gold Standard ID 3039​
            </h3>
            <br/>
            <img style={{width: '50%', height: `${(window.innerHeight * 50)/100}px`}} src={Image1} alt='Reforestation' />
            <div style={{margin:'20px 50px'}}>
                Conservation International, a world authority on biodiversity conservation, identified Southwest Australia as one of only 35 globally significant biodiversity hotspots. These are regions that have an exceptionally high number of plant and animal species found nowhere else in the world, account for 90% of all species on earth and cover only 2.3% of the earth’s surface. It is therefore imperative that these ‘megadiverse’ areas be protected to ensure their survival and restoration. The Yarra Yarra Biodiversity Corridor Gold Standard project is located in this global biodiversity hotspot.​
                It is a multi-species native reforestation project grown on degraded, semi-arid agricultural land that no longer supports viable farming practices. In a region where over 90% of the land has already been cleared, this project is helping to return the environment to its origins, planting up to 40 native tree and shrub species which are matched to the environment.​ 
            </div>
            <img style={{width: '50%', height: `${(window.innerHeight * 50)/100}px`}} src={Image2} alt='Australia Map' />
            <div style={{margin:'20px 50px'}}>
                This project aims to recreate a healthy, functioning landscape, restored after decades of habitat loss and degradation. This will become the new bush that helps connect to the Australian Outback.​
                It is a legacy landscape – one in which our actions now will ensure this landscape will be left in a much-improved condition than we received it. This will be our gift to future generations and to the planet.​
                This reforestation project is encouraging native animals and plants that have vanished or been pushed to the brink of extinction in the region to return and breed, such as Malleefowl, Bush Stone-curlew, Carnaby’s Cockatoo, Western Spiny-tailed Skink and the Woylie (Brush-tailed Bettong), as well as over 30 species of conservation-significant native plants.​
                <br/><br/>
                Contact your administrator for more information ​
            </div>
        </div>
	);
};