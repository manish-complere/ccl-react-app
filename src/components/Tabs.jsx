import React from "react";
import { Tabs, Tab, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tabContainer: {
    margin: theme.spacing(0, 2),
    "& .MuiTab-textColorPrimary.Mui-selected": {
      border: "3px solid #3f51b5",
      background: "#3f51b5",
      color: "#fff",
    },
    "& span:nth-child(2)": {
      display: "none",
    },
    "& .MuiButtonBase-root": {
      background: "rgba(0,0,0,0.1)",
      borderRadius: theme.spacing(0.5),
      minHeight: "1rem",
    },
  },
}));

const CustomTabs = (props = {}) => {
  const { activeTab = 0, onChange = () => {}, tabs = [] } = props;
  const classes = useStyles();
  return (
    <Tabs
      value={activeTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={onChange}
      aria-label="disabled tabs example"
      className={classes.tabContainer}
    >
      {tabs.map((title, index) => (
        <Tab label={title} id={index} key={index} ariaControls={index} />
      ))}
    </Tabs>
  );
};

export default CustomTabs;
