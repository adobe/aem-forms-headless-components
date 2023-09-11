/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

import React, { useCallback, useContext } from 'react';
import { Button, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { withRuleEnginePanel } from '../shared/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';

function Wizard(props: PROPS_PANEL) {
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = items.map((child: any) => (
        child.label.value
    ));

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, [mappings]);

    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);

    return (
            <Tabs isFitted index={activeStep}>
                <TabList>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        return (
                            <Tab sx={{ opacity: '1 !important', cursor: 'inherit !important' }} isDisabled key={label} {...stepProps}>
                                {label}
                            </Tab>
                        );
                    })}
                </TabList>
                <Box sx={{ display: 'flex', flexDirection: 'row', margin: '5px' }}>
                    <Button
                        isDisabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        isDisabled={activeStep === steps.length - 1}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Box>
                <TabPanels>
                {
                    items.map((child: any, index: number) => (
                        <TabPanel index={index} key={`${child.id}`}>
                            {getChild(child, index)}
                        </TabPanel>
                    ))
                }
                </TabPanels>
            </Tabs>
    );
}

export default withRuleEnginePanel(Wizard);