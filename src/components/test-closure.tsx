import { useState, useEffect } from "react";
import { useMount } from "utils";

const test = () => {
  let num = 0;

  const effect = () => {
    num += 1;
    const message = `现在的num值：${num}`;

    return function unmount() {
      console.log(message);
    };
  };

  return effect;
};
// 执行test， 返回effect函数
const add = test();
// 执行effect函数，返回引用message1的unmount函数
const unmount = add();
// 再一次执行effect函数，返回引用了message2的unmount函数
add();
add();
unmount(); // 这里会打印什么呢？按照直觉似乎应该打印3，实际上打印1

// react hook 与 闭包， hook 与 闭包经典的坑
export const Test = () => {
  const [num, setNum] = useState(0);

  // 未添加依赖项，只在页面加载的时候，才会执行一次！
  // useMount(()=>{
  //   setInterval(()=> {
  //     console.log('num in setInterval: ', num) // 始终打印 0
  //   }, 1000)
  // })

  useEffect(() => {
    const id = setInterval(() => {
      console.log("num in setInterval: ", num);
    }, 1000);
    // 清理旧的计时器
    return () => clearInterval(id);
  }, [num]);

  useEffect(() => {
    return () => console.log("卸载值: ", num); // 打印 0
  }, [num]);

  const add = () => setNum(num + 1);
  return (
    <div>
      <button onClick={add}>add</button>
      <p>number: {num}</p>
    </div>
  );
};
