import React from "react";
import {
  Spinner,
  Bullseye,
  Card,
  CardBody,
  Content,
  CardTitle,
  CardFooter,
} from "@patternfly/react-core";

function Loading(message = "") {
  return (
    <Bullseye style={{ height: "12em" }}>
      <div style={{ width: "24rem", textAlign: "center" }}>
        <Card isLarge>
          <CardTitle>Loading...</CardTitle>
          <CardBody>
            <Bullseye>
              <Spinner aria-label="Loading" />
              <Content></Content>
            </Bullseye>
          </CardBody>
          <CardFooter>{message.message}</CardFooter>
        </Card>
      </div>
    </Bullseye>
  )
}

export default Loading;
