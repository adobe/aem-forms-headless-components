import { FieldJson, FieldsetJson, State } from '@aemforms/af-core';
import { Handlers, WithViewState } from '@aemforms/af-react-renderer';

export type FieldViewState = WithViewState<FieldJson>;

export type PROPS = State<FieldJson & Handlers>;

export type PROPS_PANEL = State<FieldsetJson> & { handlers: Handlers }
