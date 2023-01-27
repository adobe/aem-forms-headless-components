/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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