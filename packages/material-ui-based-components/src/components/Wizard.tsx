import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { withRuleEnginePanel } from '../shared/withRuleEngine';
import { PROPS_PANEL } from '../utils/types';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';


interface TabPanelProps {
    children?: any;
    index: number;
    value: number;
}

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
    const items = props.items || [];
    const [activeStep, setActiveStep] = React.useState(0);
    const [value, setValue] = React.useState(0);

    const steps = items.map((child: any) => (
        child.label.value
    ));

    const getChild = (child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    };

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const handleNext = (newValue: number) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setValue(newValue);
    };

    const handleBack = (newValue: number) => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            {/* @ts-ignore */}
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <React.Fragment>
                {
                    items.map((child: any, index: number) => (
                        <TabPanel value={value} index={index} key={`${child.id}_${index}`}>
                            {getChild(child, index)}
                        </TabPanel>
                    ))
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={() => handleBack(value - 1)}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        color="inherit"
                        disabled={activeStep === steps.length - 1}
                        onClick={() => handleNext(value + 1)}
                        sx={{ mr: 1 }}
                    >
                        Next
                    </Button>
                </Box>
            </React.Fragment>

        </Box>
    );
}

export default withRuleEnginePanel(Wizard);