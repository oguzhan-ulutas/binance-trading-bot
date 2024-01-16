import { useContext, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Errors = () => {
  const { errors, setErrors } = useContext(StrategyOneContext);

  // Add id to errors
  useEffect(() => {
    errors.map((error) => {
      if (!error.id) {
        error.id = uuidv4();
      }
    });
  }, [errors.length]);

  return (
    <>
      {errors.length ? (
        <Box key="errors-div">
          <h2 key="errors-header">ERRORS</h2>
          <Button
            key="error-clear-button"
            onClick={() => setErrors([])}
            variant="contained"
          >
            Clear Errors
          </Button>

          <Divider style={{ margin: "20px 0" }} />

          <Stack
            spacing={2}
            divider={<Divider flexItem />}
            sx={{
              height: "200px",
              overflow: "auto",
            }}
          >
            {errors.map((item) => {
              return (
                <Fragment key={item.id}>
                  <Item key={item.id}>
                    <Typography variant="caption" gutterBottom>
                      Code : {item.code} <br />
                      Message : {item.msg} <br />
                      Function : {item.functionName} <br />
                      Url : {item.url} <br />
                    </Typography>
                  </Item>
                </Fragment>
              );
            })}
          </Stack>
        </Box>
      ) : null}
    </>
  );
};

export default Errors;
