import React from "react";
import { LABEL_CONTAINER } from '../../utils/type';

const LabelContainer = (props: LABEL_CONTAINER) => {
  const { bemBlock, label, id, description, onClick } = props;
  const isFile = bemBlock === 'cmp-adaptiveform-fileinput';
  return (
    <div className={`${bemBlock}__label-container`}>
      {
        label?.visible && (
          <label className={`${bemBlock}__label`} htmlFor={`${id}${isFile ? '' : '-widget'}`}>
            {label?.value}
          </label>
        )
      }
      {
        description && (
          <button
            className={`${bemBlock}__questionmark`}
            onClick={onClick}
            aria-label='Toggle Button'
          ></button>
        )
      }
    </div>
  )
};

export default LabelContainer;