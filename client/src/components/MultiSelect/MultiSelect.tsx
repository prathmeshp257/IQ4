import SearchIcon from "@material-ui/icons/Search";
import { Checkbox, Dropdown } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useClickOutside } from "../../hooks";
import { formatSite } from "../../utils";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { Flex } from "../Flex";

interface MultiSelectProps {
	options: {
		value: string | null;
		label: string | null;
	}[];
	type?:any;
	values?: string[] | any[] | null;
	place?:string;
	className?: string;
	placeholder?: string;
	allPlaceholder?: string;
	multiplePlaceholder?: string;
	dropDownIconStyle?: React.CSSProperties;
	multi?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	style?: React.CSSProperties;
	placement?: "bottomCenter" | "bottomLeft" | "bottomRight" | "topCenter" | "topLeft" | "topRight";
	onChange: (values: string[]) => void;
}

export const MultiSelect: FC<MultiSelectProps> = ({
	options,
	values,
	placement,
	onChange,
	className,
	dropDownIconStyle,
	placeholder = "Please select the car parks",
	allPlaceholder = "All car parks selected",
	multiplePlaceholder = "car parks selected",
	multi = true,
	fullWidth = false,
	disabled = false,
	style,
	place = "normal",
	type
}) => {
	const [selectedOptions, setSelectedOptions] = useState(values || []);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectAllChecked, setSelectAllChecked] = useState(
		values?.length === options.length && values.length !== 0 && values[0] !== ""
	);
	const [searchText,setSearchText] =  useState('');
	const { ref: dropdownRef, isClickOutside, resetIsClickOutside } = useClickOutside();

	const { email } = useContext(UserContext);

	const handleMultiSelect = (option: string | null) => {
		setSelectAllChecked(false);
		if (multi === false) {
			if (selectedOptions[0] === option) {
				setSelectedOptions([]);
				return;
			}

			setSelectedOptions([option]);
			return;
		}
		if (selectedOptions.includes(option)) {
			const updatedValues = selectedOptions.filter((value: string) => value !== option);
			setSelectedOptions(updatedValues);
		} else {
			if (selectedOptions[0] === "" || selectedOptions.length === 0) {
				const updatedValues = [option];
				setSelectedOptions(updatedValues);
			} else {
				const updatedValues = [...selectedOptions, option];
				setSelectedOptions(updatedValues);
			}
		}
	};

	const toggleSelectedAll = () => {
		setSelectAllChecked(!selectAllChecked);
		if (!selectAllChecked) {
			setSelectedOptions(options.map((option) => option.value));
		} else {
			setSelectedOptions([]);
		}
	};

	const filterdSite = options.filter((value)=>{
		if(searchText === ""){
			return value
		}else if(value.label?.toLowerCase().includes(searchText.toLowerCase())){
			return value
		}
		
	})


	useEffect(() => {
		if (values?.length === options.length) {
			setSelectedOptions(options.map(({ value }) => value));
		}
		if(values && values.length < 1){
			setSelectedOptions([]);
		}
		if(values && values.length >= 1){
			setSelectedOptions([...values])
		}
	}, [dropdownOpen, options, values]);

	useEffect(() => {
		if (isClickOutside) {
			setDropdownOpen(false);
			setSearchText('');
			resetIsClickOutside();
		}
	}, [dropdownOpen, isClickOutside, resetIsClickOutside]);


	const dropdownText =
		selectedOptions.length > 0
			? selectedOptions.length === options.length
				? multi
					? allPlaceholder
					: options.filter(val => val.value === selectedOptions[0])[0]?.label
				: selectedOptions.length > 1
				? selectedOptions.sort()[0] + ` and ${selectedOptions.length - 1} more`
				: options.filter(val => val.value === selectedOptions.sort()[0])[0]?.label
			: placeholder;

	return (
		
		
		<Dropdown
		    overlayStyle={{zIndex:100000}}
			forceRender
			className={`multi-select ${className}`}
			visible={dropdownOpen}
			placement={placement || "bottomCenter" }
			overlay={
				<div className="multi-select__menu" ref={dropdownRef}>
					{(multi && type!=="dashboard") && (
						<>
							<div className="multi-select__menu-item" key="select-all">
								<Checkbox
									key="select-all-checkbox"
									children="Select all"
									checked={selectAllChecked}
									value="all"
									onClick={toggleSelectedAll}
								/>
							</div>
							<Divider light />
						</>
					)}
					<div className="multi-select__menu-items">
						{filterdSite.map(({ value, label }) => (
							<div className="multi-select__menu-item-checkbox" key={value}>
								{multi && (
									<Checkbox
									    disabled={(type==="dashboard" && selectedOptions.length > 4 && !selectedOptions.includes(value)) ? true : false}
										key={value}
										children={formatSite(label, email)}
										checked={selectedOptions.includes(value)}
										value={label || ""}
										onClick={() => handleMultiSelect(value)}
									/>
								)}
								{!multi && (
									<div
										className={`multi-select__menu-item-label${selectedOptions.includes(value) ? "__selected" : ""}`}
										key={value}
										onClick={() => handleMultiSelect(value)}
									>
										<span>{formatSite(label, email)}</span>
									</div>
								)}
							</div>
						))}
					</div>
					<Divider light />
					<Flex justify="flex-end">
						<Button
							buttonStyle={{ margin: "2px" }}
							fullWidth
							text={multi ? "Apply" : "Confirm"}
							onClick={() => {
								setDropdownOpen(!dropdownOpen);
								if (selectedOptions[0] !== "" || selectedOptions.length === 0) {
									//setSearchText('')
									onChange(selectedOptions);
								} else {
									onChange([]);
								}
							}}
						/>
					</Flex>
				</div>
			}
		>
			{/* <Button
				fullWidth={fullWidth}
				className="multi-select__button"
				buttonStyle={{ marginLeft: 2, ...style, overflow: 'hidden' }}
				textStyle={{ color: selectedOptions.length === 0 ? "gray" : "" }}
				text={formatSite(
					selectedOptions.length > 1 && selectedOptions.length < options.length
						? selectedOptions.length + " " + multiplePlaceholder
						: dropdownText,
					email
				)}
				variant="outline"
				onClick={() => setDropdownOpen(!dropdownOpen)}
				icon={<DropdownIcon style={{ transform: "scaleX(0.9)" }} />}
				iconStyle={{ fontSize: 22, marginTop: 1 }}
				iconPosition="after"
				/> */}
		<div style={{position:'relative',...style}}>
			<SearchIcon style={{position:'absolute',top:8,left:1,...dropDownIconStyle}} />
			     <input 
				 autoComplete="off" 
				 disabled={disabled}
				    name="search"
					type="text"
					value={searchText}
					placeholder={selectedOptions.length > 1 && selectedOptions.length < options.length
						? selectedOptions.length + " " + multiplePlaceholder
						: dropdownText || undefined}
					onClick={()=>setDropdownOpen(true)}
					style={{cursor:disabled?'not-allowed':'auto',height:'38px',borderRadius:'10px',paddingLeft:'25px',...style}}
					id="search"
					onChange={(e)=>{setSearchText(e.target.value)}}
					/>
		</div>
		</Dropdown>
		
	);
};

MultiSelect.defaultProps = {
	onChange: () => []
};
