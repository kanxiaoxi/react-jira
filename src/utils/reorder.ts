/**
 * 在本地对排序进行乐观更新
 * @param fromId 要排序的项目的id
 * @param type "after" | "before"
 * @param referenceId 参照id
 * @param list 要排序的列表, 如tasks, kanbans
 * @returns
 */
export const reorder = ({
  fromId,
  type,
  referenceId,
  list,
}: {
  fromId: number;
  type: "after" | "before";
  referenceId: number;
  list: { id: number }[];
}) => {
  const copiedList = [...list];
  const movingItemIndex = copiedList.findIndex((item) => item.id === fromId);
  if (!referenceId) {
    return insert(
      [...copiedList],
      movingItemIndex,
      copiedList.length - 1,
      "after"
    );
  }
  const targetIndex = copiedList.findIndex((item) => item.id === referenceId);

  return insert([...copiedList], movingItemIndex, targetIndex, type);
};

/**
 * 在list列表中,把from位置的元素放在to位置的前面或者后面,insertType标识在to前还是在后
 * @param list
 * @param from
 * @param to
 * @param insertType
 * @returns
 */
const insert = (
  list: unknown[],
  from: number,
  to: number,
  insertType: "after" | "before"
) => {
  // 暂未对from,to取值进行限定
  const toItem = list[to];
  // 注意下面两行代码的顺序
  const removedItem = list.splice(from, 1)[0];
  const toIndex = list.indexOf(toItem);

  insertType === "after"
    ? list.splice(toIndex + 1, 0, removedItem)
    : list.splice(toIndex, 0, removedItem);

  return list;
};
