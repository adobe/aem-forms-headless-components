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

import DocumentPicker from 'react-native-document-picker';
import { FileOptions, FileType, Styles } from './types';

export const fileTypes: FileOptions = {
  'image/*': [DocumentPicker.types.images],
  'audio/*': [DocumentPicker.types.audio],
  'video/*': [DocumentPicker.types.video],
  'text/*': [DocumentPicker.types.doc, DocumentPicker.types.docx],
  'application/pdf': [DocumentPicker.types.pdf],
  '.jpg': [DocumentPicker.types.images],
  '.jpeg': [DocumentPicker.types.images],
  '.png': [DocumentPicker.types.images],
  '.gif': [DocumentPicker.types.video],
  '.xml': [DocumentPicker.types.plainText],
  '.bat': [DocumentPicker.types.plainText],
  '.pdf': [DocumentPicker.types.pdf],
  '.zip': [DocumentPicker.types.zip],
  '.csv': [DocumentPicker.types.csv],
  '.doc': [DocumentPicker.types.doc],
  '.docx': [DocumentPicker.types.docx],
  '.ppt': [DocumentPicker.types.ppt],
  pptx: [DocumentPicker.types.pptx],
  xls: [DocumentPicker.types.xls],
  xlsx: [DocumentPicker.types.xlsx],
  default: [DocumentPicker.types.allFiles]
};

export const FetchFileTypes = (accept: Array<string> | string) => {
  let acceptFileTypes: Array<string> = [];
  const accepts = Array.isArray(accept) ? accept : accept.split(',');
  accepts.forEach((opt: string) => {
    acceptFileTypes = [...acceptFileTypes, ...(fileTypes[opt] || fileTypes.default)];
  });
  if (!acceptFileTypes.length) {
    acceptFileTypes.push(DocumentPicker.types.allFiles);
  }
  return acceptFileTypes;
};

// @ts-ignore
export const fileListConvert = (files: FileType[]) => files.map((file: FileType) => new File([''], file.uri, { ...file }));

export const styles: Styles = {
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
