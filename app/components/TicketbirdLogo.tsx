import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, G, Rect } from 'react-native-svg';

interface TicketbirdLogoProps {
  size?: number;
  color?: string;
}

export const TicketbirdLogo = ({ size = 32, color = '#000' }: TicketbirdLogoProps) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bird body - centered in viewBox */}
        <Path d="M14 8C14 8 13 4 9 4C5 4 4.5 7 4.5 7C3.5 7.5 3 8 3 9C3 10 4.5 11 4.5 11" />
        <Path d="M14 8C14 8 15.5 8 16.5 9C17.5 10 18 12 18 12L20 14C20 14 19 15 18 15C17 15 16 14 16 14C16 14 16 16 15 17C14 18 12 19 12 19" />
        <Path d="M6 15C6 15 8 17.5 10 17.5C12 17.5 14 15 14 15" />
        
        {/* Eye - centered with bird */}
        <Circle cx="8" cy="9.7" r="0.3" fill={color} />
        
        {/* Ticket being carried/dragged - adjusted with bird position */}
        <G rotation="-15" origin="12, 8">
          {/* Main ticket body */}
          <Rect x="12" y="8" width="8" height="3.5" rx="0.5" strokeWidth="1.5" />
          
          {/* Perforated edge */}
          <Path d="M18 8L18 11.5" strokeWidth="1.5" strokeDasharray="0.4 0.4" />
          
          {/* Small decorative lines */}
          <Path d="M13.5 9L16.5 9" strokeWidth="1.5" />
          <Path d="M13.5 10.5L16.5 10.5" strokeWidth="1.5" />
        </G>
      </Svg>
    </View>
  );
}; 

export default TicketbirdLogo;