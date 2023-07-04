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
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className='FlexWidth'
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TabsVerticalComp(props: PROPS_PANEL) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  //@ts-ignore
  const mappings = useContext(FormContext).mappings;
  const items = props.visible ? props.items : [];

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);

  const getChild = useCallback((child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} id={child.id} /> : (null);
  }, [mappings]);

  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: '10%' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedTab}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {
          items.map((child: any, index: number) => (
            <Tab label={child.label.value} id={child.id} key={`${child.id}_${index}`} wrapped />
          ))
        }
      </Tabs>
      {
        items.map((child: any, index: number) => (
          <TabPanel value={selectedTab} index={index} key={`${child.id}`}>
            {getChild(child, index)}
          </TabPanel>
        ))
      }
    </Box>
  );
}

export default withRuleEnginePanel(TabsVerticalComp);