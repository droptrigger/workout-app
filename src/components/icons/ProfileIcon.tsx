import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  size?: number;
};

export default function ProfileIcon({ color = '#888', size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.6667 6.41667C14.6667 8.44171 13.0251 10.0833 11 10.0833C8.97497 10.0833 7.33334 8.44171 7.33334 6.41667C7.33334 4.39162 8.97497 2.75 11 2.75C13.0251 2.75 14.6667 4.39162 14.6667 6.41667Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path 
        d="M11 12.8333C7.45618 12.8333 4.58334 15.7062 4.58334 19.25H17.4167C17.4167 15.7062 14.5438 12.8333 11 12.8333Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}