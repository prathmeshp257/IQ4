import React, { FC } from "react";
import Image1 from '../../assets/images/Project2Image1.png';
import { isMobile } from "react-device-detect";

export const Project2: FC = () => {
	return (
        <div style={{textAlign:'center', fontSize:'18px', marginBottom:'50px', overflow:'hidden'}}>
            <h1>Marston Vale Forest Creation - England</h1>
            <h3>
                Certification: UK Woodland Carbon Code
                <br/>
                Serial: WCC ID 103000000000749
            </h3>
            <img style={{width: '50%', height: `${(window.innerHeight * 50)/100}px`, margin:'auto'}} src={Image1} alt='Reforestation' />
            <div style={{margin:'20px 50px 50px'}}>
                The Forest of Marston Vale is a Community Forest and a Charity, planting trees and using woodlands to make life better for the people and wildlife in the 61 square mile area of the Marston Vale, between Bedford and Milton Keynes.​
                The Charity has planted over 2 million trees to transform the landscape and improve the prospects of the Marston Vale, because trees make life better – for people, for wildlife and for the planet. They help to cool and clean our air, lock up carbon, reduce flooding, provide sustainable raw materials, and are our best hope in combatting the climate crisis. The Charity’s ultimate goal is 30% tree cover across the Forest and that means planting another 5 million trees.​
                The Forest of Marston Vale also support the Woodland Carbon Code scheme, with a number of WCUs and PIUs held as charitable assets. ​
            </div>
            Our climate is in crisis - you can make a difference | The Forest of Marston Vale​
            <div style={{width:isMobile ? '80%' : '60%', height: `${(window.innerHeight * 50)/100}px`, margin:'20px auto'}}>
                <iframe 
                    style={{height:'100%', width:'100%'}}
                    src='https://www.youtube.com/embed/57x0hgF5Zv8'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                />
            </div>
            For more information please contact your administrator
        </div>
	);
};