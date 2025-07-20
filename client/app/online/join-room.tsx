import React, { useCallback, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import Wrapper from "@/components/wrapper";
import { socket } from "@/libs/socket";
import { router } from "expo-router";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");

  const handleUserJoined = useCallback(() => {
    router.replace({ pathname: "/online/game", params: { roomId } });
  }, [roomId]);
  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center gap-y-10">
        <TextInput
          className="border-b border-b-white w-[70%] text-base text-white"
          placeholder="Enter room id"
          placeholderTextColor={"#fff"}
          keyboardType="number-pad"
          maxLength={6}
          value={roomId}
          onChangeText={(text) => setRoomId(text)}
        />

        <Pressable
          className={`bg-yellow-600 border-4 border-yellow-400 w-[70%] items-center justify-center py-3 rounded-full shadow-xl shadow-yellow-400 ${
            roomId.length !== 6 ? "opacity-60" : ""
          }`}
          onPress={() => {
            if (roomId.length !== 6) {
              return Alert.alert("Error", "Room ID must be 6 digits long");
            }

            socket.connect();
            socket.emit("join-room", { roomId });
            socket.on("user-joined", handleUserJoined);
          }}
        >
          <Text className="text-white text-2xl font-semibold">Join Room</Text>
        </Pressable>
      </View>
    </Wrapper>
  );
};

export default JoinRoom;
