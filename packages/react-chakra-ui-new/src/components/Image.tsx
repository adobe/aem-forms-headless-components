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
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/type';
import { Box, Image } from '@chakra-ui/react';


const ImageComponent = (props: PROPS) => {
    const { value, altText } = props;

    return (
        <Box boxSize='sm'>
            <Image src={value} alt={altText} />
        </Box>
    );
};

export default withRuleEngine(ImageComponent);