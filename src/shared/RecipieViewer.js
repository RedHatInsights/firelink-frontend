import React from 'react';
import {
	Label, Grid,
	GridItem,
	Stack,
	StackItem,
	Content,
	ContentVariants
} from '@patternfly/react-core';

import {
    CheckCircleIcon,
    TimesCircleIcon,
} from '@patternfly/react-icons';
import SelectedAppsChips from "./SelectedAppsChips";

const Namespace = ({ namespace }) => {
    if (namespace === "") {
        return "A new namespace will be reserved for you.";
    }
    return namespace;
};

const GreenCheck = () => <CheckCircleIcon style={{ color: "green" }} />;
const RedX = () => <TimesCircleIcon style={{ color: "red" }} />;

const PreserveResources = ({ resources }) => {
    if (resources.length === 0) {
        return "No apps or components selected for resource preservation.";
    }
    return resources.map((resource) => (
        <li key={resource}>
            <Content style={{ fontFamily: "monospace" }}>
                {resource}
            </Content>
        </li>
    ));
};

const OmitDependencies = ({ dependencies }) => {
    if (dependencies.length === 0) {
        return "No apps or components selected to omit dependencies.";
    }
    return dependencies.map((resource) => (
        <li key={resource}>
            <Content style={{ fontFamily: "monospace" }}>
                {resource}
            </Content>
        </li>
    ));
};

const SetParameters = ({ parameters }) => {
    if (Object.keys(parameters).length === 0) {
        return "No template parameters overridden.";
    }
    return Object.entries(parameters).map(([key, value]) => (
        <li key={key}>
            <Content style={{ fontFamily: "monospace" }}>
                {key}={value}
            </Content>
        </li>
    ));
};

const ImageTagOverrides = ({ overrides }) => {
    if (Object.keys(overrides).length === 0) {
        return "No image tags overridden.";
    }
    return Object.entries(overrides).map(([key, value]) => (
        <li key={key}>
            <Content style={{ fontFamily: "monospace" }}>
                {key}={value}
            </Content>
        </li>
    ));
};

const AppDeployOptions = ({ recipe }) => (
    <ul>
        <li>Deploy Frontends: {recipe.frontends ? <GreenCheck /> : <RedX />}</li>
        <li>Release on fail: {recipe.no_release_on_fail ? <RedX /> : <GreenCheck />}</li>
        <li>Get dependencies: {recipe.get_dependencies ? <GreenCheck /> : <RedX/>}</li>
        <li>Single replicas: {recipe.single_replicas ? <GreenCheck /> : <RedX />}</li>
        <li>Pool: <Label variant="outline" >{recipe.pool}</Label></li>
        <li>Duration: <Label variant="outline" >{recipe.duration}</Label> </li>
        <li>Templates Parameter Value Source: <Label variant="outline" >{recipe.target_env}</Label></li>
        <li>Deploy Version Source: <Label variant="outline" >{recipe.ref_env}</Label></li>
        <li>Options Dependencies Method: <Label variant="outline" >{recipe.optional_deps_method}</Label></li>
    </ul>
);

export default function RecipeViewer({ recipe }) {

    return (
        <Grid hasGutter>
            <GridItem span={1} />
            <GridItem span={5}>
                <Stack hasGutter>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Apps
                            </Content>
                        </Content>
                        <SelectedAppsChips appList={recipe.app_names}/>
                    </StackItem>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Namespace
                            </Content>
                            <Namespace namespace={recipe.namespace} />
                        </Content>
                    </StackItem>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>Options</Content>
                            <AppDeployOptions recipe={recipe} />
                        </Content>
                    </StackItem>
                </Stack>
            </GridItem>
            <GridItem span={5}>
                <Stack hasGutter>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Preserve Resources
                            </Content>
                            <Content component="ul">
                                <PreserveResources resources={recipe.no_remove_resources} />
                            </Content>
                        </Content>
                    </StackItem>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Omit Dependencies
                            </Content>
                            <Content component="ul">
                                <OmitDependencies dependencies={recipe.remove_dependencies} />
                            </Content>
                        </Content>
                    </StackItem>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Set Parameters
                            </Content>
                            <Content component="ul">
                                <SetParameters parameters={recipe.set_parameter} />
                            </Content>
                        </Content>
                    </StackItem>
                    <StackItem>
                        <Content>
                            <Content component={ContentVariants.h2}>
                                Image Tag Overrides
                            </Content>
                            <Content component="ul">
                                <ImageTagOverrides overrides={recipe.set_image_tag} />
                            </Content>
                        </Content>
                    </StackItem>
                </Stack>
            </GridItem>
            <GridItem span={1} />
        </Grid>
    );
}
