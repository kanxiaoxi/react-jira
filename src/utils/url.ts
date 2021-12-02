import { useMemo, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject, subset } from "utils";

/**
 * 返回页面url中，指定键的参数
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParma();
  const [stateKeys] = useState(keys);
  return [
    useMemo(() => {
      // keys.reduce((prev, key) => {
      //   return { ...prev, [key]: searchParams.get(key) || "" };
      // }, {}) as { [key in K]: string },
      return subset(Object.fromEntries(searchParams), stateKeys) as {
        [key in K]: string;
      };
    }, [searchParams, stateKeys]),
    (params: Partial<{ [key in K]: unknown }>) => {
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
      return setSearchParams(params);
    },
  ] as const;
};

export const useSetUrlSearchParma = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (parmas: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...parmas,
    }) as URLSearchParamsInit;
    return setSearchParams(o);
  };
};
// const a = ['jack', 12, {gender: 'male'}] as const
