export const isFalsy = (value: unknown) => (value === 0 ? false : !value); //防止把id为0的情况判断为空值
//为了清除发送请求中携带的query中有空值
export const cleanObject = (object?: { [key: string]: unknown }) => {
  // Object.assign({}, object)
  if (!object) {
    return {};
  }
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
