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


import FileUpload from './fileupload/FileUpload';
import {FieldJson, State} from '@aemforms/af-core';
import {useRenderer} from '@aemforms/af-react-renderer';
import React from 'react';
import {baseConvertor, combineConvertors, constraintConvertor, formatedErrorMessage} from '../utils/SpectrumMappers';
import {getFileSizeInBytes} from '@aemforms/af-core';

const mapper = combineConvertors(baseConvertor, constraintConvertor, (a, b) => {
    let val = a.value && ((a.value instanceof Array) ? a.value : [a.value]);
    const errorMessage = formatedErrorMessage(a);
    return {
        isReadOnly : a.readOnly === true,
        isRequired : a.required === true,
        updateFiles : b.dispatchChange,
        maxFileSizeInBytes : getFileSizeInBytes(a.maxFileSize),
        value : val,
        ...(a.type?.endsWith('[]') ? {
            multiple: true
        } : {}),
        accept: a.accept,
        errorMessage,
        // @ts-ignore
        id:a.id
    };
});

const FileUploadWrapper = (props: any) => {
    const handleChange = (files: File[]) => {
        // todo: this can be array of mixed types (ie) Array<File | FileObject>
        props.updateFiles(files);
    };
    return <FileUpload {...props} updateFilesCb={handleChange}/>;
};

const FileUploadComponent = function (originalProps: State<FieldJson>) {
    return useRenderer(originalProps, FileUploadWrapper, mapper, true);
};


export default FileUploadComponent;
