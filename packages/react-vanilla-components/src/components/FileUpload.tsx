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
  type LocalFile = { uid: string, file: File | FileObject };
  // Generate a simple unique id for each file instance
  const generateUid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const wrapWithUid = (items: Array<File | FileObject> | null | undefined): LocalFile[] => {
    const list = items && (items instanceof Array ? items : [items]);
    return (list || []).map((f) => ({
      uid: generateUid(),
      file: f
    }));
  };

  let val = value && (value instanceof Array ? value : [value]);
  const [files, setFiles] = useState<LocalFile[]>(wrapWithUid(val as Array<File | FileObject>) || []);
  const [ dragOver, setDragOver ] = useState(false);

  const maxFileSizeInBytes = getFileSizeInBytes(maxFileSize);
  let multiple = props.type?.endsWith('[]') ? { multiple: true } : {};

  // Dispatch value to the model. When field supports multiple values, send array; otherwise a single item
  const fileChangeHandler = useCallback(
    (localFiles: Array<LocalFile>) => {
      const files = localFiles.map(({ file }) => file);
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

  // Handles file selection via input, drag/drop, or paste
  const fileUploadHandler = useCallback((e) => {
    e.preventDefault();
    const newFiles = Array.from<File>(e.dataTransfer?.files || e?.target?.files || e.clipboardData?.files || []);
    // Clear the input value to allow re-uploading the same file again
    if (e.target && e.target.type === 'file') {
      e.target.value = '';
    }
    if (newFiles?.length) {
      const validFiles = newFiles.filter((file: File) => file.size <= maxFileSizeInBytes);
      if (validFiles.length < newFiles.length) {
        // Show constraint message for files with size exceeding the limit
        alert(`${props.constraintMessages?.maxFileSize}`);
      }
      // Create new file entries with unique UIDs
      const wrappedNew = validFiles.map((f) => ({ uid: generateUid(), file: f }));
      const updatedFiles: LocalFile[] = [...files, ...wrappedNew];
      setFiles(updatedFiles);
      fileChangeHandler(updatedFiles);
    }
    setDragOver(false);
  },
  [files, fileChangeHandler, maxFileSizeInBytes, props?.constraintMessages]
);

  // Removes one file by its unique id and clears the input to allow re-uploading the same file
  const removeFile = useCallback(
    (uid: string) => {
      const fileList = [...files]; 
      const index = files.findIndex((f) => f.uid === uid);
      if (index === -1) {return;} 
      fileList.splice(index,1);
      setFiles(fileList);
      fileChangeHandler(fileList);
      // Clear the input value so the same file can be selected again
      if (fileInputField.current) {
        (fileInputField.current as HTMLInputElement).value = '';
      }
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
              files?.map(({ file, uid }) => (
                <li
                  className="cmp-adaptiveform-fileinput__fileitem"
                  key={uid}
                >
                  <span
                    className="cmp-adaptiveform-fileinput__filename"
                    aria-label={(file)?.name}
                  >
                    {(file)?.name}
                  </span>
                  <span className="cmp-adaptiveform-fileinput__fileendcontainer">
                    <span className="cmp-adaptiveform-fileinput__filesize">
                      {formatBytes((file)?.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(uid)}
                      className="cmp-adaptiveform-fileinput__filedelete"
                      aria-label="Remove file"
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
