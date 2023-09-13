import React from "react";
import { LABEL_CONTAINER } from '../../utils/type';

const HelpContainer = (props: LABEL_CONTAINER) => {
  const { bemBlock, description, onClick } = props;
  return (
    <div className={`${bemBlock}__help-container`}>
      {description &&
        <button
          aria-label='Toggle Button'
          className={`${bemBlock}__questionmark`}
          onClick={onClick}></button>
      }
    </div>
  )
};

export default HelpContainer;