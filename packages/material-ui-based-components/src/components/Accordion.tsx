import React, { useContext } from 'react';
import { getRenderer, FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../shared/withRuleEngine';
import { PROPS_PANEL } from '../utils/types';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionComponent = function (props: PROPS_PANEL) {
    const [expanded, setExpanded] = React.useState<number>(0);
    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.items || [];

    const handleChange = (index: number) => {
        setExpanded(index);
    };

    const getChild = (child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    };


    return (
        <div>
            <div>{props?.label?.value ? <div>{props.label.value}</div> : null}</div>
            {
                items.map((child: any, index: number) => (
                    <Accordion expanded={expanded === index} onChange={() => { handleChange(index); }} key={`${child.id}_${index}`}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={child.id}
                        >
                            <Typography>
                                {child.label.value}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {getChild(child, index)}
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div>
    );
};

export default withRuleEnginePanel(AccordionComponent);