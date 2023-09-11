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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { PROPS_PANEL } from '../utils/type';
import { withRuleEnginePanel } from '../shared/withRuleEngine';

function HorizontalTabsComp(props: PROPS_PANEL) {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const mappings = useContext(FormContext).mappings;
    const items = props.visible ? props.items : [];

    const handleChange = useCallback((selectedIndex: number) => {
        console.log('values from horizontal tabs: ', selectedIndex);
        setSelectedTab(selectedIndex);
    }, []);

    const getChild = useCallback((child: any, index: number) => {
        const Comp = getRenderer(child, mappings);
        return Comp ? <Comp key={`${child.id}_${index}`} {...child} id={child.id} /> : (null);
    }, [mappings]);
    return (
        <>
            <Tabs  orientation="horizontal" index={selectedTab} onChange={handleChange}>
                <TabList overflowY="auto" sx={{
                    '::-webkit-scrollbar': { display: 'none' }
                }}>
                    <TabList variant="enclosed">
                        {
                            items.map((child: any, index: number) => (
                                <Tab id={child.id} key={`${child.id}_${index}`} >{child.label.value}</Tab>
                            ))
                        }
                    </TabList>
                </TabList>
                <TabPanels>
                {
                    items.map((child: any, index: number) => (
                        <TabPanel key={`${child.id}`}>
                            {getChild(child, index)}
                        </TabPanel>
                    ))
                }
                </TabPanels>
            </Tabs>
        </>
    );
}

export default withRuleEnginePanel(HorizontalTabsComp);