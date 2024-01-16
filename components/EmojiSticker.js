import { View, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


export default function EmojiSticker({ imageSize, stickerSource }) {

  const scaleImage = useSharedValue(imageSize)
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2
      }
    })
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    }
  })

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const drag = Gesture.Pan()
    .onChange((event) => {
      translateX.value += event.changeX
      translateY.value += event.changeY
    })
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }, { translateY: translateY.value },
      ]
    }
  })

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })

  const animatedPinchStyle = useAnimatedStyle(() => {
    return {transform: [{scale: scale.value}]}
  })

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <GestureDetector gesture={pinchGesture} >
            <Animated.Image
              source={stickerSource}
              resizeMode="contain"
              style={[imageStyle, animatedPinchStyle, { width: imageSize, height: imageSize }]}
            />
          </GestureDetector>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}