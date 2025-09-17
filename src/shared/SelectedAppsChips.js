import React from 'react';

import { Label, LabelGroup } from '@patternfly/react-core';

import { useDispatch, useSelector } from 'react-redux';

import {
    getAppNames,
} from '../store/AppDeploySlice';

export default function SelectedAppsChips({appList}) {

    const apps = useSelector(getAppNames);

    const Chips = () => {
        if (apps.length === 0) {
            return <LabelGroup categoryName='Selected Apps'>
                <Label variant="outline" key='empty' >
                    None
                </Label>
            </LabelGroup>;
        }
        if (appList) {
            return <LabelGroup categoryName='Selected Apps'>
                {appList.map(currentChip => <Label variant="outline" key={currentChip} >
                    {currentChip}
                </Label>)}
            </LabelGroup>;
        }
        return <LabelGroup categoryName='Selected Apps'>
            {apps.map(currentChip => <Label variant="outline" key={currentChip} >
                {currentChip}
            </Label>)}
        </LabelGroup>;
    }

    return < Chips />;
}