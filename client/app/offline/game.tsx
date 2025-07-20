import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Board from "@/components/board";
import Wrapper from "@/components/wrapper";
import { router } from "expo-router";

const OfflineGame = () => {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState<"O" | "X">(Math.random() < 0.5 ? "O" : "X");
  const [winner, setWinner] = useState<"O" | "X" | null>(null);

  const handlePress = useCallback(
    (outerIndex: number, innerIndex: number) => {
      setBoard((prev) => {
        if (prev[outerIndex][innerIndex] === "") {
          prev[outerIndex][innerIndex] = turn;
        }
        return prev;
      });

      setTurn((prev) => (prev === "O" ? "X" : "O"));
    },
    [turn, board]
  );

  const handleReset = useCallback(() => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setWinner(null);
    setTurn(Math.random() < 0.5 ? "O" : "X");
  }, []);

  const checkDraw = useCallback(() => {
    for (const row of board) {
      for (const cell of row) {
        if (cell === "") {
          return false;
        }
      }
    }

    return winner ? false : true;
  }, [board, winner]);

  const checkWin = useCallback(
    (player: "O" | "X") => {
      // Left diagonal
      if (
        board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player
      ) {
        setWinner(player);
      }
      // Right diagonal
      else if (
        board[0][2] === player &&
        board[1][1] === player &&
        board[2][0] === player
      ) {
        setWinner(player);
      }
      // First row
      else if (
        board[0][0] === player &&
        board[0][1] === player &&
        board[0][2] === player
      ) {
        setWinner(player);
      }
      // Second row
      else if (
        board[1][0] === player &&
        board[1][1] === player &&
        board[1][2] === player
      ) {
        setWinner(player);
      }
      // Third row
      else if (
        board[2][0] === player &&
        board[2][1] === player &&
        board[2][2] === player
      ) {
        setWinner(player);
      }
      // First column
      else if (
        board[0][0] === player &&
        board[1][0] === player &&
        board[2][0] === player
      ) {
        setWinner(player);
      }
      // Second column
      else if (
        board[0][1] === player &&
        board[1][1] === player &&
        board[2][1] === player
      ) {
        setWinner(player);
      }
      // Third column
      else if (
        board[0][2] === player &&
        board[1][2] === player &&
        board[2][2] === player
      ) {
        setWinner(player);
      }
    },
    [board]
  );

  useEffect(() => {
    if (winner) {
      Alert.alert("Victory", `Player ${winner === "O" ? 1 : 2} won the game`, [
        {
          text: "Go back",
          onPress: () => {
            handleReset();
            router.back();
          },
        },
        {
          text: "Play again",
          onPress: handleReset,
        },
      ]);
    }
  }, [winner]);

  useEffect(() => {
    checkWin("O");
    checkWin("X");

    if (checkDraw()) {
      Alert.alert("Draw", "The game is drawn", [
        {
          text: "Go back",
          onPress: () => {
            handleReset();
            router.back();
          },
        },
        {
          text: "Play again",
          onPress: handleReset,
        },
      ]);
    }
  }, [turn]);
  return (
    <Wrapper>
      <SafeAreaView className="flex-1 px-2 gap-y-12">
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
              <Text className="text-yellow-500 font-bold text-xl">
                Your Turn
              </Text>
            </View>
          </View>
        </View>

        <Board board={board} handlePress={handlePress} />

        <View className="flex-row justify-between px-2">
          <Pressable
            className="border-4 border-yellow-400 size-16 items-center justify-center rounded-full"
            onPress={() => {
              handleReset();
              router.back();
            }}
          >
            <Entypo name="arrow-bold-left" size={40} color={"#CA8A04"} />
          </Pressable>
          <Pressable
            className="border-4 border-rose-400 size-16 items-center justify-center rounded-full"
            onPress={handleReset}
          >
            <FontAwesome6
              name="arrow-rotate-left"
              size={40}
              color={"#E11D48"}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </Wrapper>
  );
};

export default OfflineGame;
