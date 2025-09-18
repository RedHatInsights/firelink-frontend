import React from "react";
import {
  Spinner,
  Bullseye,
  Card,
  CardBody,
  Content,
  CardTitle,
} from "@patternfly/react-core";

function Loading(message = "") {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "20vh",
      width: "100%",
      overflow: "hidden" // Prevent scroll bars
    }}>
      <Card style={{ width: "24rem", maxWidth: "90%" }}>
        <CardTitle>Loading...</CardTitle>
        <CardBody>
          <Bullseye>
            <Spinner aria-label="Loading" />
          </Bullseye>
          {message.message && (
            <Content style={{ marginTop: "1rem", textAlign: "center" }}>
              {message.message}
            </Content>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Loading;
