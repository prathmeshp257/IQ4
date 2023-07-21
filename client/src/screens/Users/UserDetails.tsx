import React, { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { Formatter } from "../../utils";
import { width } from "@mui/system";
import CropImage from "./CropImage";
interface UserDetailsProps {
  formik: any;
  userType: string;
  userLoginType: string;
  operators: any[];
  retailers: any[];
  setSelectedSites: any;
  rawSites: any[];
  imageChange: any;
  selectedSites: any[];
  setStep: any;
  cancel: any;
  type: string;
  setLogo: any;
  logo?: any;
  profile?: any;
  url?: any;
  // cropOpen?:any;
  // setCropOpen?:any;
}

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;

const Error = styled.label`
  font-size: 12px;
  color: red;
  display: ${(e) => (e ? "block" : "none")};
  margin-top: 10px;
`;

const InputText = styled.input`
  display: flex;
  height: 44px;
  width: 100%;
  min-width: ${isMobile ? "260px" : "285px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "285px"};
  box-shadow: inset 1px 1px 2px #14141469;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  letter-spacing: 1.1px;
  align-items: center;
  background-color: #f4f2f6;
  -webkit-appearance: none;
  :focus {
    outline-color: ${colors.primary};
  }
`;

export const UserDetails: FC<UserDetailsProps> = ({
  formik,
  userLoginType,
  userType,
  operators,
  retailers,
  setSelectedSites,
  rawSites,
  imageChange,
  selectedSites,
  setStep,
  setLogo,
  cancel,
  type,
  logo,
  profile,
  url
}) => {
  const [imgSrc, setImgSrc] = useState<any>();
  const [cropOpen, setCropOpen] = useState(false);
  const handleNextClick = () => {
    formik.setFieldTouched("firstName");
    formik.setFieldTouched("lastName");
    formik.setFieldTouched("email");
    formik.setFieldTouched("location");
    formik.setFieldTouched("operator");
    formik.setFieldTouched("retailer");
    formik.setFieldTouched("allowances");
    formik.setFieldTouched("contact");
    formik.setFieldTouched("limit");
    formik.setFieldTouched("sites");
    formik.setFieldTouched("logoImg");
    formik.setFieldTouched("profileImg");
    formik.setFieldTouched("pdfTemplate");
    formik.setFieldTouched("footerImg");
    if (type === "Add") {
      formik.setFieldTouched("password");
      formik.setFieldTouched("confirmPassword");
    } else {
      formik.setFieldTouched("oldPassword");
      formik.setFieldTouched("newPassword");
    }
    if (
      !formik.errors ||
      (formik.errors && Object.keys(formik.errors).length < 1)
    ) {
      setStep(2);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImgSrc(reader.result);
      };
      setCropOpen(true);
    }
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <hr />
      <h2 style={{ textAlign: "center" }}>User Details</h2>
      <Flex direction="row" justify="space-between" wrap="wrap">
        <div className="--margin-bottom-large">
          <Label>First name</Label>
          <InputText
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="nope"
            onChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("firstName")}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <Error>{formik.touched.firstName && formik.errors.firstName}</Error>
          )}
        </div>
        <div className="--margin-bottom-large">
          <Label>Last name</Label>
          <InputText
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="nope"
            onChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("lastName")}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <Error>{formik.touched.lastName && formik.errors.lastName}</Error>
          )}
        </div>
        <div className="--margin-bottom-large">
          <Label>Email address</Label>
          <InputText
            id="email"
            name="email"
            type="email"
            autoComplete="nope"
            onChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("email")}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <Error>{formik.touched.email && formik.errors.email}</Error>
          )}
        </div>
        {type === "Add" ? (
          <div className="--margin-bottom-large">
            <Label>Password</Label>
            <InputText
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("password")}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <Error>{formik.touched.password && formik.errors.password}</Error>
            )}
          </div>
        ) : (
          <div className="--margin-bottom-large">
            <Label>Old Password</Label>
            <InputText
              id="oldPassword"
              name="oldPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("oldPassword")}
              value={formik.values.oldPassword}
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <Error>
                {formik.touched.oldPassword && formik.errors.oldPassword}
              </Error>
            )}
          </div>
        )}
        {type === "Add" ? (
          <div className="--margin-bottom-large">
            <Label>Confirm password</Label>
            <InputText
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("confirmPassword")}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <Error>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </Error>
              )}
          </div>
        ) : (
          <div className="--margin-bottom-large">
            <Label>New Password</Label>
            <InputText
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("newPassword")}
              value={formik.values.newPassword}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <Error>
                {formik.touched.newPassword && formik.errors.newPassword}
              </Error>
            )}
          </div>
        )}
        {userType === "Admin" ? (
          <div className="--margin-bottom-large">
            <Label>Location</Label>
            <InputText
              id="location"
              name="location"
              type="text"
              autoComplete="nope"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("location")}
              value={formik.values.location}
            />
            {formik.touched.location && formik.errors.location && (
              <Error>{formik.touched.location && formik.errors.location}</Error>
            )}
          </div>
        ) : (userType === "Retailer" || userType === 'Collaborator') && userLoginType === "Admin" ? (
          <div className="--margin-bottom-large">
            <Label>Operator</Label>
            <select
              name="operator"
              id="operator"
              style={{
                width: `${isMobile ? "260px" : "285px"}`,
                height: "44px",
                borderRadius: "10px",
                textAlign: "center",
              }}
              onChange={(e: any) => {
                setSelectedSites([]);
                formik.handleChange(e);
              }}
              onBlur={() => formik.setFieldTouched("operator")}
            >
              <option value="" selected={formik.values.operator === ""}>
                Please Select Operator
              </option>
              {operators &&
                operators.length > 0 &&
                operators.map((eachOperator: any) => {
                  return (
                    <option
                      value={userType === 'Collaborator' ? eachOperator._id : eachOperator.email}
                      selected={formik.values.operator === eachOperator.email}
                    >
                      {eachOperator.email}
                    </option>
                  );
                })}
            </select>
            {formik.touched.operator && formik.errors.operator && (
              <Error>{formik.touched.operator && formik.errors.operator}</Error>
            )}
          </div>
        ) : userLoginType === "Operator" ? (
          <div className="--margin-bottom-large">
            <Label>Operator</Label>
            <InputText
              id="operator"
              name="operator"
              type="text"
              autoComplete="nope"
              disabled={true}
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("operator")}
              value={formik.values.operator}
            />
            {formik.touched.operator && formik.errors.operator && (
              <Error>{formik.touched.operator && formik.errors.operator}</Error>
            )}
          </div>
        ) : userType === "Customer" && userLoginType === "Admin" ? (
          <div className="--margin-bottom-large">
            <Label>Parent Account</Label>
            <select
              name="retailer"
              id="retailer"
              style={{
                width: `${isMobile ? "260px" : "285px"}`,
                height: "44px",
                borderRadius: "10px",
                textAlign: "center",
              }}
              onChange={(e: any) => {
                setSelectedSites([]);
                formik.handleChange(e);
              }}
              onBlur={() => formik.setFieldTouched("retailer")}
            >
              <option value="" selected={formik.values.retailer === ""}>
                Please Select Retailer
              </option>
              {retailers &&
                retailers.length > 0 &&
                retailers.map((eachRetailer: any) => {
                  return (
                    <option
                      value={eachRetailer.email}
                      selected={formik.values.retailer === eachRetailer.email}
                    >
                      {eachRetailer.email}
                    </option>
                  );
                })}
            </select>
            {formik.touched.retailer && formik.errors.retailer && (
              <Error>{formik.touched.retailer && formik.errors.retailer}</Error>
            )}
          </div>
        ) : userLoginType === "Retailer" ? (
          <div className="--margin-bottom-large">
            <Label>Parent Account</Label>
            <InputText
              id="retailer"
              name="retailer"
              type="text"
              autoComplete="nope"
              disabled={true}
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("retailer")}
              value={formik.values.retailer}
            />
            {formik.touched.retailer && formik.errors.retailer && (
              <Error>{formik.touched.retailer && formik.errors.retailer}</Error>
            )}
          </div>
        ) : userType === "Operator" ? (
          <div className="--margin-bottom-large">
            <Label>Allowances</Label>
            <InputText
              id="allowances"
              name="allowances"
              type="text"
              autoComplete="nope"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("allowances")}
              value={formik.values.allowances}
            />
            {formik.touched.allowances && formik.errors.allowances && (
              <Error>
                {formik.touched.allowances && formik.errors.allowances}
              </Error>
            )}
          </div>
        ) : (
          ""
        )}
        {userType === "Customer" || userType === "Admin" ? (
          <div className="--margin-bottom-large">
            <Label>Contact No</Label>
            <InputText
              id="contact"
              name="contact"
              type="number"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("contact")}
              value={formik.values.contact}
            />
            {formik.touched.contact && formik.errors.contact && (
              <Error>{formik.touched.contact && formik.errors.contact}</Error>
            )}
          </div>
        ) : (
          ""
        )}
        {userType === "Customer" ? (
          <div className="--margin-bottom-large">
            <Label>Request Limit</Label>
            <InputText
              id="limit"
              name="limit"
              type="number"
              onChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("limit")}
              value={formik.values.limit}
            />
            {formik.touched.limit && formik.errors.limit && (
              <Error>{formik.touched.limit && formik.errors.limit}</Error>
            )}
          </div>
        ) : (
          ""
        )}
        {userType != 'Collaborator' && <div className="--margin-bottom-large">
          <Label>Car parks</Label>
          <MultiSelect
            style={{ width: `${isMobile ? "260px" : "285px"}`, height: "44px" }}
            disabled={
              (userType === "Retailer" && !formik.values.operator) ||
              (userType === "Customer" && !formik.values.retailer)
            }
            options={rawSites.map((site: string) => ({
              value: Formatter.normalizeSite(site) || "",
              label: Formatter.capitalizeSite(site),
            }))}
            values={selectedSites}
            onChange={(values) => {

              const normalizedSites = Formatter.normalizeSites(values);
              setSelectedSites(normalizedSites);
              formik.setFieldValue("sites", normalizedSites);
            }}
          />
          {formik.touched.sites && formik.errors.sites && (
            <Error>{formik.touched.sites && formik.errors.sites}</Error>
          )}
        </div>}

        {userType != 'Collaborator' && <div className="--margin-bottom-large">
          <Label>Logo</Label>
          <InputText
            type="file"
            id="logoImg"
            name="logoImg"
            accept="image/*"
            onChange={(e) => {
              onSelectFile(e);
            }}
            onBlur={() => formik.setFieldTouched("logoImg")}
            value={formik.values.logoImg}
          />
        </div>}
        {userType != 'Collaborator' && <div className="--margin-bottom-large">
          <Label>Profile Image</Label>
          <InputText
            type="file"
            name="profileImg"
            id="profileImg"
            accept="image/*"
            onChange={(e) => {
              imageChange(e, "profile");
            }}
            onBlur={() => formik.setFieldTouched("profileImg")}
            value={formik.values.profileImg}
          />
        </div>}

        {userType === "Retailer" ? (
          <React.Fragment>
            <div className="--margin-bottom-large">
              <Label>Pdf Template</Label>
              <InputText
                type="file"
                name="pdfTemplate"
                id="pdfTemplate"
                accept="application/pdf"
                onChange={(e) => {
                  imageChange(e, "pdfTemplate");

                }}
                onBlur={() => formik.setFieldTouched("pdfTemplate")}
                value={formik.values.pdfTemplate}
              />
            </div>
          </React.Fragment>
        ) : (
          ""
        )}


        {logo && userType != 'Collaborator' ? (
          <div
            style={{
              minWidth: isMobile ? "260px" : "285px",
              maxWidth: isMobile ? "260px" : "285px",
            }}
            className="--margin-bottom-large"
          >
            <Label>Logo Preview</Label>
            <img
              style={{ maxWidth: "100%", height: "auto", backgroundColor: 'black' }}
              src={`data:image/png;base64,${logo}`}
            />
          </div>
        ) : (
          ""
        )}
        {profile && userType != 'Collaborator' ? (
          <div
            style={{
              minWidth: isMobile ? "260px" : "285px",
              maxWidth: isMobile ? "260px" : "285px",
            }}
            className="--margin-bottom-large"
          >
            <Label>Profile Preview</Label>
            <img
              style={{ maxWidth: "100%", height: "auto", backgroundColor: 'black' }}
              src={`data:image/png;base64,${profile}`}
            />
          </div>
        ) : (
          ""
        )}

        {url && userType != 'Collaborator' ? (

          <div

            style={{
              minWidth: isMobile ? "260px" : "285px",
              maxWidth: isMobile ? "260px" : "285px",
              marginLeft: '15px'
            }}
            className="--margin-bottom-large"
          >
            <Label>Pdf Template Preview</Label>
            <a href={url} target="_blank"><Button text="view" variant='outline'></Button></a>
          </div>
        ) : (
          ""
        )}


        <br></br>

        <CropImage
          cropOpen={cropOpen}
          setCropOpen={setCropOpen}
          setImage={setLogo}
          image={imgSrc}
        />
      </Flex>
      {userType === "Admin" || userType === "Customer" || userType === 'Collaborator' ? (
        <Flex direction="row" justify="end" wrap="wrap">
          <Button
            text="Cancel"
            className="userButton"
            onClick={() => cancel()}
            color="secondary"
          />
          <Button
            text="Submit"
            className="userButton"
            type="submit"
            loading={formik.isSubmitting}
          />
        </Flex>
      ) : (
        <Button
          onClick={() => {
            handleNextClick();
          }}
          text="Next"
          buttonStyle={{ float: "right", marginBottom: "10px" }}
        />
      )}
    </div>
  );
};
