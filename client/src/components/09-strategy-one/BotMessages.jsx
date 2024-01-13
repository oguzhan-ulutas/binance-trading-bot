import { v4 as uuidv4 } from "uuid";

import { useContext, useEffect, useState, Fragment } from "react";

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

const BotMessages = () => {
  const { messages } = useContext(StrategyOneContext);
  console.log(messages);

  return (
    <Box sx={{ width: "100%" }}>
      <h2>Bot Actions</h2>
      <Stack
        spacing={2}
        divider={<Divider flexItem />}
        direction="column-reverse"
        sx={{
          height: "400px",
          overflow: "auto",
        }}
      >
        {messages.length ? (
          messages.map((message, index) => {
            return (
              <Fragment key={message.msgId}>
                <Item>
                  <Typography variant="caption" gutterBottom>
                    <strong>Action Number: {index + 1}</strong> <br />
                    Action : {message.msg} <br />
                    Function Name : {message.functionName} <br />
                  </Typography>
                </Item>
              </Fragment>
            );
          })
        ) : (
          <h1>Waiting for bot to start</h1>
        )}
      </Stack>
    </Box>
  );
};

export default BotMessages;
