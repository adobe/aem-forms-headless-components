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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const react_native_document_picker_1 = __importDefault(require("react-native-document-picker"));
const common_1 = require("../utils/common");
const FileUpload = (props) => {
    const { maxFileSizeInBytes, accept, multiple, onChange, value } = props;
    const [files, setFiles] = (0, react_1.useState)(value || []);
    const fileListArray = (0, react_1.useCallback)((fileList) => {
        let localFiles = [];
        fileList.forEach((file) => {
            if (file.size <= maxFileSizeInBytes) {
                localFiles.push(file);
            }
        });
        localFiles = multiple ? files.concat(localFiles) : localFiles;
        return localFiles;
    }, [maxFileSizeInBytes, multiple, files]);
    const fileSelectionHandler = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const selectedFiles = yield react_native_document_picker_1.default.pick({
                type: [...(0, common_1.FetchFileTypes)(accept)],
                allowMultiSelection: !!multiple
            });
            const previewFileList = fileListArray(selectedFiles);
            const fileList = (0, common_1.fileListConvert)(previewFileList);
            onChange(multiple ? fileList : fileList[0]);
            setFiles(previewFileList);
        }
        catch (err) {
            console.log(err);
        }
    }), [accept, multiple, onChange, fileListArray]);
    const deleteHandler = (0, react_1.useCallback)((index) => {
        const previewFileList = [...files];
        previewFileList.splice(index, 1);
        const fileList = (0, common_1.fileListConvert)(previewFileList);
        setFiles(previewFileList);
        onChange(multiple ? fileList : null);
    }, [files, onChange, multiple]);
    const imagePreview = (file, index) => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(native_base_1.Image, Object.assign({ source: { uri: file.uri } }, common_1.styles.image)),
        react_1.default.createElement(native_base_1.Button, Object.assign({ onPress: () => { deleteHandler(index); } }, common_1.styles.DeleteButton),
            react_1.default.createElement(native_base_1.MinusIcon, Object.assign({}, common_1.styles.DeleteIcon)))));
    const listPreview = (file, index) => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(native_base_1.Box, Object.assign({}, common_1.styles.PlaceholderTitleBox),
            react_1.default.createElement(native_base_1.Text, Object.assign({}, common_1.styles.PlaceholderTitleText), file.name)),
        react_1.default.createElement(native_base_1.Text, Object.assign({}, common_1.styles.PlaceholderSizeText), `${(file.size / 1000000).toFixed(2)}MB`),
        react_1.default.createElement(native_base_1.Button, Object.assign({ onPress: () => { deleteHandler(index); } }, common_1.styles.DeleteButton),
            react_1.default.createElement(native_base_1.MinusIcon, Object.assign({}, common_1.styles.DeleteIcon)))));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(native_base_1.Button, { variant: "outline", onPress: fileSelectionHandler }, "Upload"),
        react_1.default.createElement(native_base_1.HStack, Object.assign({}, common_1.styles.hstack), files.map((file, index) => (react_1.default.createElement(native_base_1.Box, Object.assign({ key: index }, common_1.styles.container), file.type === 'image/jpeg' ? imagePreview(file, index) : listPreview(file, index)))))));
};
exports.default = FileUpload;
