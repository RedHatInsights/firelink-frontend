import React from 'react';
import { StrictMode } from 'react';

import {   List, ListItem, Stack, Page, PageSectionVariants, PageSection, Split, SplitItem, Card, CardTitle, CardBody, Title, TitleSizes, Grid, GridItem, StackItem} from '@patternfly/react-core';
import Cluster from '@patternfly/react-icons/dist/esm/icons/cluster-icon'
import CloudUpload from '@patternfly/react-icons/dist/esm/icons/cloud-upload-alt-icon'
import Code from '@patternfly/react-icons/dist/esm/icons/code-icon'
import FadeInFadeOut from './shared/FadeInFadeOut';


export default function Root() {

    const Pillars = () => {
   
        return <React.Fragment>
            <FadeInFadeOut>
            <Grid hasGutter >
                <GridItem span={4} >
                    <Card className="pf-u-box-shadow-md" style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                <Cluster/> Manage
                            </Title>
                        </CardTitle>
                        <CardBody >
                            <Stack hasGutter>
                                <StackItem>
                                    <Stack hasGutter>
                                        <StackItem>
                                            <p>Control the full ephemeral environment namespace reservation lifecycle</p>
                                        </StackItem>
                                        <StackItem>
                                            <List>
                                                <ListItem>Reserve Namespaces</ListItem>
                                                <ListItem>Release Reservations</ListItem>
                                                <ListItem>Extend Reservations</ListItem>
                                            </List>
                                        </StackItem>
                                    </Stack>
                                </StackItem>
                            </Stack>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem span={4}>
                    <Card style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                <CloudUpload/> Deploy
                            </Title>
                        </CardTitle>
                        <CardBody >
                            <Stack hasGutter>
                                <StackItem>
                                    <Stack hasGutter>
                                        <StackItem>
                                            <p>Find and deploy apps into ephemeral environments</p>
                                        </StackItem>
                                        <StackItem>
                                            <List>
                                                <ListItem>Explore Apps</ListItem>
                                                <ListItem>Inspect Dependencies</ListItem>
                                                <ListItem>Deploy Apps</ListItem>
                                            </List>
                                        </StackItem>
                                    </Stack>
                                </StackItem>
                            </Stack>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem span={4}>
                    <Card style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                <Code/> Develop
                            </Title>
                        </CardTitle>
                        <CardBody >
                            <Stack hasGutter>
                                <StackItem>
                                    <Stack hasGutter>
                                        <StackItem>
                                            <p>All the info you need to work on your apps in one place</p>
                                        </StackItem>
                                        <StackItem>
                                            <List>
                                                <ListItem>Console and Front End Links</ListItem>
                                                <ListItem>Keycloak Credentials</ListItem>
                                                <ListItem>Repo and Deployment YAML Links</ListItem>
                                            </List>
                                        </StackItem>
                                    </Stack>
                                </StackItem>
                            </Stack>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
            </FadeInFadeOut>
        </React.Fragment>
    }

    return <StrictMode>
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Split>
                    <SplitItem>
                        
                        <Title headingLevel="h1" size={TitleSizes['3xl']}>
                            Firelink
                        </Title>
                        An app store for Ephemeral Environments, powered by Bonfire
                    </SplitItem>
                    <SplitItem isFilled/>
                </Split>

            </PageSection>
            <PageSection>
            <Pillars/>
            </PageSection>
        </Page>
    </StrictMode>
}