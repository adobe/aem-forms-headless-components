import React from 'react';
import { FormControl } from 'native-base';
import { getFileSizeInBytes } from '@aemforms/af-core';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';
import FileUpload from '../shared/FileUpload';

const FileUploadComponent = function (props: PROPS) {
  const {
    isError, required, label, errorMessage, description, type, accept,
    value, maxFileSize, dispatchChange
  } = props;

  const fileUploadProps = {
    value: value && ((value instanceof Array) ? value : [value]),
    onChange: dispatchChange,
    accept: accept || [],
    multiple: type === 'file[]' || type === 'string[]',
    maxFileSizeInBytes: getFileSizeInBytes(maxFileSize) || 500000000
  };

  return (
    <FormControl isInvalid={isError} isRequired={required}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <FileUpload {...fileUploadProps} />
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(FileUploadComponent);