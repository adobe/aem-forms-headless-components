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
import FieldWrapper from './common/FieldWrapper';

const FileUpload = (props: PROPS) => {
  const fileInputField = useRef(null);
  const { id, name, value, label, required, accept, maxFileSize, visible, enabled, appliedCssClassNames } = props;
  let val = value && ((value instanceof Array) ? value : [value]);
  const [files, setFiles] = useState<FileObject[]>(val || []);

  const maxFileSizeInBytes = getFileSizeInBytes(maxFileSize);
  let newMultiple = props.type?.endsWith('[]') ? { multiple: true } : {};

  const callUpdateFilesCb = useCallback((files: Array<File | FileObject>) => {
    if (newMultiple) {
      props.dispatchChange(files);
    } else {
      props.dispatchChange(files.length > 0 ? files[0] : null);
    }
  }, [newMultiple, props.dispatchChange]);

  const fileListToArray = useCallback((newFiles: FileList) => {
    let localFiles = [];
    //@ts-ignore
    for (const file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        localFiles.push(file);
      }
    }
    return localFiles;
  }, []);

  const handleNewFileUpload = useCallback((e: { target: { files: FileList | null; }; }) => {
    const { files: newFiles } = e.target;
    if (newFiles?.length) {
      const updatedFiles = files.concat(fileListToArray(newFiles));
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  }, [setFiles, callUpdateFilesCb]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.slice(0, index).concat(files.slice(index + 1));
    setFiles(updatedFiles);
    callUpdateFilesCb(updatedFiles);
  }, [callUpdateFilesCb, setFiles]);

  const isFilled = Array.isArray(files) ? files.length : files;

  return (
    <div
      className={`cmp-adaptiveform-fileinput cmp-adaptiveform-fileinput--${isFilled ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormFileInput"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-fileinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <br />
        <label htmlFor={id} className="cmp-adaptiveform-fileinput__widgetlabel">Attach</label>
        <input
          ref={fileInputField}
          className="cmp-adaptiveform-fileinput__widget"
          id={id}
          type='file'
          name={name}
          onChange={handleNewFileUpload}
          required={required}
          accept={accept?.toString()}
          multiple
          max-file-size={maxFileSize}
          style={{ display: 'none' }}
        />
        <ul className="cmp-adaptiveform-fileinput__filelist">
          {files && files?.map((item: FileObject, index) => (
            <li className="cmp-adaptiveform-fileinput__fileitem" key={item?.name}>
              <span className="cmp-adaptiveform-fileinput__filename">{item?.name}</span>
              <span
                onClick={() => removeFile(index)}
                className="cmp-adaptiveform-fileinput__filedelete"
                aria-label={`Press Enter to delete the ${item?.name}`}
                role="button"
              >
                x
              </span>
            </li>
          ))}
        </ul>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(FileUpload);