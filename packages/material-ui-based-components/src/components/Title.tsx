import React from 'react';
import { withRuleEngine, richTextString } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Typography } from '@mui/material';


const TitleComponent = (props: PROPS) => {
    const { text, richText } = props;

    return (
        <Typography gutterBottom>{richText ? richTextString(text) : text}</Typography>
    );
};

export default withRuleEngine(TitleComponent);