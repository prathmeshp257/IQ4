import React from "react";
import { Flex } from "../Flex";

interface DashCardProps {
  title: string;
  value: string | number | undefined;
  type?: string;
  titleColor: string;
  onClick?: ()=>any
}

export const DashCardRevenue: React.FC<DashCardProps> = ({
    title,
    value,
    type,
    titleColor = "teal",
    onClick
  }) => {
    
    return (
      <div className="dash-card" onClick={onClick} style={{width:"180px" ,paddingLeft:10,paddingRight:20,paddingTop:10,paddingBottom:10 }}>
				<Flex direction="column" justify="space-between">
        <div>
        <h4 className={`dash-card__title --color-${titleColor} --no-margin`}>
          {title}
        </h4>
        </div>
        <div className="dash-card__content">
          <h2 className="dash-card__value --no-margin">{value || 0}</h2>
        </div>
        </Flex>

      </div>
    );
  };