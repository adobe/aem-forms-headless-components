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