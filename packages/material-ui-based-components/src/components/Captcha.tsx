import React from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import ReCAPTCHA from 'react-google-recaptcha';
import Typography from '@mui/material/Typography';


const Captcha = (props: PROPS) => {
    const { label, description, properties } = props;

    return (
        <>
            {label?.visible ? <Typography>{label.value}</Typography> : null}
            <ReCAPTCHA
                sitekey={properties ? properties['fd:captcha'].config.siteKey : ''}
                size={properties ? properties['fd:captcha'].config.size : ''}
                theme={properties ? properties['fd:captcha'].config.theme : ''}
                type={properties ? properties['fd:captcha'].config.type : ''}
            />
            <Typography>{description}</Typography>
        </>
    );
};

export default withRuleEngine(Captcha);