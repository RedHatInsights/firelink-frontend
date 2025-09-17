import React, {useEffect, useState} from "react";
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
    getDarkMode
} from "../store/AppSlice";
import {
    createStoreOptionsFromApps,
    getStoreOptions,
    getStoreSelectedParameters,
    setStoreSelectedParameters
} from "../store/ParamSelectorSlice";
import ParamInput from "./ParamInput";

export default function SetParameters() {

    const DARK_GRAY = "#26292d";
    const WHITE = "#FFFFFF";
    const PARAMETER_SELECT_CARD_STYLE = {height: "30rem", overflow: "auto", backgroundColor: "#FFFFFF"}

    const dispatch = useDispatch();

    const options = useSelector(getStoreOptions);
    const selectedParameters = useSelector(getStoreSelectedParameters);
    const apps = useSelector(getAppDeployApps);
    const darkMode = useSelector(getDarkMode);

    const setStoreSetParameter = (param) => dispatch(setSetParameter(param));
    const createOptionsFromApps = (apps) => dispatch(createStoreOptionsFromApps(apps));
    const setSelectedParameters = (params) => dispatch(setStoreSelectedParameters(params));


    const [cardBodyStyle, setCardBodyStyle] = useState(PARAMETER_SELECT_CARD_STYLE)

    useEffect(() => {
        const color = darkMode ? DARK_GRAY : WHITE
        setCardBodyStyle({...PARAMETER_SELECT_CARD_STYLE, backgroundColor: color})
    }, [darkMode])

    useEffect(() => {
        if (apps.length > 0) {
            createOptionsFromApps(apps)
        }
    }, [apps])

    useEffect(() => {
        // Need to send the selected params and their values to the store
        // First, we need to turn it into an object with key-value pairs of the form "component/param": "value"
        const selectedParams = selectedParameters.reduce((acc, param) => {
            acc[param.component + "/" + param.name] = param.value;
            return acc;
        }, {});
        setStoreSetParameter(selectedParams);
    }, [selectedParameters]);
    



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