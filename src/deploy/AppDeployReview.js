import React from "react";
import { useSelector } from "react-redux";
import { getAppDeploySlice} from "../store/AppDeploySlice";
import {
    Stack,
    StackItem,
    Content,
    ContentVariants,
    Split,
    SplitItem,
} from '@patternfly/react-core';

import AppDeployModal from "./AppDeployModal";
import AppDeploySaveRecipeModal from "./AppDeploySaveRecipeModal";
import RecipeViewer from "../shared/RecipieViewer";

export default function AppDeployReview()  {
    const appDeploySlice = useSelector(getAppDeploySlice);

    return (
        <Stack hasGutter>
            <StackItem>
                <Split>
                    <SplitItem>
                        <Content>
                            <Content component={ContentVariants.h1}>
                                Review & Deploy
                            </Content>
                        </Content>
                    </SplitItem>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <AppDeployModal />
                        &nbsp;
                    </SplitItem>
                    <SplitItem>
                        <AppDeploySaveRecipeModal />
                    </SplitItem>
                </Split>

            </StackItem>
            <StackItem>
                <RecipeViewer recipe={appDeploySlice}/>
            </StackItem>
        </Stack>
    );
}


