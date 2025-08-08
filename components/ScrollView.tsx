import React from "react";
import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";

export default function ScrollView(props: ScrollViewProps) {
  return <RNScrollView {...props} />;
}