import { FC, useState } from "react"
import { Calc } from "./P&DCal"
import { CardWithTabs } from "../../components"
import { SelectedTariffTypes } from "./selectedTariffTypes";
import { Revenue } from "./Revenue";
import { Overstays } from "./Overstays";

export const MainCal : FC = () =>{
	const [activeLabel, setActiveLabel] = useState<string>(" ");
    
    const items = [
        {
            label: " Overstays ",
            value: " Overstays ",
            content: (
                <>
                    <Overstays  />
                </>
            )
        },
        {
            label: " Revenue ",
            value: " Revenue ",
            content: (
                <>
                    <Revenue  />
                </>
            )
        },
        {
            label: " Tariff Types ",
            value: " Tariff Types ",
            content: (
                <>
                    <SelectedTariffTypes  />
                </>
            )
        },
        {
		    label: "Add Tariff Type ",
		    value: "Add Tariff Type",
		    content: (
			    <>
				    <Calc  />
			    </>
		)
	}]
    return(
        <>
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={items}
        />
        </>
    )
}