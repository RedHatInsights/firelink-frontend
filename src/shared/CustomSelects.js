import React from "react";
import { useState } from "react";

import {
	Select,
	SelectOption,
	SelectList,
	MenuToggle
} from '@patternfly/react-core';


const availablePools = ['default','minimal','managed-kafka','real-managed-kafka']
const availableDurations = ['1h','4h','8h']
const optionalDepsMethods = ["hyrbid", "all", "none"];
const referenceEnvironments = ["insights-stage", "insights-prod", "main branch"];
const targetEnvironments = ["insights-ephemeral", "insight-stage", "insights-prod"];

const DefaultPool = availablePools[0]
const DefaultDuration = availableDurations[0]

const SelectListComponent = ({label, value, setValue, options}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggle = (toggleRef) => (
        <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
            {value || 'Select an option'}
        </MenuToggle>
    );

    return <React.Fragment>
        {label}
        <Select
            id="select-basic"
            isOpen={isOpen}
            selected={value}
            onSelect={(_event, selection) => { setValue(selection); setIsOpen(false); }}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
        >
            <SelectList>
                {options.map((opt, index) => (
                    <SelectOption key={`${opt}-${index}`} value={opt}>
                        {opt}
                    </SelectOption>
                ))}
            </SelectList>
        </Select>
    </React.Fragment>    
}

const PoolSelectList = ({value, setValue}) => {
    return <SelectListComponent label='Pool'  value={value} setValue={setValue} options={availablePools}/>
}

const DurationSelectList = ({value, setValue}) => {
    return <SelectListComponent label='Duration'  value={value} setValue={setValue} options={availableDurations}/>
}

const OptionalDepsMethodSelectList = ({value, setValue}) => {
    return <SelectListComponent label='Optional Dependencies Method'  value={value} setValue={setValue} options={optionalDepsMethods}/>
}

const ReferenceEnvironmentSelectList = ({value, setValue, label}) => {
    return <SelectListComponent label={label}  value={value} setValue={setValue} options={referenceEnvironments}/>
}

const TargetEnvironmentSelectList = ({value, setValue}) => {
    return <SelectListComponent label='Template Parameter Value Source'  value={value} setValue={setValue} options={targetEnvironments}/>
}

export {
    SelectListComponent as SelectList, 
    PoolSelectList, 
    DurationSelectList, 
    OptionalDepsMethodSelectList, 
    ReferenceEnvironmentSelectList,
    TargetEnvironmentSelectList,
    DefaultPool, 
    DefaultDuration
}