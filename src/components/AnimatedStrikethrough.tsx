import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Animated, Easing, Text, View, StyleSheet, TextStyle } from 'react-native';

interface AnimatedStrikethroughProps {
  children: string;
  textStyle?: TextStyle;
  strikethroughColor?: string;
  isCompleted: boolean;
  animationDuration?: number;
}

export const AnimatedStrikethrough: React.FC<AnimatedStrikethroughProps> = ({
  children,
  textStyle,
  strikethroughColor = '#888888',
  isCompleted,
  animationDuration = 300,
}) => {
  const textRef = useRef<Text>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const animateStrikethrough = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [animatedValue, animationDuration]);

  const reverseAnimation = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: animationDuration / 2,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [animatedValue, animationDuration]);

  const measureText = () => {
    if (textRef.current) {
      textRef.current.measure((x, y, width, height) => {
        setTextWidth(width);
        setTextHeight(height);
        setIsMeasured(true);
      });
    }
  };

  useEffect(() => {
    if (isMeasured && isCompleted) {
      animateStrikethrough();
    } else if (!isCompleted) {
      reverseAnimation();
    }
  }, [isCompleted, isMeasured, animateStrikethrough, reverseAnimation]);

  const strikeWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, textWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Text
        ref={textRef}
        style={[styles.text, textStyle]}
        onLayout={measureText}
      >
        {children}
      </Text>
      {isMeasured && (
        <Animated.View
          style={[
            styles.strikethrough,
            {
              width: strikeWidth,
              top: textHeight / 2 - 1,
              backgroundColor: strikethroughColor,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
  },
  strikethrough: {
    position: 'absolute',
    height: 2,
    left: 0,
  },
});
