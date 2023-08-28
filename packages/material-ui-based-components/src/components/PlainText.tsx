import React from 'react';
import { withRuleEngine, richTextString } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Typography } from '@mui/material';


const PlainTextComponent = (props: PROPS) => {
    const { value, richText } = props;

    return (
        <Typography sx={{ mt: 2 }}>{richText ? richTextString(value) : value}</Typography>
    );
};

export default withRuleEngine(PlainTextComponent);