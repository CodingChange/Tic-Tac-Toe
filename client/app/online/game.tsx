import { Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

import Board from "@/components/board";
import Wrapper from "@/components/wrapper";
import { socket } from "@/libs/socket";

const OnlineGame = () => {
  const { roomId } = useLocalSearchParams() as { roomId: string };

  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState<"O" | "X" | null>(null);
  const [mySymbol, setMySymbol] = useState<"O" | "X" | null>(null);

  const handleGoBack = useCallback(() => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setTurn(null);
    setMySymbol(null);
    socket.disconnect();
    router.dismissAll();
  }, []);

  const handleStartGame = useCallback(
    ({
      board,
      playerO,
      turn,
    }: {
      board: string[][];
      turn: "O" | "X";
      playerO: string;
    }) => {
      setBoard(board);
      setTurn(turn);
      setMySymbol(playerO === socket.id ? "O" : "X");
    },
    []
  );

  const handlePress = useCallback((outerIndex: number, innerIndex: number) => {
    if (turn !== mySymbol) {
      return;
    }

    setBoard((prev) => {
      if (prev[outerIndex][innerIndex] === "") {
        prev[outerIndex][innerIndex] = mySymbol!;
      }

      socket.emit("player-move", {
        outerIndex,
        innerIndex,
        roomId,
      });

      return prev;
    });
  }, []);

  const handleUpdateBoard = useCallback(
    ({ board, turn }: { board: string[][]; turn: "O" | "X" }) => {
      setBoard(board);
      setTurn(turn);
    },
    []
  );

  const handleVictory = useCallback(() => {
    Alert.alert("Victory", "You won", [
      {
        text: "Ok",
        onPress: handleGoBack,
      },
    ]);
  }, []);

  const handleLoss = useCallback(() => {
    Alert.alert("Loss", "You lose", [
      {
        text: "Ok",
        onPress: handleGoBack,
      },
    ]);
  }, []);

  const handleDraw = useCallback(() => {
    Alert.alert("Draw", "Game drawn", [
      {
        text: "Ok",
        onPress: handleGoBack,
      },
    ]);
  }, []);

  const handlePlayerDisconnected = useCallback(() => {
    Alert.alert("Error", "The other player disconnected", [
      {
        text: "Ok",
        onPress: handleGoBack,
      },
    ]);
  }, []);

  const handleError = useCallback(({ error }: { error: string }) => {
    Alert.alert("Error", error, [
      {
        text: "Ok",
        onPress: handleGoBack,
      },
    ]);
  }, []);

  useEffect(() => {
    socket.on("start-game", handleStartGame);
    socket.on("update-board", handleUpdateBoard);
    socket.on("victory", handleVictory);
    socket.on("loss", handleLoss);
    socket.on("draw", handleDraw);
    socket.on("player-disconnected", handlePlayerDisconnected);
    socket.on("error", handleError);

    return () => {
      socket.off("start-game", handleStartGame);
      socket.off("update-board", handleUpdateBoard);
      socket.off("victory", handleVictory);
      socket.off("loss", handleLoss);
      socket.off("draw", handleDraw);
      socket.off("player-disconnected", handlePlayerDisconnected);
      socket.off("error", handleError);
    };
  }, [
    socket,
    handleStartGame,
    handleUpdateBoard,
    handleVictory,
    handleLoss,
    handleDraw,
    handlePlayerDisconnected,
    handleError,
  ]);
  return (
    <Wrapper>
      <View className="flex-1 px-2 gap-y-12">
        <View className="gap-y-3">
          <View className="flex-row justify-between items-center pt-6">
            <View className="border-4 border-blue-500 w-[40%] py-3 items-center gap-y-5 rounded-lg">
              <Text className="text-white text-lg font-bold">Player 1</Text>
              <Image
                source={require("../../assets/images/O.png")}
                className="size-12"
              />
            </View>
            <View className="border-4 border-rose-500 w-[40%] py-3 items-center gap-y-5 rounded-lg">
              <Text className="text-white text-lg font-bold">Player 2</Text>
              <Image
                source={require("../../assets/images/X.png")}
                className="size-12"
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            {turn !== "O" && <View />}

            <View className="w-[40%] items-center">
              <Text className="text-yellow-500 text-xl font-bold">
                {turn === mySymbol ? "Your" : "Opponent"} Turn
              </Text>
            </View>
          </View>
        </View>

        <Board board={board} handlePress={handlePress} />

        <Pressable
          className="border-4 border-yellow-400 size-16 items-center justify-center rounded-full"
          onPress={handleGoBack}
        >
          <Entypo name="arrow-bold-left" size={40} color={"#CA8A04"} />
        </Pressable>
      </View>
    </Wrapper>
  );
};

export default OnlineGame;
