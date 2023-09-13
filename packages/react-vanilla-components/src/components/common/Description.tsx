import React from "react";
import { LABEL_CONTAINER } from '../../utils/type';

const Description = (props: LABEL_CONTAINER) => {
  const { bemBlock, tooltip, errorMessage, description, showShortDescription, showLongDescription } = props;
  return (<>
    {
      showShortDescription && tooltip && (
        <div
          title='Help Text'
          data-cmp-visible={showShortDescription}
          className={`${bemBlock}__shortdescription`}
        >
          {tooltip}
        </div>
      )
    }
    <div aria-live="polite">
      {showLongDescription && description && !errorMessage && (
        <div
          title='Help Text'
          data-cmp-visible={showLongDescription}
          className={`${bemBlock}__longdescription`}
        >
          {description}
        </div>
      )
      }
    </div>
  </>)
};

export default Description;