import styled from "@emotion/styled";
//emotion自定义标签，可以在里面传入属性，同时由于是模板字符串，可以${}使用
export const Row = styled.div<{
  //这里面是传入的属性
  //？：不存在时就不管，存在时必须为冒号后的类型
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  // > *  : 所有子组件
  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;
