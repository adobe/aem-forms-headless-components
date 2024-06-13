import React, {useCallback} from 'react';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { withRuleEngine } from '../utils/withRuleEngine';
import { syncAriaDescribedBy } from '../utils/utils';

const TelephoneInput = (props: PROPS) => {
    const { id, label, name, value, required, readOnly, visible, enabled, placeholder, appliedCssClassNames, valid, minLength, maxLength } = props;

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const thisVal = event.target.value;
        props.dispatchChange(thisVal);
      }, [props.dispatchChange]);

      const handleBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatchBlur(event.target.value);
      }, [props.dispatchBlur]);
    
      const handleFocus = useCallback(() => {
        props.dispatchFocus();
      }, [props.dispatchFocus]);

    
   return (
     <div className={`cmp-adaptiveform-telephoneinput cmp-adaptiveform-telephoneinput--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
       id={id}
       data-cmp-is="adaptiveFormTelephoneInput"  
       data-cmp-visible={visible} 
       data-cmp-enabled={enabled} 
       data-cmp-required={required} 
       data-cmp-valid={valid}
      >
       <FieldWrapper
        bemBlock='cmp-adaptiveform-telephoneinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <input
          type="tel"
          id={`${id}-widget`}
          className={'cmp-adaptiveform-telephoneinput__widget'}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={!enabled}
          minLength={minLength}
          maxLength={maxLength}
          name={name}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        />
      </FieldWrapper>
    </div>
   );
};

export default withRuleEngine(TelephoneInput);