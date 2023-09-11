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
import { PROPS_PANEL } from '../utils/type';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
  } from '@chakra-ui/react';

const AccordionComponent = function (props: PROPS_PANEL) {
    const [expanded, setExpanded] = React.useState<number>(0);
    // @ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];

    const handleChange = useCallback((index: number) => {
        setExpanded(index);
    }, []);

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
    }, []);

    return (
        <div>
            {props?.label?.visible ? <div>{props.label.value}</div> : null}
            {
                <Accordion allowToggle index={expanded} onChange={(index: number) => { handleChange(index); }} isDisabled={!props.enabled}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex='1' textAlign='left'>
                            {props?.label?.richText ? richTextString(props?.label?.value) : props?.label?.value}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {
                            items.map((child: any, index: number) => (
                                getChild(child, index)
                            ))
                        }
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
            }
        </div>
    );
};

export default withRuleEnginePanel(AccordionComponent);