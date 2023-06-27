import React from 'react';
import { withRuleEngine, richTextString } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Typography } from '@mui/material';


const TitleComponent = (props: PROPS) => {
    const { text } = props;

    return (
        <Typography gutterBottom>{richTextString(text)}</Typography>
    );
};

export default withRuleEngine(TitleComponent);