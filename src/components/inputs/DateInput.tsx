import React, { FunctionComponent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import DatePicker from 'react-native-datepicker';
import { isToday, isTomorrow } from '../../utilities';
import moment, { Moment } from 'moment';

export const DateInput: FunctionComponent = () => {
  const [date, setDate] = useState(moment());

  const datePickerRef = useRef<DatePicker>(null);

  const handleDateChange = (_: string, date: Date) => {
    setDate(moment(date));
  };

  return (
    <>
      <InputContainer title='Date' value={formatDate(date)} onPress={() => {
        const datePicker = datePickerRef.current;
        if (datePicker != null) datePicker.onPressDate();
      }}>
        <DatePicker
          showIcon={false}
          hideText={true}
          minDate={new Date()}
          date={date}
          onDateChange={handleDateChange}
          mode="date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          ref={datePickerRef}
        />
      </InputContainer>
    </>
  );
};

function formatDate(date: Moment) {
  if (isToday(date)) {
    return 'Today';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  return date.format('LL');
}