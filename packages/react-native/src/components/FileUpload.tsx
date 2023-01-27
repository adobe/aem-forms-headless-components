import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { combineConvertors, baseConvertor, fileUploadConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';
import FileUpload from '../shared/FileUpload';

const Comp = InputField(FileUpload);
const FileUploadComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, fileUploadConvertor));
  return renderedComponent;
};

export default FileUploadComponent;