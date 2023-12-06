import * as React from "react";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import Divider from "@mui/material/Divider";

import { BotContext } from "../BotContext";
import LongTermTable from "./LongTermTable";
import "./Projections.css";
import OnePercentTable from "./OnePercentTable";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "#6F7E8C",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&:before, &:after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&:before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

const Projections = () => {
  const outerTheme = useTheme();
  const { userMarginData } = React.useContext(BotContext);
  const balance = Number(userMarginData.totalCollateralValueInUSDT);

  const [marginBalance, setMarginBalance] = React.useState(balance);

  const [profit, setProfit] = React.useState(1);
  const [period, setPeriod] = React.useState("Day");
  const [interval, setInterval] = React.useState(10);
  return (
    <>
      <div className="long-term-table">
        <h3>Long Term Projections</h3>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { sm: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              label="Margin Balance(usdt)"
              variant="standard"
              defaultValue={marginBalance.toFixed(2)}
              onChange={(e) => setMarginBalance(Number(e.target.value))}
            />
          </ThemeProvider>
        </Box>
        <LongTermTable
          marginBalance={marginBalance}
          setMArginBalance={setMarginBalance}
        />

        <Divider />

        <h3>Percentage Calculation Table</h3>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { sm: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              label="Margin Balance(usdt)"
              variant="standard"
              defaultValue={marginBalance.toFixed(2)}
              onChange={(e) => setMarginBalance(Number(e.target.value))}
            />
            <TextField
              label="Profit(%)"
              variant="standard"
              defaultValue={profit}
              onChange={(e) => setProfit(Number(e.target.value))}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Period</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={period}
                label="Time Period"
                onChange={(e) => setPeriod(e.target.value)}
                style={{}}
              >
                <MenuItem value={"Day"}>Day</MenuItem>
                <MenuItem value={"Week"}>Week</MenuItem>
                <MenuItem value={"Year"}>Year</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Time Interval"
              variant="standard"
              defaultValue={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
            />
          </ThemeProvider>
        </Box>
        <OnePercentTable
          marginBalance={marginBalance}
          profit={profit}
          period={period}
          interval={interval}
        />
      </div>
    </>
  );
};

export default Projections;
