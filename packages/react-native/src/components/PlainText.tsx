import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from 'native-base';
import RenderHtml from 'react-native-render-html';
import withRuleEngine from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';

const PlainTextComponent = function (props: PROPS) {
  const { width } = useWindowDimensions();
  
  if (props.richText) {
    return (
      <RenderHtml
        contentWidth={width}
        source={{ html: props?.value }}
      />
    );
  } else {
    return (
      <Text>{props.value || ''}</Text>
    );
  }
};

export default withRuleEngine(PlainTextComponent);