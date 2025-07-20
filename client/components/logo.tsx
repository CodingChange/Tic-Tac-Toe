import React from "react";
import { Text, View } from "react-native";

const Logo = () => {
  return (
    <View className="items-center justify-center gap-y-5 w-[50%] py-6 border-4 border-blue-500 rounded-lg">
      <Text className="text-6xl font-extrabold text-rose-500">Tic</Text>
      <Text className="text-6xl font-extrabold text-yellow-500">Tac</Text>
      <Text className="text-6xl font-extrabold text-green-500">Toe</Text>
    </View>
  );
};

export default Logo;
