import React, {useEffect, useState, useMemo, useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    TreeView,
    Grid,
    GridItem,
    Card,
    CardTitle,
    CardBody,
    Stack,
    StackItem,
    Content,
    ContentVariants,
} from '@patternfly/react-core';
import {
    getAppDeployApps,
    setSetParameter
} from "../store/AppDeploySlice";
import {
    createStoreOptionsFromApps,
    getStoreOptions,
    getStoreSelectedParameters,
    setStoreSelectedParameters
} from "../store/ParamSelectorSlice";
import ParamInput from "./ParamInput";

export default function SetParameters() {

    const PARAMETER_SELECT_CARD_STYLE = useMemo(() => ({height: "30rem", overflow: "auto"}), []);

    const dispatch = useDispatch();

    const options = useSelector(getStoreOptions);
    const selectedParameters = useSelector(getStoreSelectedParameters);
    const apps = useSelector(getAppDeployApps);

    const setStoreSetParameter = useCallback((param) => dispatch(setSetParameter(param)), [dispatch]);
    const createOptionsFromApps = useCallback((apps) => dispatch(createStoreOptionsFromApps(apps)), [dispatch]);
    const setSelectedParameters = useCallback((params) => dispatch(setStoreSelectedParameters(params)), [dispatch]);


    const [cardBodyStyle, setCardBodyStyle] = useState(PARAMETER_SELECT_CARD_STYLE)

    useEffect(() => {
        setCardBodyStyle(PARAMETER_SELECT_CARD_STYLE)
    }, [PARAMETER_SELECT_CARD_STYLE])

    useEffect(() => {
        if (apps.length > 0) {
            createOptionsFromApps(apps)
        }
    }, [apps, createOptionsFromApps])

    useEffect(() => {
        // Need to send the selected params and their values to the store
        // First, we need to turn it into an object with key-value pairs of the form "component/param": "value"
        const selectedParams = selectedParameters.reduce((acc, param) => {
            acc[param.component + "/" + param.name] = param.value;
            return acc;
        }, {});
        setStoreSetParameter(selectedParams);
    }, [selectedParameters, setStoreSetParameter]);
    



    const onSelect = (_event, treeViewItem) => {
        if (treeViewItem && !treeViewItem.children) {
            //First see if we have to remove it
            const index = selectedParameters.findIndex((param) => param.id === treeViewItem.id)
            if (index !== -1) {
                const newParams = selectedParameters.filter((param) => param.id !== treeViewItem.id)
                setSelectedParameters(newParams)
            } else {
                setSelectedParameters([...selectedParameters, treeViewItem])
            }
        }
    }


    const handleParamChange = (updatedParam) => {
        const newParams = selectedParameters.map((param) =>
            param.id === updatedParam.id ? updatedParam : param
        );
        setSelectedParameters(newParams);
    };

    return <Stack>
        <StackItem>
            <Content>
                <Content component={ContentVariants.h1}>
                    Override Deploy Template Parameters
                </Content>
            </Content>
        </StackItem>
        <StackItem>
            <Grid hasGutter isFullHeight>
                <GridItem span={6}>
                    <Card isFullHeight >
                        <CardTitle>
                            <h3>Available Parameters</h3>
                        </CardTitle>
                        <CardBody style={cardBodyStyle}>
                            <TreeView data={options} activeItems={selectedParameters} onSelect={onSelect} hasGuides={true} useMemo={true} />
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem span={6}>
                    <Card isFullHeight >
                        <CardTitle>
                            <h3>Selected Parameters</h3>
                        </CardTitle>
                        <CardBody style={cardBodyStyle}>
                            &nbsp;
                            <Stack hasGutter={true}>
                                {selectedParameters.map((param) => {
                                    return <ParamInput key={param.id} param={param} onParamChange={handleParamChange} />
                                })}    
                            </Stack> 
                            &nbsp;
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
        </StackItem>
    </Stack> 

}