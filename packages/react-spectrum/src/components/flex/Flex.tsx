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

import { Grid } from '@adobe/react-spectrum';
import React, { useContext, useCallback } from 'react';
import {FormContext, getRenderer} from '@aemforms/af-react-renderer';

const FlexWrapper = function (props: any) {
  // @ts-ignore
  const mappings = useContext(FormContext).mappings;
  const { items, visible, columns } = props;

  const getItem = useCallback((child: any, index: any) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  }, [mappings]);

  return visible && items.length ? (
    <Grid
      columns={columns}
      gap='size-10'
    >
      {items.map((child: any, index: Number) => getItem(child, index))}
    </Grid>
  ) : (null);
};

export default FlexWrapper;