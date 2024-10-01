

import { FieldJson, FieldsetJson, State } from '@aemforms/af-core';
import { Handlers, WithViewState } from '@aemforms/af-react-renderer';

export type FieldViewState = WithViewState<FieldJson>;

export type PROPS = State<FieldJson & Handlers & {
  isError?: boolean,
  text?:string,
  richText?:boolean,
  layout?: {
    [key: string]: any;
  }
}>;

export type PROPS_PANEL = State<FieldsetJson> & { handlers: Handlers }

export interface TabPanelProps {
  children?: any;
  index: number;
  value: number;
}