import React, { FunctionComponent } from 'react';
import {
  GestureResponderEvent, LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity, View,
  ViewStyle,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors, fonts } from '../../theme';

interface InputContainerProps {
  /**
   * Title, shown on the left side.
   */
  title?: string;

  /**
   * Current value of the input, shown on the right side.
   */
  value?: string;

  /**
   * A React element to add to the right side of the input container.
   */
  rightItem?: Element;

  onPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * Whether this item should flash when tapped.
   */
  opacityOnTouch?: boolean;

  /**
   * Error message for the input.
   */
  error?: string;

  style?: ViewStyle;
}

export const InputContainer: FunctionComponent<InputContainerProps> = ({
                                                                         title,
                                                                         value,
                                                                         rightItem,
                                                                         style,
                                                                         opacityOnTouch = true,
                                                                         onPress,
                                                                         onLayout,
                                                                         children,
                                                                         error,
                                                                       }) => {
  let titleText = null;
  if (title != null) {
    titleText = <Text style={styles.title}>{title}</Text>;
  }

  let valueText = null;
  if (value != null) {
    valueText = <Text style={styles.value}>{value}</Text>;
  }

  let activeOpacity = 0.2;
  if (!opacityOnTouch) {
    activeOpacity = 1;
  }

  let bottomLineColor = colors.darkGray;
  let errorText;
  if (error != null) {
    bottomLineColor = colors.lightRed;
    errorText = <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={activeOpacity}
    >
      <View style={styles.innerContainer}>
        {titleText}
        {children}
        {valueText}
        {rightItem}
      </View>
      {errorText}
      <Svg height={1} style={styles.bottomLine}>
        <Line x1="0%" x2="100%" stroke={bottomLineColor} strokeWidth={1} />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 3,
  },
  value: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.yellow,
    textAlign: 'right',
    marginBottom: 3,
  },
  bottomLine: {
    position: 'absolute',
    left: 20,
    bottom: 5,
    right: 0,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.lightRed,
    marginBottom: 10,
    marginTop: -10,
  },
});
