import { Pressable, Text, View } from "react-native";

import Logo from "@/components/logo";
import Wrapper from "@/components/wrapper";
import { router } from "expo-router";

export default function Index() {
  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center gap-y-16">
        <Logo />

        <View className="gap-y-7 w-full items-center">
          <Pressable
            className="bg-emerald-600 w-[70%] items-center justify-center py-3 rounded-full border-4 border-green-400 shadow-xl shadow-green-400"
            onPress={() => router.push("/offline/game")}
          >
            <Text className="text-white text-2xl font-semibold">
              Offline Play
            </Text>
          </Pressable>
          <Pressable
            className="bg-yellow-600 w-[70%] items-center justify-center py-3 rounded-full border-4 border-yellow-400 shadow-xl shadow-yellow-400"
            onPress={() => router.push("/online")}
          >
            <Text className="text-white text-2xl font-semibold">
              Online Multiplayer
            </Text>
          </Pressable>
        </View>
      </View>
    </Wrapper>
  );
}
