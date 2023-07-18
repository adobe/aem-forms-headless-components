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

    const steps = items.map((child: any) => (
        child.label.value
    ));

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, [mappings]);

    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            {/* @ts-ignore */}
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <React.Fragment>
                {
                    items.map((child: any, index: number) => (
                        <TabPanel value={activeStep} index={index} key={`${child.id}`}>
                            {getChild(child, index)}
                        </TabPanel>
                    ))
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        color="inherit"
                        disabled={activeStep === steps.length - 1}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Box>
            </React.Fragment>

        </Box>
    );
}

export default withRuleEnginePanel(Wizard);