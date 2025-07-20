import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import Logo from "@/components/logo";
import Wrapper from "@/components/wrapper";

import { socket } from "@/libs/socket";
import { router } from "expo-router";

const OnlineMultiplayer = () => {
  const handleCreateRoom = useCallback(() => {
    socket.connect();
    socket.emit("create-room");
    socket.on("room-created", handleRoomCreated);
  }, []);

  const handleRoomCreated = useCallback(({ roomId }: { roomId: string }) => {
    router.push({ pathname: "/online/create-room", params: { roomId } });
  }, []);
  return (
    <Wrapper>
      <View className="flex-1 items-center justify-center gap-y-16">
        <Logo />

        <View className="gap-y-5 w-full items-center">
          <Pressable
            className="bg-emerald-600 w-[70%] justify-center items-center py-3 rounded-full border-4 border-green-400 shadow-xl shadow-green-400"
            onPress={handleCreateRoom}
          >
            <Text className="text-white text-2xl font-semibold">
              Create Room
            </Text>
          </Pressable>
          <Pressable
            className="bg-yellow-600 w-[70%] justify-center items-center py-3 rounded-full border-4 border-yellow-400 shadow-xl shadow-yellow-400"
            onPress={() => router.push("/online/join-room")}
          >
            <Text className="text-white text-2xl font-semibold">Join Room</Text>
          </Pressable>
        </View>
      </View>
    </Wrapper>
  );
};

export default OnlineMultiplayer;
