import React, { ProfilerOnRenderCallback, ProfilerProps } from "react";

type Props = {
  metadata?: any;
  phases?: ("mount" | "update")[];
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];
const sendProfilerQueue = () => {
  if (!queue.length) {
    return;
  }
  const queueToSend = [...queue];
  queue = [];
  // 处理队列里的信息：比如发送回服务器;这里直接打印到控制台
  console.log(queueToSend);
};

setInterval(sendProfilerQueue, 5000);

export const Profiler = ({ metadata, phases, ...props }: Props) => {
  // onRender触发时执行
  const reportProfiler: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // 根据需要，将更新的信息加入队列
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata,
      });
    }
  };
  return <React.Profiler onRender={reportProfiler} {...props} />;
};
