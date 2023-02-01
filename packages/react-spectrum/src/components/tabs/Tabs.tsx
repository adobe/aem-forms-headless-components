/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Flex, Tabs, TabList, TabPanels, Item} from '@adobe/react-spectrum';
import React, {useContext, useCallback} from 'react';
import {FormContext} from '@aemforms/af-react-renderer';
import {ContainerJson, State, CUSTOM_PROPS_KEY, TRANSLATION_ID, getOrElse} from '@aemforms/af-core';
import {getRenderer, useFormIntl} from '@aemforms/af-react-renderer';

const TabWrapper = function (props: State<ContainerJson> & { orientation?: string }) {
    //@ts-ignore
    const {mappings, form} = useContext(FormContext);
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
