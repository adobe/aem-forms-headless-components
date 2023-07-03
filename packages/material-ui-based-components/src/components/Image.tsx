import React from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import Paper from '@mui/material/Paper';


const ImageComponent = (props: PROPS) => {
    const { value, altText } = props;

    return (
        <Paper variant="outlined">
            <img src={value} width="100%" alt={altText} />
        </Paper>
    );
};

export default withRuleEngine(ImageComponent);