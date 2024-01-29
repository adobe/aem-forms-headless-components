/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

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
    <FormControl isInvalid={isError} isRequired={required} {...props.layout}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <FileUpload {...fileUploadProps} />
      {errorMessage ? <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage> : null}
      {description && !errorMessage ? <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText> : null}
    </FormControl>
  );
};

export default withRuleEngine(FileUploadComponent);