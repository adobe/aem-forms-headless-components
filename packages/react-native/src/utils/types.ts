import { Handlers, WithViewState } from '@aemforms/af-react-renderer';
import { FileObject, FieldJson, State } from '@aemforms/af-core';
import { GestureResponderEvent } from 'react-native';

export type InputFieldTypes = {
  label: string, 
  description?: string, 
  errorMessage?: string, 
  isHidden: boolean, 
  isInvalid? : boolean, 
  inputProps: {[key: string] : any},
}

export type REPEATER = {
  add: boolean,
  remove: boolean,
  index: number,
  handlers: Handlers
}

export type FileUploadType = {
  maxFileSizeInBytes: number,
  accept: Array<string> | string,
  multiple: boolean,
  onChange: Function,
  value: any
}

export type FileOptions = {
  [key: string]: Array<string>
}
export type FileType  = FileObject & {
  uri?: string
}

export type Styles = {
  hstack : {
    [key: string] : string
  },
  container: {
    [key: string] : string
  },
  image: {
    [key: string] : string
  },
  DeleteButton: {
    [key: string] : string,
  },
  DeleteIcon: {
    [key: string] : string
  },
  PlaceholderTitleBox: {
    [key: string] : string
  },
  PlaceholderTitleText: {
    [key: string] : string | number,
  },
  PlaceholderSizeText: {
    [key: string] : string
  },
}

export type FieldViewState = WithViewState<FieldJson>

export type INPUT = {
  [key: string]: any,
  type: 'password' | 'text'
}

export type HandlersTypes = {
  dispatchClick: (event: GestureResponderEvent) => void,
  dispatchChange: (event: GestureResponderEvent) => void,
  dispatchBlur: (event: GestureResponderEvent) => void,
  dispatchFocus: (event: GestureResponderEvent) => void,
  isError?: boolean,
  richText?: boolean
}

export type PROPS = State<FieldJson & HandlersTypes>;