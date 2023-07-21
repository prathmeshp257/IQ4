import React, { useContext, useState } from "react"
import { FC } from "react"
import { CardWithTabs } from "../../components"
import { IqVisionBeta } from "./IqVisionBeta";
import { Shell } from "../../containers";



export const IqVision: FC = () => {
	const [activeLabel, setActiveLabel] = useState<string>("IQ Vision");
	
    return(
        <Shell
		title="IQ Vision"
		subtitle=""
        >
        <CardWithTabs
          style={{height:'100%',marginTop:""}}
          key={activeLabel}
          activeLabel={activeLabel || "IqVision"}
          title={activeLabel}
          onItemClick={({label}) => setActiveLabel(label)}
          tabColor="dark"
          isOpen
          items={[
          {
            label: "IQ Vision",
            value: "IqVision",
            content: (
                <>
                    <IqVisionBeta />
                </>
            )
          }
        ]}
        />
        </Shell>
    )
    }