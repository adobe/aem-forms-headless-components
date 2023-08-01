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


import React, {useRef, useState} from 'react';

import {
    FileUploadContainer,
    FormField,
    DragDropText,
    UploadFileBtn,
    FilePreviewContainer,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    FileMetaData,
    RemoveFileIcon,
    InputLabel,
    InputDescription
} from './FileUpload.styles';
import {FileObject} from '@aemforms/af-core';

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000000;

const convertBytesToKB = (bytes: number) => Math.ceil(bytes / KILO_BYTES_PER_BYTE);

/**
 *
 * @param label
 * @param updateFilesCb (File[] => {} | File => {})
 * @param maxFileSizeInBytes
 * @param description
 * @param otherProps
 * @constructor
 */
const FileUpload = ({
                        // @ts-ignore
                        label,
                        // @ts-ignore
                        updateFilesCb,
                        maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
                         // @ts-ignore
                         description,
                        // @ts-ignore
                        value,
                        // @ts-ignore
                        multiple,
                        ...otherProps
                    }) => {
    const fileInputField = useRef(null);
    const invalid = otherProps.validationState === 'invalid';
    const helpText = invalid ? otherProps.errorMessage || '' : description || '';

    const handleUploadBtnClick = () => {
        // @ts-ignore
        fileInputField.current.click();
    };

    const fileListToArray = (newFiles: FileList) => {
        let localFiles = [];
        //@ts-ignore
        for (const file of newFiles) {
            if (file.size <= maxFileSizeInBytes) {
                localFiles.push(file);
            }
        }
        return localFiles;
    };

    const callUpdateFilesCb = (files : Array<File|FileObject>) => {
        if (multiple) {
            updateFilesCb(files);
        } else {
            updateFilesCb(files.length > 0 ? files[0] : null);
        }
    };

    function isSame(files: any[] | null, value: FileObject[] | null) {
        return (
            //both null
            (value == null && (files === null || files.length === 0)) ||
            ( value != null && files != null &&
                value.length === files.length && value.every((x, i) => {
                    return x.equals(files[i]);
                })
            )
        );
    }

    const [files, setFiles] = useState<FileObject[]>(value || []);
    // add the default values to the initial files checking the size
    //let updatedFiles: any = addNewFiles(value);
    if (!isSame(files, value)) {
        setFiles(value);
    }

    const handleNewFileUpload = (e: { target: { files: FileList; }; }) => {
        const { files: newFiles } = e.target;
        if (newFiles.length) {
            const updatedFiles = files.concat(fileListToArray(newFiles));
            setFiles(updatedFiles);
            callUpdateFilesCb(updatedFiles);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.slice(0, index).concat(files.slice(index + 1));
        setFiles(updatedFiles);
        callUpdateFilesCb(updatedFiles);
    };
    const id = otherProps.id;
    const labelProps ={id:`${id}_2`, for:id};
    const fieldProps ={id, 'aria-labelledby':`${id}_2`,'aria-describedby':`${id}_3`,'aria-invalid':invalid};
    const helpTextProps = {id:`${id}_3`};
    return (
        <>
            <FileUploadContainer isError={invalid}>
                <InputLabel {...labelProps}>{label}</InputLabel>
                <DragDropText>Drag and drop your files anywhere or</DragDropText>
                <UploadFileBtn type='button' onClick={handleUploadBtnClick}>
                    <i className="fas fa-file-upload" />
                    <span> Upload {multiple ? 'files' : 'a file'}</span>
                </UploadFileBtn>
                <FormField
                    type="file"
                    ref={fileInputField}
                    onChange={handleNewFileUpload}
                    defaultValue=""
                    disabled={otherProps.isReadOnly || otherProps.isDisabled}
                    required={otherProps.isRequired}
                    title=""
                    multiple={multiple}
                    {...otherProps}
                    {...fieldProps}
                />
            </FileUploadContainer>
            {helpText ? <InputDescription isError={invalid} {...helpTextProps}>{helpText}</InputDescription> : null}
            <FilePreviewContainer>
                <PreviewList>
                    {files && files.map((file: FileObject, index) => {
                        const fileName = file.name;
                        // @ts-ignore
                        let isImageFile = file.type?.split('/')[0] === 'image';
                        return (
                            <PreviewContainer key={fileName}>
                                <div>
                                    {isImageFile && file.data instanceof File &&  (
                                        <ImagePreview
                                            src={ URL?.createObjectURL(file.data)}
                                            alt={`file preview ${index}`}
                                        />
                                    )}
                                    <FileMetaData className="file-metadata" isImageFile={isImageFile}>
                                        <span>{file.name}</span>
                                        <aside>
                                            <span>{convertBytesToKB(file.size)} kb</span>
                                            <RemoveFileIcon
                                                className="fas fa-trash-alt"
                                                onClick={() => removeFile(index)}
                                            />
                                        </aside>
                                    </FileMetaData>
                                </div>
                            </PreviewContainer>
                        );
                    })}
                </PreviewList>
            </FilePreviewContainer>
        </>
    );
};

export default FileUpload;
