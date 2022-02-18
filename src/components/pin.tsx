import React from "react";
import { Rate } from "antd";
//收藏的那颗星
interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Pin = ({ checked, onCheckedChange, ...restProps }: PinProps) => {
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(num) => {
        console.log(num);
        return onCheckedChange?.(Boolean(num));
      }}
      {...restProps}
    />
  );
};
