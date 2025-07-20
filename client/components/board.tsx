import React from "react";
import { Image, Pressable, View } from "react-native";

const Board = ({
  board,
  handlePress,
}: {
  board: string[][];
  handlePress: (outerIndex: number, innerIndex: number) => void;
}) => {
  return (
    <View className="gap-6 items-center w-full">
      {board.map((b, i) => {
        return (
          <View key={i} className="flex-row gap-3 w-full">
            {b.map((item, j) => {
              return (
                <Pressable
                  key={j}
                  className="w-[32%] h-28 border-4 border-blue-500 rounded-lg items-center justify-center"
                  disabled={item !== ""}
                  onPress={() => handlePress(i, j)}
                >
                  {item !== "" && (
                    <Image
                      source={
                        item === "O"
                          ? require("../assets/images/O.png")
                          : require("../assets/images/X.png")
                      }
                      className="size-20"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default Board;
