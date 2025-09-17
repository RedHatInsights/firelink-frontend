import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Page,
  Split,
  PageSection,
  InputGroup,
  TextInput,
  Title,
  TitleSizes,
  InputGroupItem,
  SplitItem,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  Stack,
  StackItem,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import NamespaceDescriptionCard from "./NamespaceDescribeCard";
import PodsTableCard from "./TopPodsCard";
import NamespaceResourcesCard from "./NamespaceResourcesCard";
import ErrorCard from "../shared/ErrorCard";

function NamespaceDescribe() {
  const navigate = useNavigate();

  const { namespaceParam } = useParams();
  const [namespace, setNamespace] = useState("");
  const [namespaceInput, setNamespaceInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (namespaceParam) {
      setNamespace(namespaceParam);
      setNamespaceInput(namespaceParam);
    }
  }, [namespaceParam]);

  const buttonClickHandler = () => {
    setError(null);
    navigate(`/namespace/describe/${namespaceInput}`);
  };

  const NoNamespaceLoaded = () => (
    <EmptyState  headingLevel="h4" icon={CubesIcon}  titleText="No Namespace Specified" variant={EmptyStateVariant.lg}>
      <EmptyStateBody>
        Enter a namespace name in the input box above to get started.
      </EmptyStateBody>
    </EmptyState>
  );

  const ToolBar = () => {
    const inputRef = useRef(null);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [namespaceInput]);
    return (
      <PageSection hasBodyWrapper={false} >
        <Split>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Describe Namespace
            </Title>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  id="text-input"
                  value={namespaceInput}
                  onChange={(_evt, value) => setNamespaceInput(value)}
                  default="test"
                  ref={inputRef}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button onClick={buttonClickHandler}>Describe</Button>
              </InputGroupItem>
            </InputGroup>
          </SplitItem>
        </Split>
      </PageSection>
    );
  };

  if (namespace === "") {
    return (
      <Page>
        <ToolBar />
        <PageSection hasBodyWrapper={false}>
          <NoNamespaceLoaded />
        </PageSection>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <ToolBar />
        <PageSection hasBodyWrapper={false} isCenterAligned={true}>
          <ErrorCard error={error.message} onRetry={buttonClickHandler} />
        </PageSection>
      </Page>
    );
  }

  return (
    <Page>
      <ToolBar />
      <PageSection hasBodyWrapper={false} isCenterAligned={true} hasOverflowScroll={true}>
        <Stack hasGutter>
          <StackItem>
            <NamespaceResourcesCard namespace={namespace} />
          </StackItem>
          <StackItem>
            <Grid hasGutter>
              <GridItem span={6}>
                <NamespaceDescriptionCard
                  namespace={namespace}
                  onError={setError}
                />
              </GridItem>
              <GridItem span={6}>
                <PodsTableCard namespace={namespace} onError={setError} />
              </GridItem>
            </Grid>
          </StackItem>
        </Stack>
      </PageSection>
    </Page>
  );
}

export default NamespaceDescribe;
