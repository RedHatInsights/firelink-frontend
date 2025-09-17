import React, { useEffect, useState } from 'react';
import {
	Label, LabelGroup, Stack,
	StackItem,
	Button,
	Split,
	SplitItem,
	Card,
	CardBody
} from '@patternfly/react-core';
import {
	
	
	Modal,
	ModalVariant,
	DualListSelector
} from '@patternfly/react-core/deprecated';
// Import plus and minus icons
import { PlusIcon,  TimesIcon } from '@patternfly/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getAppDeployComponents, 
    getAppNames 
} from '../store/AppDeploySlice';

export default function AppDeployRemoveSelector({title, value, onSelect, defaultValue}) {
    const dispatch = useDispatch();

    const apps = useSelector(getAppNames);
    const components = useSelector(getAppDeployComponents);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

    const [availableOptions, setAvailableOptions] = useState([]);
    const [chosenOptions, setChosenOptions] = useState([]);

    const generateOptions = () => {
        return [
            {
                id: 'apps',
                text: 'Apps',
                isChecked: false,
                checkProps: {
                'aria-label': 'Apps'
                },
                hasBadge: true,
                badgeProps: {
                isRead: true
                },
                children: apps.map((app, index) => (
                    {
                        id: crypto.randomUUID(),
                        text: "app:" + app,
                        isChecked: false,
                        checkProps: {
                          'aria-label': 'app:' + app
                        }
                      }
                ))
            },
            {
                id: 'components',
                text: 'Components',
                isChecked: false,
                checkProps: {
                'aria-label': 'Components'
                },
                hasBadge: true,
                badgeProps: {
                isRead: true
                },
                children: components.map((component, index) => (
                    {
                        id: crypto.randomUUID(),
                        text: component,
                        isChecked: false,
                        checkProps: {
                          'aria-label': component
                        }
                    }
                ))
            },    
        ]
    }   

    useEffect(() => {
        setAvailableOptions(generateOptions());
    }, [apps, components]);

    const onListChange = (event, newAvailableOptions, newChosenOptions) => {
        setAvailableOptions(newAvailableOptions.sort());
        setChosenOptions(newChosenOptions.sort());
    };

    useEffect(() => {
        // first we need to get the .children from each object in chosenOptions
        // then we need to get the .text from each of those children
        // then we need to call onSelect with the result
        const children = chosenOptions.map((option) => option.children);
        const childrenText = children.map((child) => child.map((option) => option.text));
        const flattened = childrenText.flat();
        onSelect(flattened);
    }, [chosenOptions]);


    const OptionSelectModal = () => {
        return <Modal
        variant={ModalVariant.medium}
        title={title}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        ouiaId="BasicModal">
           <Stack hasGutter>
                <StackItem>
                    <DualListSelector isSearchable isTree availableOptions={availableOptions} chosenOptions={chosenOptions} onListChange={onListChange} id="dual-list-selector-tree" />
                </StackItem>
           </Stack>
      </Modal>
    }

    const reset = () => {
        setChosenOptions([]);
        setAvailableOptions(generateOptions());
    }

    const CustomChipGroup = () => {
        if (value.length === 0) {
            return <LabelGroup>
                <Label variant="outline" key="none" >
                    {defaultValue}
                </Label>
            </LabelGroup>
        }
        return <LabelGroup>
            {value.map((currentChip) => (
                <Label variant="outline" key={currentChip} >
                    {currentChip}
                </Label>
            ))}
        </LabelGroup>
    } 

    return <React.Fragment>
        <OptionSelectModal />
        <Stack hasGutter>
            <StackItem>
                {title}
            </StackItem>
            <StackItem>
                <Card   isCompact>
                    <CardBody>
                        <CustomChipGroup />
                    </CardBody>
                </Card>
            </StackItem>
            <StackItem>
                <Split>
                    <SplitItem isFilled>
                    </SplitItem>
                    <SplitItem>
                        <Button icon={<PlusIcon />} size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                            
                        </Button>
                        {" "}
                        <Button icon={<TimesIcon />} size="sm" variant="primary" onClick={reset}>
                            
                        </Button>
                    </SplitItem>
                </Split>
            </StackItem>
        </Stack>
    </React.Fragment>
}