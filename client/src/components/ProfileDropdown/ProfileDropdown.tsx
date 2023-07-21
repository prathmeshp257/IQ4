import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Dropdown } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { PATHS } from "../../constants";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useClickOutside } from "../../hooks";
import { Divider } from "../Divider";
import axios from "axios";

interface ProfileDropdownProps {
	className?: string;
}

export const ProfileDropdown: FC<ProfileDropdownProps> = ({ className = "" }) => {
	const history = useHistory();
	const { userData, onLogout } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const { email, firstName, resetUserContext } = useContext(UserContext);
	const { resetSiteContext } = useContext(SiteContext);

	const profileImg = localStorage.getItem("profile-img");

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleLogout = async () => {
		const token = localStorage.getItem("token");
		await axios.post(`/api/auth/logout`, {email, type: userLoginType, token});
		localStorage.clear();
		sessionStorage.clear();

		localStorage.removeItem("dashboard-sites");
		localStorage.removeItem("live-sites");

		resetUserContext();
		resetSiteContext();
		onLogout();

		setTimeout(() => {
			history.replace(PATHS.LOGIN);
		}, 500);
	};

	const dropdownVisibilityProp = isMobile ? undefined : { visible: dropdownOpen };

	const { ref: dropdownRef, isClickOutside, resetIsClickOutside } = useClickOutside();

	useEffect(() => {
		if (isClickOutside) {
			setDropdownOpen(false);
			resetIsClickOutside();
		}
	}, [dropdownOpen, isClickOutside, resetIsClickOutside]);

	return (
		<Dropdown
			forceRender
			className={`profile-dropdown ${className}`}
			{...dropdownVisibilityProp}
			getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
			placement="topLeft"
			overlay={
				<div className="profile-dropdown__menu" ref={dropdownRef}>
					<div className="--padding-top-medium --padding-left-medium" key="name">
						<p>
							Hi, <b>{firstName}</b>
						</p>
					</div>
					<Divider light />
					<div
						className="profile-dropdown__menu__item"
						key="profile"
						onClick={() => {
							history.push(PATHS.EDIT_USER);
							setDropdownOpen(false);
							console.log("PATHS.EDIT_USER==",PATHS.EDIT_USER)
						}}
					>
						<p>Edit Profile</p>
					</div>

					<div
						className="profile-dropdown__menu__item"
						key="sign-out"
						onClick={() => {
							handleLogout();
							setDropdownOpen(false);
						}}
					>
						<p>Sign Out</p>
					</div>
				</div>
			}
		>
			<div
				tabIndex={0}
				className="profile-dropdown__image-container"
				onMouseEnter={() => setDropdownOpen(true)}
				onKeyDown={({ key }) => {
					if (key === "Space" || key === "Enter") {
						setDropdownOpen(true);
					}
				}}
			>
				{profileImg && (
					<img
						src={`data:image/jpeg;base64,${profileImg}`}
						className="profile-dropdown__image"
						onClick={() => setDropdownOpen(!dropdownOpen)}
						alt=""
						style={{ borderRadius: "50%" }}
					/>
				)}
				{!profileImg && <AccountCircleIcon fontSize="large" className="profile-dropdown__image" />}
			</div>
		</Dropdown>
	);
};
