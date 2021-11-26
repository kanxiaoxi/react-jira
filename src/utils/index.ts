import { useEffect, useState } from "react";
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
// 解决值可能为false时被删的情形 {checked: false}
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
// let a: object
// a = {name: 'jack'}
// a = () => {}
// a = new RegExp('')

// let b: { [key: string]: unknown };
// b = {name: 'rose'}
// b = () => {} // 报错

// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

// 第一个自定义钩子
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // TODO: 依赖项里加入callback会造成无限循环, 这个和useCallback以及useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/*
React Hook useEffect has a missing dependency: 'callback'.
Either include it or remove the dependency array.
If 'callback' changes too often,
find the parent component that defines it and wrap that definition in useCallback.
 */

// const debounce = (func, delay) => {
//   let timeout;
//   return (...param) => {
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(function() {
//       func(...param);
//     }, delay);
//   }
// }
// const log = debounce(() => console.log('call'), 5000)
// log()
// log()
// log()
//   ...5s
// 执行！

// debounce 原理讲解：
// 0s ---------> 1s ---------> 2s --------> ...
//     一定要理解：这三个函数都是同步操作，所以它们都是在 0~1s 这个时间段内瞬间完成的；
//     log()#1 // timeout#1
//     log()#2 // 发现 timeout#1！取消之，然后设置timeout#2
//     log()#3 // 发现 timeout#2! 取消之，然后设置timeout#3
//             // 所以，log()#3 结束后，就只剩timeout#3在独自等待了

// 后面用泛型规范类型
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化后，设置一个定时器
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// 不需要用到别的hook就能搞定的，写个函数就可以了，比如上面的cleanObject()。

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = document.title;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
