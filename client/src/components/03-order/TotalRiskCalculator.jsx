import * as React from "react";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import { BotContext } from "../BotContext";

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

export default function TotalRiskCalculator() {
  const outerTheme = useTheme();
  const { userMarginData } = React.useContext(BotContext);
  const balance = Number(userMarginData.totalCollateralValueInUSDT);

  const [marginBalance, setMArginBalance] = React.useState(balance);
  const [riskPercent, setRiskPercent] = React.useState(5);
  const [riskUsdt, setRiskUsdt] = React.useState(0);

  const calculateMaxRisk = (totalBalance, risk) => {
    const maxRisk = Number(totalBalance) * (Number(risk) * 0.01);
    setRiskUsdt(maxRisk);
  };

  // Run calculateMaxRisk on load
  React.useEffect(() => {
    calculateMaxRisk(marginBalance, riskPercent);
  }, [marginBalance, riskPercent]);

  return (
    <>
      <h3>Maximum Risk</h3>
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
            defaultValue={balance.toFixed(2)}
            onChange={(e) => setMArginBalance(e.target.value)}
          />
          <TextField
            label="Risk(%)"
            variant="standard"
            defaultValue={5}
            onChange={(e) => {
              setRiskPercent(e.target.value);
            }}
          />
          <TextField
            label="Max Lost(usdt)"
            variant="standard"
            value={riskUsdt.toFixed(2)}
          />
        </ThemeProvider>
      </Box>
      <p>{`If you take ${riskPercent}% risk on your all balance, you will lose ${riskUsdt.toFixed(
        2
      )} usdt.`}</p>
    </>
  );
}
