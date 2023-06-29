import { FieldJson, FieldsetJson, State } from '@aemforms/af-core';
import { Handlers, WithViewState } from '@aemforms/af-react-renderer';

export type FieldViewState = WithViewState<FieldJson>;

export type PROPS = State<FieldJson & Handlers & {
  isError?: boolean,
  layout?: {
    [key: string]: any
  }
  text?:string,
  richText?:boolean
}>;

export type PROPS_PANEL = State<FieldsetJson> & { handlers: Handlers }
