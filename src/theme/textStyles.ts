import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const textStyles = StyleSheet.create({
  body: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  info: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 27,
  },
  infoLabel: {
    color: colors.white,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  infoTail: {
    color: colors.gray,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
