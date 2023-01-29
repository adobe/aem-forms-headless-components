import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Input, View, IconButton, Image } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { combineConvertors, baseConvertor, dateFieldConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const DatePickerWrapper = (props: any) => {
  const { value, onChange, confirmBtnText, cancelBtnText, mode } = props;
  const [isPickerShow, setIsPickerShow] = useState(false);

  const showPicker = useCallback(() => {
    setIsPickerShow(true);
  }, []);

  const changeHandler = (event: any, val: Date | undefined) => {
    setIsPickerShow(false);
    onChange(val);
  };

  return (
    <View>
      {Platform.OS === 'ios' && (
        <DatePicker
          date={value}
          onDateChange={onChange}
          confirmBtnText={confirmBtnText}
          cancelBtnText={cancelBtnText}
          mode={mode}
          style={{ width: '100%' }}
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: 0
            },
            dateInput: {
              borderColor: '#d4d4d4',
              borderRadius: 4,
              height: 40,
              alignItems: 'flex-start',
              paddingLeft: 10
            }
          }}
        />
      )}
      {Platform.OS === 'android' && (
        <View>
          <View style={{ position: 'relative' }}>
            <Input isReadOnly value={value} size='lg' style={{ width: '100%' }} />
            <View style={{ position: 'absolute', right: 0, top: -8 }}>
              <IconButton onPress={showPicker} icon={<Image size={10} source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABA9JREFUeJztm81vG0UYxp+ZdRzsqAmtjZBV81kKEmrPVEpDcSNRCSGkXihcOMIBCQTqH0CPDTlSCf4ApJLe2kpIUORGNBECWgVICyWtDXVKYpo6/og33vXOvhyCIMYrxjvZeJ1kfjfPvvO+zzya2X0VTQDNzoapTpyYnY3uLlWPGkS0lBjKvnrggB2kMBnT09MxU7AXiIgiwrqcyWQaKnmUDMhmv0+6EWsS4M/+PfRTFM6RkZGRZZV8fpmc/C5lw/mac+xbG3HnHI7Dx4aH//Sbi6sIEEbz/XWLB4CDNiLvquRSocmd9/5dPADw/REX76jkUjKAMdrfPkrPqORSqg96wmN0X/uYHCUDyOvoECm/T8Ksr2TAdqJj1xbOjJ9g+dyYW8in5188zmtPH2x5PvTzDPae/zRwgV4Ujr8Br/qpS+eJP/LYXTz51MnU2yc/6yRXRzug+OGpj/HlxbP0y4+PsnqtZ3cNN2sMN2fT+OLC2eLYB590NEcWsHBm/IQ7lX0LjrNxhd1CCLhT2TfvfjT+uixUagDL58b+u/imEG1xtnD9SNwQHdUXAsZvudOyXFID3EI+vf531bbR8BBgOQJVa/ObQT/13Tu398ryyXeAudISUzIbYB4CyHWwvKrUjfqiZDbAHI/6or0+M+vS9clfaEQtP20hwG7eaI/79TosD2OCxhYC7MZM2zi/PqNUP+J3gsE56OoU2J4EaHgUjAi4cgn82jcw+OZ/IAzOQTPfgu9Ogo4cAxGBX/4cmL2qVF/aByy8fLhlC9wzTZRWLc/YROwBJOMx3yL84Ld+6uKV/12jb8uSsTjife0bJ97Xh0Rscxe/GfV9HwHGgPTgLtQsG6bT/Kf4rmhU/Y8LIdb3bQCwdm4G+6MY7I+qTN8wQdbv2ba2W2gDwhYQNjveAOmLc6lcIVlML5N8cCjYPmC7oQ0IW0DY7HgDlDrBe0v3UTfNlrGBgTgeSiR64rkflAyomyYqlVrLGAcDEr3x3A87/ghoA8IWEDZK74CBgfjamVtHPB7vmed+0K1wt4T0KroP8D0D4X/ndR8QINqAsAWEje4DZAG6D9jm6D7A9wyE/53XfUCAaAPCFhA2ug+QBSzeL1HEMJSSh41wHDycTGysD1hZqQenqMvUVkxpjNSA4mLRJdp6zSARYbFYlF5flRpgNpr5wvwCtpIJRITC/B+wbOuWLFZ+U5TRueVyGXO38yhXqnA8bmn2CsJxUC5XMXcrh+VyBQDOyeZIvwKGsE47kehrq6uNx3+/Mx+Ezu7gUs7qN8ZkYdIdkMlkykDfqOvSD8Eo6wrXuMtGXzp0qCoL7Phq3cTEhLEnlX6FETsKRslu/o9QJ7iMuwxY4i77avL55y6cYqx79/c1Go1mq/IXVr8zUhJfa5MAAAAASUVORK5CYII=' }} alt='calendar' />} />
            </View>
          </View>
          {isPickerShow &&
            <DateTimePicker
              value={value || new Date()}
              mode={mode}
              display='default'
              is24Hour={true}
              onChange={changeHandler}
            />}
        </View>
      )}
    </View>
  );
};

const Comp = InputField(DatePickerWrapper);
const DateFieldComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, dateFieldConvertor));
  return renderedComponent;
};

export default DateFieldComponent;