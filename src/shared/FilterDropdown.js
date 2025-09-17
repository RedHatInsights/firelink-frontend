import React from 'react';
import {
	Checkbox,
	Dropdown,
	DropdownItem,
	DropdownList,
	MenuToggle
} from '@patternfly/react-core';
import {useState} from 'react';

function getUniqueValuesForPropertyInArrayOfObjects(sourceArray, sourceColumn) {
    const uniqueValues = new Set();
    sourceArray.forEach(item => {
        uniqueValues.add(String(item[sourceColumn]));
    } );
    let uniqueValuesArray = Array.from(uniqueValues);
    uniqueValuesArray = uniqueValuesArray.sort((a, b) => a.localeCompare(b));
    uniqueValuesArray.unshift("all");
    return uniqueValuesArray;
}

function ChangeFilter(column, newValue, filter, setFilter) {
    const newFilter = {...filter};
    newFilter[column] = newValue;
    setFilter(newFilter);
}

export default function FilterDropdown({sourceArray, sourceColumn, filter, setFilter}) {
    //const values = ["ready", "not ready", "all"]
    const [open, setOpen] = useState(false);
    var [selectedValue, setSelectedValue] = useState("all");
 
    const values = getUniqueValuesForPropertyInArrayOfObjects(sourceArray, sourceColumn);

    const toggle = (toggleRef) => (
        <MenuToggle ref={toggleRef} onClick={() => setOpen(!open)} isExpanded={open}>
            Filter: {selectedValue}
        </MenuToggle>
    );
  
    const items = values.map((value, i) => {
      return <DropdownItem key={value+i+"DropdownItem"}>
        <Checkbox label={value} isChecked={selectedValue === value} onChange={()=>{
            setSelectedValue(value);
            ChangeFilter(sourceColumn, value, filter, setFilter); 
            setOpen(!open)}
        } id={value+i+"Checkbox"}/>
      </DropdownItem>
    });
    
    return (
        <Dropdown
            isOpen={open}
            onSelect={() => setOpen(false)}
            onOpenChange={(isOpen) => setOpen(isOpen)}
            toggle={toggle}
        >
            <DropdownList>
                {items}
            </DropdownList>
        </Dropdown>
    );
}
