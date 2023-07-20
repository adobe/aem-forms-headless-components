import React from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import ReCAPTCHA from 'react-google-recaptcha';


const ReCAPTCHAComponent = (props: PROPS) => {
  const { label, enabled, visible, properties, isError, errorMessage, dispatchChange } = props;
  const config = properties ? properties['fd:captcha']?.config : {};
  return (
    <div className="cmp-adaptiveform-recaptcha" data-cmp-is="adaptiveFormRecaptcha" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible ? <div className="cmp-adaptiveform-recaptcha__label">{label.value}</div> : null}
      <div className="cmp-adaptiveform-recaptcha__widget">
        <ReCAPTCHA
          {...(config || {})}
          onChange={dispatchChange}
        />
      </div>
      {isError ? <div className="cmp-adaptiveform-recaptcha__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(ReCAPTCHAComponent);