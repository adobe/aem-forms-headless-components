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
import { getRenderer, FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel, richTextString } from '../shared/withRuleEngine';
import { PROPS_PANEL } from '../utils/types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionComponent = function (props: PROPS_PANEL) {
    const [expanded, setExpanded] = React.useState<number | null>(0);
    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];

    const handleChange = useCallback((index: number) => {
        setExpanded(index===expanded ? null : index);
    }, [expanded]);

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, []);

    const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

    return (
        <div>
            {props?.label?.visible ? <div>{props.label.value}</div> : null}
            {
                visibleItems.map((child: any, index: number) => (
                    <Accordion expanded={expanded === index} onChange={() => { handleChange(index); }} key={`${child.id}`} disabled={!props.enabled}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={child.id}
                        >
                            <Typography data-testid={`title-accordion-${props?.id}`}>
                                {child.label.richText ? richTextString(child.label.value) : child.label.value}
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
