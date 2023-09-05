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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { PROPS_PANEL, TabPanelProps } from '../utils/types';
import { withRuleEnginePanel } from '../shared/withRuleEngine';

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            aria-labelledby={`horizontal-tab-${index}`}
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

function TabsHorizontalComp(props: PROPS_PANEL) {
    const [selectedTab, setSelectedTab] = React.useState(0);
    //@ts-ignore
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];

    const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

    const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    }, []);

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} id={child.id} /> : (null);
    }, [mappings]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {
                        visibleItems.map((child: any, index: number) => (
                          child?.visible && <Tab label={child.label.value} id={child.id} key={`${child.id}_${index}`} wrapped />
                        ))
                    }
                </Tabs>
            </Box>
            {
                visibleItems.map((child: any, index: number) => (
                    <TabPanel value={selectedTab} index={index} key={`${child.id}`}>
                        {getChild(child, index)}
                    </TabPanel>
                ))
            }
        </Box>
    );
}

export default withRuleEnginePanel(TabsHorizontalComp);