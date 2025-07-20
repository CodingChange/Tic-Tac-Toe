import React from "react";
import { View } from "react-native";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <View className="flex-1 bg-indigo-900">{children}</View>;
};

export default Wrapper;
