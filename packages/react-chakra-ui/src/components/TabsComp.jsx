import React, { useCallback } from "react";
import { useRenderer } from "@aemforms/af-react-renderer";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import mappings from "../utils/mappings";

const TabComponent = (props) => {
  const { items, visible, properties, orientation, activeChild, label, id } = props;

  const { visibleItems, disabledIds, activeItem} =
  items.reduce(({v, d, a}, item) => {
      const isVisible = item.visible === true;
      const isEnabled = item.enabled === true;
      return {
          v: isVisible ? v.concat([item]) : v,
          d : !isEnabled ? d.concat([item.id]) : d,
          a : a === null && (isVisible && isEnabled) ? item : a
      };
  }, {v: [], d: [], a: null});

  if (!visible) return null;

  const activeElementId = activeChild || activeItem?.id;

  const getTabPanels = useCallback(() => {
    return visibleItems.map((child, index) => {
      const Comp = mappings[child[":type"]];
      return Comp ? (
        <TabPanel key={child?.label?.value}>
          <Comp key={`${child.id}_${index}`} {...child} />
        </TabPanel>
      ) : null;
    });
  }, [visibleItems]);

  return (
    <Tabs
      index={activeElementId}
      orientation={orientation}
      variant={properties?.layout?.variant}
    >
      <div>
        {properties?.tabTitle ? (
          <p
            className={properties?.className}
            dangerouslySetInnerHTML={{ __html: properties.tabTitle }}
          ></p>
        ) : null}

        {visibleItems.length > 0 ?
          (<TabList>
              {visibleItems.map(val => (
                <Tab
                  isDisabled={disabledIds}
                  aria-labelledby={id}
                  key={val.id}
                >
                  {val.label.value}
                </Tab>
              ))}
          </TabList>) : null
        }
      </div>
      <TabPanels>{getTabPanels()}</TabPanels>
    </Tabs>
  );
};

export const fieldConvertor = (a, b, f) => {
  return {
    onClick: (e) => b.dispatchClick(),
    ...a,
  };
};

const TabsComp = (props) => {
  const renderedComponent = useRenderer(props, TabComponent, fieldConvertor);
  return renderedComponent;
};

export default TabsComp;
