import React, { useContext } from 'react';
import { getRenderer, FormContext } from '@aemforms/af-react-renderer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PROPS_PANEL } from '../utils/types';
import { withRuleEnginePanel } from '../shared/withRuleEngine';

interface TabPanelProps {
  children?: any;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
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
  const [value, setValue] = React.useState(0);
  //@ts-ignore
  const mappings = useContext(FormContext).mappings;
  const items = props.items || [];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getChild = (child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  };

  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: '10%' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
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
          <TabPanel value={value} index={index} key={`${child.id}_${index}`}>
            {getChild(child, index)}
          </TabPanel>
        ))
      }
    </Box>
  );
}

export default withRuleEnginePanel(TabsVerticalComp);
