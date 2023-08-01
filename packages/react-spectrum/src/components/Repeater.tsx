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

import React from 'react';
import Add from '@spectrum-icons/workflow/Add';
import Remove from '@spectrum-icons/workflow/Remove';
import {ActionButton, ButtonGroup} from '@adobe/react-spectrum';
import {Handlers} from '@aemforms/af-react-renderer';

const Repeater = ({add, remove, index, handlers}:{
                      add: boolean,
                      remove: boolean,
                      index: number,
                      handlers: Handlers
                  }) => {
    return (<ButtonGroup marginStart="1rem" gap="10px">
        {
            add ? (<ActionButton onPress={() => handlers.dispatchAddItem(index + 1)} variant="primary">
                <Add/>
            </ActionButton>) : ''
        }
        {
            remove ? (<ActionButton onPress={() => handlers.dispatchRemoveItem(index)}>
                <Remove/>
            </ActionButton>) : ''
        }
    </ButtonGroup>);
};

export default Repeater;