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
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { withRuleEnginePanel } from '../shared/withRuleEngine';
import { PROPS_PANEL, TabPanelProps } from '../utils/types';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            hidden={value !== index}
            id={children.id}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Wizard(props: PROPS_PANEL) {
    //@ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];
    const [activeStep, setActiveStep] = React.useState(0);

    const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

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
        <Box sx={{ width: '100%' }} data-testid={`wizard-container-${props?.id}`}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    return (
                        <Step key={label} {...stepProps} data-testid={`tab-list-${props?.id}`}>
                            {/* @ts-ignore */}
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <React.Fragment>
                {
                    visibleItems.map((child: any, index: number) => (
                        <TabPanel data-testid={`tab-Panel-${index}`} value={activeStep} index={index} key={`${child.id}`}>
                            {getChild(child, index)}
                        </TabPanel>
                    ))
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        data-testid={`Back-btn-${props?.id}`}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        color="inherit"
                        disabled={activeStep === steps.length - 1}
                        onClick={handleNext}
                        data-testid={`Next-btn-${props?.id}`}
                    >
                        Next
                    </Button>
                </Box>
            </React.Fragment>

        </Box>
    );
}

export default withRuleEnginePanel(Wizard);