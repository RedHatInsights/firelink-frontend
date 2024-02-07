import  React, {useContext,  useState}  from "react"
import { Title, TitleSizes, Button, Form, Card, Split, Grid, GridItem, CardBody, CodeBlock, CodeBlockCode, FormGroup, TextInput, Page, PageSection, PageSectionVariants, SplitItem, CardTitle  } from "@patternfly/react-core"
import Loading from "../shared/Loading";
import { PoolSelectList, DurationSelectList, DefaultPool, DefaultDuration } from "../shared/CustomSelects";
import DescribeLink from "../shared/DescribeLink";

import { useSelector, useDispatch } from "react-redux";
import {
    loadNamespaces,
    getIsNamespacesEmpty,
    clearNamespaces,
    getRequester
} from "../store/AppSlice";

export default function NamespaceReserve() {
    const [response, setResponse] = useState({message: "", completed: false, namespace: ""})
    const [displayResponse, setDisplayResponse] = useState(false)

    const [duration, setDuration] = useState(DefaultDuration)   
    const [pool, setPool] = useState(DefaultPool)

    const [isLoading, setIsLoading] = useState(false)

    const [loadingMessage, setLoadingMessage] = useState("Reserving namespace...")
    const requester = useSelector(getRequester)

    const dispatch = useDispatch();

    function requestReservation() {
        setLoadingMessage("Reserving namespace...")
        setIsLoading(true)
        fetch('/api/firelink/namespace/reserve', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({requester: requester, duration: duration, pool: pool})
          }).then(response => response.json()).then((resp) => {
            setResponse(resp);
            
            setDisplayResponse(true);
            if ( resp.completed ) {
                setIsLoading(false);
                loadNamespaceList();
            } else {
                setIsLoading(false);
            }
        })
    }

    function loadNamespaceList() {
        dispatch(loadNamespaces())
    }

    const form = <Form>
    <FormGroup label="Requester" fieldId="simple-form-requester-01">
      <TextInput isRequired type="text" id="simple-form-requester-01" name="simple-form-requester-01" value={requester} isDisabled/>
    </FormGroup>
    <DurationSelectList duration={duration} setDuration={setDuration} />
    <PoolSelectList pool={pool} setPool={setPool} />
  </Form>;

    function renderResponse() {
        if (displayResponse ) {
            return <React.Fragment>
                <p>{response.message}</p>
                <DescribeLink namespace={response.namespace}/>
            </React.Fragment>
        }
    }

    function renderUI() {
        if ( isLoading) {
            return <Loading message={loadingMessage}/>
        } else {
            return <React.Fragment>
                <Grid >
                    <GridItem span={6}>
                        <PageSection>
                            <Card>
                                <CardTitle>
                                    Request
                                </CardTitle>
                                <CardBody>
                                    {form}
                                </CardBody>
                            </Card>
                        </PageSection>
                    </GridItem>
                    <GridItem span={6}>
                        <PageSection>
                            <Card>
                                <CardTitle>
                                    Response
                                </CardTitle>
                                <CardBody>
                                    <CodeBlock>
                                        <CodeBlockCode id="code-content">
                                            {renderResponse()}
                                        </CodeBlockCode>
                                    </CodeBlock>
                                </CardBody>
                            </Card>
                        </PageSection>
                    </GridItem>
                </Grid>
            </React.Fragment>
    
        }
    }

    return <React.Fragment>
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Split>
                    <SplitItem>
                        <Title headingLevel="h1" size={TitleSizes['3xl']}>
                            Reserve Namespace
                        </Title>
                    </SplitItem>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <Button onClick={() => {requestReservation()}} variant="primary">Reserve</Button>
                    </SplitItem>
                </Split>

            </PageSection>
            { renderUI() }
        </Page>
    </React.Fragment>
}