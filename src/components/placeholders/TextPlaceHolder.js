/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const SKELETON_SPEED = 1500;
export const SKELETON_BG = '#dddddd';
export const SKELETON_HIGHLIGHT = '#e7e7e7';
export const MAX_RATING_DEVIATION = 200;
const {width, height} = Dimensions.get('window');

const TextPlaceHolder = () => (
  <SkeletonPlaceholder
    speed={SKELETON_SPEED}
    backgroundColor={SKELETON_BG}
    highlightColor={SKELETON_HIGHLIGHT}>
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={[styles.skeltonMainView, {height: height / 30}]} />
    </View>
  </SkeletonPlaceholder>
);

const styles = StyleSheet.create({
  skeltonMainView: {
    width: 100,
    zIndex: 999,
    height: height / 30,
    borderWidth: 0,
    elevation: 5,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: {height: 0, width: 0},
    borderRadius: 5,
    //height: globals.screenHeight * 0.24,
  },
});

export default TextPlaceHolder;
