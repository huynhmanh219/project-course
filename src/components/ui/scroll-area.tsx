import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import React from 'react';

export const ScrollArea: React.FC<React.ComponentProps<typeof ScrollAreaPrimitive.Root>> = ({ children, ...props }) => (
  <ScrollAreaPrimitive.Root {...props}>
    <ScrollAreaPrimitive.Viewport className="w-full h-full">
      {children}
    </ScrollAreaPrimitive.Viewport>
  </ScrollAreaPrimitive.Root>
);

export default ScrollArea; 