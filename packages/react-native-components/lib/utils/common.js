"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = exports.fileListConvert = exports.FetchFileTypes = exports.fileTypes = void 0;
const react_native_document_picker_1 = __importDefault(require("react-native-document-picker"));
exports.fileTypes = {
    'image/*': [react_native_document_picker_1.default.types.images],
    'audio/*': [react_native_document_picker_1.default.types.audio],
    'video/*': [react_native_document_picker_1.default.types.video],
    'text/*': [react_native_document_picker_1.default.types.doc, react_native_document_picker_1.default.types.docx],
    'application/pdf': [react_native_document_picker_1.default.types.pdf],
    '.jpg': [react_native_document_picker_1.default.types.images],
    '.jpeg': [react_native_document_picker_1.default.types.images],
    '.png': [react_native_document_picker_1.default.types.images],
    '.gif': [react_native_document_picker_1.default.types.video],
    '.xml': [react_native_document_picker_1.default.types.plainText],
    '.bat': [react_native_document_picker_1.default.types.plainText],
    '.pdf': [react_native_document_picker_1.default.types.pdf],
    '.zip': [react_native_document_picker_1.default.types.zip],
    '.csv': [react_native_document_picker_1.default.types.csv],
    '.doc': [react_native_document_picker_1.default.types.doc],
    '.docx': [react_native_document_picker_1.default.types.docx],
    '.ppt': [react_native_document_picker_1.default.types.ppt],
    pptx: [react_native_document_picker_1.default.types.pptx],
    xls: [react_native_document_picker_1.default.types.xls],
    xlsx: [react_native_document_picker_1.default.types.xlsx],
    default: [react_native_document_picker_1.default.types.allFiles]
};
const FetchFileTypes = (accept) => {
    let acceptFileTypes = [];
    const accepts = Array.isArray(accept) ? accept : accept.split(',');
    accepts.forEach((opt) => {
        acceptFileTypes = [...acceptFileTypes, ...(exports.fileTypes[opt] || exports.fileTypes.default)];
    });
    if (!acceptFileTypes.length) {
        acceptFileTypes.push(react_native_document_picker_1.default.types.allFiles);
    }
    return acceptFileTypes;
};
exports.FetchFileTypes = FetchFileTypes;
// @ts-ignore
const fileListConvert = (files) => files.map((file) => new File([''], file.uri, Object.assign({}, file)));
exports.fileListConvert = fileListConvert;
exports.styles = {
    hstack: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    container: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '25%',
        margin: '2',
        height: '95',
        backgroundColor: 'gray.300'
    },
    image: {
        alt: 'Alternate Text',
        size: 'lg',
        borderTopRightRadius: 'xl',
        width: '100%'
    },
    DeleteButton: {
        backgroundColor: 'white',
        borderRadius: 'full',
        position: 'absolute',
        right: '-4',
        top: '-4',
        variant: 'unstyled',
        padding: '3px'
    },
    DeleteIcon: {
        color: 'red.500'
    },
    PlaceholderTitleBox: {
        padding: '2',
        marginTop: '2'
    },
    PlaceholderTitleText: {
        fontSize: '10px',
        numberOfLines: 3
    },
    PlaceholderSizeText: {
        fontSize: '10px',
        position: 'absolute',
        bottom: '2',
        left: '2'
    }
};
