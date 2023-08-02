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


import {Flex, Tabs, TabList, TabPanels, Item} from '@adobe/react-spectrum';
import React, {useContext, useCallback} from 'react';
import {FormContext} from '@aemforms/af-react-renderer';
import {ContainerJson, State, CUSTOM_PROPS_KEY, TRANSLATION_ID, getOrElse} from '@aemforms/af-core';
import {getRenderer, useFormIntl} from '@aemforms/af-react-renderer';

const TabWrapper = function (props: State<ContainerJson> & { orientation?: string }) {
  // @ts-ignore
    const {mappings, form} = useContext(FormContext);
    //@ts-ignore
    const {items, label, id, visible, orientation, activeChild} = props;
    const {v: visibleItems, d: disabledIds, a: activeItem} =
        items.reduce(({v, d, a} : any, item) => {
            const isVisible = item.visible === true;
            const isEnabled = item.enabled === true;
            return {
                v: isVisible ? v.concat([item]) : v,
                //@ts-ignore
                d : !isEnabled ? d.concat([item.id]) : d,
                a : a === null && (isVisible && isEnabled) ? item : a
            };
        }, {v: [], d: [], a: null});
    //const visibleItems = items.filter(i => i.visible);
    const layout = props?.properties?.['afs:layout'] || {};
    // @ts-ignore
    //const disabledItems = items.filter(i => i.enabled === false).map(i => i.id);
    //const firstActiveItem =
    //@ts-ignore
    const activeElementId = activeChild || activeItem?.id;
    const getTabPanels = useCallback(() => {
        return (
            visibleItems.map((child: any, index: any) => {
                const Comp = getRenderer(child, mappings);
                return (<Item key={child?.id}>
                    <Comp key={`${child.id}_${index}`} {...child} />
                </Item>);
            })
        );
    }, [visibleItems, mappings]);

    const localizeTabLabel = useCallback((item: State<ContainerJson>) => {
        let defaultMessage = item?.label?.value;
        const id = getOrElse(item, [CUSTOM_PROPS_KEY, TRANSLATION_ID, 'label.value']);
        if (id) {
            const i18n = useFormIntl();
            defaultMessage = i18n.formatMessage({id, defaultMessage});
        }
        return defaultMessage;
    }, [useFormIntl]);

    const setTab = (id: string) => {
        const element = form.getElement(id);
        if (element.enabled === true) {
            //@ts-ignore
            form.setFocus(form.getElement(id));
        }
    };

    return visible ? (
        <Flex gap="size-150" wrap>
            {label && label.value && label.visible !== false ? <span id={id}>{label.value}</span> : ''}
            {(visibleItems.length > 0 ?
                (<Tabs
                    {...layout}
                    selectedKey={activeElementId}
                    disabledKeys={disabledIds}
                    aria-labelledby={id}
                    onSelectionChange={setTab}
                    orientation={orientation}>
                    <TabList>{visibleItems.map((item: any) => (
                        <Item key={item?.id}>{localizeTabLabel(item)}</Item>))}</TabList>
                    <TabPanels>{getTabPanels()}</TabPanels>
                </Tabs>) : null)}
        </Flex>) : null;
};

export default TabWrapper;
