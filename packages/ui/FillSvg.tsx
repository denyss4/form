// An SVG that fills its parent (D5). On iOS, an Svg sized width="100%" over an absolute fill keeps the size of its parent's first layout,
// so in a box that grows afterwards it covered only part of it (found on the iPhone, 3 Oct: Today's driver card, the Progress hatch, the
// liquid metal pill). This measures the parent and hands the Svg exact numbers; nothing draws until the size is known.
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';

export function FillSvg({ children }: { children: (size: { width: number; height: number }) => ReactNode }) {
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!box || Math.abs(box.width - width) > 0.5 || Math.abs(box.height - height) > 0.5) setBox({ width, height });
      }}
    >
      {box ? (
        <Svg width={box.width} height={box.height}>
          {children(box)}
        </Svg>
      ) : null}
    </View>
  );
}
