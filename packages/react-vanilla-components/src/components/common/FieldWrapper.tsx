import React, { useCallback, useState } from "react";
import LabelContainer from "./LabelContainer";
import Description from "./Description";
import HelpContainer from "./HelpContainer";
import { LABEL_CONTAINER } from '../../utils/type';

const FieldWrapper = (props: LABEL_CONTAINER) => {
  const [showShortDescription, setShowShortDescription] = useState(true);
  const [showLongDescription, setShowLongDescription] = useState(false);

  const questionMarkHandler = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShowShortDescription(!showShortDescription);
    setShowLongDescription(!showLongDescription);
  }, [showShortDescription, showLongDescription]);

  const Comp = props.isHelpContainer ? HelpContainer : LabelContainer;

  return (<>
    <Comp
      bemBlock={props.bemBlock}
      label={props.label}
      id={props.id}
      description={props.description}
      onClick={questionMarkHandler}
    />
    {props.children ? props.children : null}
    <Description
      bemBlock={props.bemBlock}
      id={props.id}
      tooltip={props.tooltip}
      description={props.description}
      errorMessage={props.errorMessage}
      showShortDescription={showShortDescription}
      showLongDescription={showLongDescription}
    />
    {
      props.isError ?
        <div className={`${props.bemBlock}__errormessage`}>{props.errorMessage}</div>
        : null
    }
  </>)
};

export default FieldWrapper;