import React, { useState, useCallback } from 'react';
import { Button, Image, Text, HStack, Box, MinusIcon } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import { FetchFileTypes, fileListConvert, styles } from '../utils/common';
import { FileUploadType, FileType } from '../utils/types';

const FileUpload = (props: FileUploadType) => {
  const { maxFileSizeInBytes, accept, multiple, onChange, value } = props;
  const [files, setFiles] = useState<FileType[]>(value || []);

  const fileListArray = useCallback((fileList: FileType[]) => {
    let localFiles: FileType[] = [];
    fileList.forEach((file: FileType) => {
      if (file.size <= maxFileSizeInBytes) {
        localFiles.push(file);
      }
    });
    localFiles = multiple ? files.concat(localFiles) : localFiles;
    return localFiles;
  }, [maxFileSizeInBytes, multiple, files]);

  const fileSelectionHandler = useCallback(async () => {
    try {
      const selectedFiles: any[] = await DocumentPicker.pick({
        type: [...FetchFileTypes(accept)],
        allowMultiSelection: !!multiple
      });
      const previewFileList: Array<FileType> = fileListArray(selectedFiles);
      const fileList = fileListConvert(previewFileList);
      onChange(multiple ? fileList : fileList[0]);
      setFiles(previewFileList);
    } catch (err) {
      console.log(err);
    }
  }, [accept, multiple, onChange, fileListArray]);

  const deleteHandler = useCallback((index: number) => {
    const previewFileList = [...files];
    previewFileList.splice(index, 1);
    const fileList = fileListConvert(previewFileList);
    setFiles(previewFileList);
    onChange(multiple ? fileList : null);
  }, [files, onChange, multiple]);

  const imagePreview = (file: FileType, index: number) => (
    <>
      <Image source={{ uri: file.uri }} {...styles.image} />
      <Button onPress={() => { deleteHandler(index); }} {...styles.DeleteButton}>
        <MinusIcon {...styles.DeleteIcon} />
      </Button>
    </>
  );

  const listPreview = (file: FileType, index: number) => (
    <>
      <Box {...styles.PlaceholderTitleBox}>
        <Text {...styles.PlaceholderTitleText}>{file.name}</Text>
      </Box>
      <Text {...styles.PlaceholderSizeText}>{`${(file.size / 1000000).toFixed(2)}MB`}</Text>
      <Button onPress={() => { deleteHandler(index); }} {...styles.DeleteButton}>
        <MinusIcon {...styles.DeleteIcon} />
      </Button>
    </>
  );

  return (
    <>
      <Button variant="outline" onPress={fileSelectionHandler}>Upload</Button>
      <HStack {...styles.hstack}>
        {files.map((file: FileType, index: number) => (
          <Box key={index} {...styles.container}>
            {file.type === 'image/jpeg' ? imagePreview(file, index) : listPreview(file, index)}
          </Box>
        ))}
      </HStack>
    </>
  );
};

export default FileUpload;
