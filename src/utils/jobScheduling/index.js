// 入参格式参考：
export const arr = [
  { id: 1, name: "i1" },
  { id: 2, name: "i2", parentId: 1 },
  { id: 4, name: "i4", parentId: 3 },
  { id: 3, name: "i3", parentId: 2 },
  { id: 8, name: "i8", parentId: 7 },
  { id: 5, name: "i3", parentId: 4 },
  { id: 7, name: "i8", parentId: 1 },
];
// 出参格式可自行设计, 举例：
//   {
//     id: 1,
//     name: 'i1',
//     children: [
//       {
//         id: 2,
//         name: 'i2',
//         children: []
//       }
//     ]
//   }

export default function buildTree(arr) {
  /**
   * 此处写代码逻辑
   */

  // 最小id
  const minItem = arr.sort((a,b) => {
      return a.id - b.id
  })[0];

  const addChildFun = (e) => {
      arr.forEach((item) => {
          if(e.id === item.parentId) {
              if(e.children) {
                  e.children.push(item);
              }else {
                  e.children = [item]
              }
              addChildFun(item)
          }
      })
  }
  addChildFun(minItem)

  console.log(minItem);

  return minItem
}