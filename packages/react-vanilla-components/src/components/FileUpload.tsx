// *******************************************************************************
//  * Copyright 2023 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/fileinput/v1/fileinput/fileinput.html
//  ******************************************************************************

import React, { useCallback, useRef, useState } from 'react';
import { FileObject } from '@aemforms/af-core';
import { getFileSizeInBytes } from '@aemforms/af-core';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import { formatBytes, syncAriaDescribedBy } from '../utils/utils';
import FieldWrapper from './common/FieldWrapper';

const FileUpload = (props: PROPS) => {
  const fileInputField = useRef(null);
  const {
    id,
    name,
    value,
    label,
    required,
    accept,
    maxFileSize,
    visible,
    enabled,
    appliedCssClassNames,
    properties,
    valid
  } = props;
  let val = value && (value instanceof Array ? value : [value]);
  const [files, setFiles] = useState<FileObject[]>(val || []);
  const [ dragOver, setDragOver ] = useState(false);

  const maxFileSizeInBytes = getFileSizeInBytes(maxFileSize);
  let multiple = props.type?.endsWith('[]') ? { multiple: true } : {};

  const fileChangeHandler = useCallback(
    (files: Array<File | FileObject>) => {
      if (multiple) {
        props.dispatchChange(files);
      } else {
        props.dispatchChange(files.length > 0 ? files[0] : null);
      }
    },
    [multiple, props.dispatchChange]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const fileUploadHandler = useCallback((e) => {
    e.preventDefault();
    const newFiles = Array.from<File>(e.dataTransfer?.files || e?.target?.files || e.clipboardData?.files || []);
    if (newFiles?.length) {
      const validFiles = newFiles.filter((file: File) => file.size <= maxFileSizeInBytes);
      if (validFiles.length < newFiles.length) {
        // Show constraint message for files with size exceeding the limit
        alert(`${props.constraintMessages?.maxFileSize}`);
      }
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles as FileObject[]);
      fileChangeHandler(updatedFiles);
    }
    setDragOver(false);
  },
  [files, fileChangeHandler, maxFileSizeInBytes, props?.constraintMessages]
);

  const removeFile = useCallback(
    (index: number) => {
      const fileList = [...files];
      fileList.splice(index,1);
      setFiles(fileList);
      fileChangeHandler(fileList);
    },
    [files, fileChangeHandler]
  );

  const isFilled = Array.isArray(files) ? files.length : files;

  return (
    <div
      className={`cmp-adaptiveform-fileinput cmp-adaptiveform-fileinput--${
        isFilled ? 'filled' : 'empty'
      } ${appliedCssClassNames || ''}`}
      id={id}
      data-cmp-is="adaptiveFormFileInput"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock="cmp-adaptiveform-fileinput"
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <br />
        <div className="cmp-adaptiveform-fileinput__container">
          <div
            className={dragOver ? 'cmp-adaptiveform-fileinput__dragarea cmp-adaptiveform-fileinput__dragarea--active' : 'cmp-adaptiveform-fileinput__dragarea'}
            onDragOver={handleDragOver}
            onDrop={fileUploadHandler}
            onDragLeave={handleDragLeave}
            onPaste={fileUploadHandler}
          >
            <div className="cmp-adaptiveform-fileinput__icon"></div>
            <div className="cmp-adaptiveform-fileinput__dragtext">
              {properties?.dragDropText}
            </div>
            <label
              htmlFor={`${id}_widget`}
              className="cmp-adaptiveform-fileinput__widgetlabel"
            >
              Attach
            </label>
            <input
              ref={fileInputField}
              className="cmp-adaptiveform-fileinput__widget"
              id={`${id}_widget`}
              type="file"
              name={name}
              onChange={fileUploadHandler}
              required={required}
              accept={accept?.toString()}
              multiple
              max-file-size={maxFileSize}
              style={{ display: 'none' }}
              aria-invalid={!valid}
              aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
            />
          </div>
          <ul className="cmp-adaptiveform-fileinput__filelist">
            {files &&
              files?.map((item: FileObject, index) => (
                <li
                  className="cmp-adaptiveform-fileinput__fileitem"
                  key={item?.name}
                >
                  <span
                    className="cmp-adaptiveform-fileinput__filename"
                    aria-label={item?.name}
                  >
                    {item?.name}
                  </span>
                  <span className="cmp-adaptiveform-fileinput__fileendcontainer">
                    <span className="cmp-adaptiveform-fileinput__filesize">
                      {formatBytes(item?.size)}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="cmp-adaptiveform-fileinput__filedelete"
                      role="button"
                    >
                      x
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(FileUpload);
