import React from "react";
import {
  EmptyState,
  Title,
  EmptyStateBody,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  Bullseye,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

function ErrorCard({ error, onRetry }) {
  return (
    <Bullseye >
        <Card isLarge>
          <CardTitle>Error</CardTitle>
          <CardBody>
            <EmptyState titleText={<Title headingLevel="h2" size="lg">
                Something went wrong
              </Title>} icon={ExclamationCircleIcon}>
              <EmptyStateBody>{error}</EmptyStateBody>
              <Button variant="primary" onClick={() => onRetry() }>
                Retry
              </Button>
            </EmptyState>
          </CardBody>
          <CardFooter>
            Please try again later or contact Engineering Productivity if the problem persists.
          </CardFooter>
        </Card>
    </Bullseye>
  );
}

export default ErrorCard;
