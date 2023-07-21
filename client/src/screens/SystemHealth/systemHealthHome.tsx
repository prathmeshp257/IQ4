import React, { FC, useState } from "react";
import { CardWithTabs } from "../../components";
import { Shell } from "../../containers";
import RowLayoutIcon from "@material-ui/icons/Menu";
import ColumnLayoutIcon from "@material-ui/icons/ViewWeek";
import { Switch } from "antd";
import { isMobile } from "react-device-detect";
import { Flex } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { ExternalAPIPerformance } from "./ExternalAPIPerformance";
import { SystemHealth } from "./SystemHealth";
import { PendingMmc } from "./PendingMmc";
import { VRMCorrectionStats } from "./VRMCorrectionStats";

export const SystemHealthHome: FC = () => {
  const [activeLabel, setActiveLabel] = useState<string>("System Health");
  const isLocalContainerColMode =(localStorage.getItem("systemHealth-layout-mode") || "row") === "col";
  const [isContainerColMode, setIsContainerColMode] = useState(isLocalContainerColMode);

  return (
    <Shell
      title="System Health"
      subtitle="Realtime system health data"
      endSlot={
        <>
          {!isMobile && activeLabel === "System Health" && (
            <Flex className="dashboard__refine-menu" justify="space-between">
              <LabelledComponent
                label="Layout"
                className="--margin-right-large"
              >
                <Switch
                  className="reports__refine-menu__switch"
                  checkedChildren={<ColumnLayoutIcon />}
                  unCheckedChildren={<RowLayoutIcon />}
                  defaultChecked={isContainerColMode}
                  onChange={(isCol) => {
                    setIsContainerColMode(isCol);
                    localStorage.setItem(
                      "systemHealth-layout-mode",
                      isCol ? "col" : "row"
                    );
                  }}
                />
              </LabelledComponent>
            </Flex>
          )}
        </>
      }
    >
      <CardWithTabs
        style={{ height: "100%" }}
        key={activeLabel}
        activeLabel={activeLabel || "System Health"}
        title={activeLabel}
        onItemClick={({ label }) => setActiveLabel(label)}
        tabColor="dark"
        isOpen
        items={[
          {
            label: "System Health",
            value: "System Health",
            content: (
              <>
                <SystemHealth isContainerColMode = {isContainerColMode} />
              </>
            ),
          },
          {
            label: "External API Performance",
            value: "External API Performance",
            content: (
              <>
                <ExternalAPIPerformance />
              </>
            ),
          },
          {
            label: "MMC Pending",
            value: "MMC Pending",
            content: (
              <>                
                <PendingMmc isContainerColMode = {isContainerColMode} />
              </>
            ),
          },
          {
            label: "VRM Correction Stats",
            value: "VRM Correction Stats",
            content: (
              <>                
                <VRMCorrectionStats isContainerColMode = {isContainerColMode} />
              </>
            ),
          },
        ]}
      />
    </Shell>
  );
};
