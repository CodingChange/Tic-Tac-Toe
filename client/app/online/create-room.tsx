import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import Wrapper from "@/components/wrapper";
import { socket } from "@/libs/socket";
import { router, useLocalSearchParams } from "expo-router";

const CreateRoom = () => {
  const { roomId } = useLocalSearchParams() as { roomId: string };

  const handleUserJoined = useCallback(() => {
    router.replace({ pathname: "/online/game", params: { roomId } });
  }, [roomId]);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);

    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);
  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center gap-y-10">
        <View className="flex-row items-center">
          <Text className="text-white text-3xl font-medium">
            Your Room ID is{" "}
          </Text>
          <Text className="text-blue-500 text-3xl font-extrabold">
            {roomId}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-300 font-medium text-base">
            Waiting for other player to join{" "}
          </Text>
          <ActivityIndicator size={20} color={"white"} />
        </View>
      </View>
      <Text>CreateRoom</Text>
    </Wrapper>
  );
};

export default CreateRoom;
