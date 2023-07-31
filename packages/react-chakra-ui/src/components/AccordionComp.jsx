import {
  Box,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
} from "@chakra-ui/react";
import React, { useContext, useCallback } from "react";
import { useRuleEngine, FormContext } from "@aemforms/af-react-renderer";

const AccordionComp = function (fieldset) {
  const mappings = useContext(FormContext).mappings;
  const [props] = useRuleEngine(fieldset);
  const { items, visible, enabled, properties } = props;
  const { flex, textAlign, paddingBottom } = properties;

  const {visibleItems, disabledIds, activeItem} =
    items.reduce(({v, d, a}, item) => {
        const isVisible = item.visible === true;
        const isEnabled = item.enabled === true;
        return {
            v: isVisible ? v.concat([item]) : v,
            d : !isEnabled ? d.concat([item.id]) : d,
            a : a === null && (isVisible && isEnabled) ? item : a
        };
  }, {v: [], d: [], a: null});

  const handleClick = () => {
    if (disabled) {
      return; // Do nothing if the item is disabled
    }
  }

  const getItems = useCallback(() => {
    return items.map((data, index) => {
      const Comp = mappings?.[data[":type"]];
      return Comp ? (
        <AccordionItem key={`accordion-item${index}`} onClick={handleClick} isDisabled={!enabled}>
          <h2>
            <AccordionButton>
              <Box as="span" flex={flex} textAlign={textAlign}>
                {data.label.value}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={paddingBottom}>
            <Comp key={`${data.id}_${index}`} {...data} />
          </AccordionPanel>
        </AccordionItem>
      ) : null;
    });
  }, [items, mappings]);

  return visible ? <Accordion>{getItems()}</Accordion> : null;
};

export default AccordionComp;
