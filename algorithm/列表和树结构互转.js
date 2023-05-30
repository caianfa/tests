// 列表转成树形结构
/*
const data = [
  {
      id: 1,
      text: '节点1',
      parentId: 0 //这里用0表示为顶级节点
  },
  {
      id: 2,
      text: '节点1_1',
      parentId: 1 //通过这个字段来确定子父级
  }
  ...
]
转成
[
  {
      id: 1,
      text: '节点1',
      parentId: 0,
      children: [
          {
              id:2,
              text: '节点1_1',
              parentId:1
          }
      ]
  }
]
*/

function listToTree(arr) {
  let treeData = [];
  let temp = {}

  // 先把列表的里面每个对象保存在一个临时对象上，key为id，value为列表的每一项
  for (let i = 0; i < arr.length; i++) {
    temp[arr[i].id] = arr[i];
  }

  for (let key in temp) {
    let node = temp[key]
    if (node.parentId !== 0) {
      if (!temp[node.parentId].children) {
        temp[node.parentId].children = []
      }
      temp[node.parentId].children.push(node)
    } else {
      treeData.push(node)
    }
  }

  return treeData
}

var list = [
  { id: 1, parentId: 0, name: "root" },
  { id: 2, parentId: 1, name: "node1" },
  { id: 3, parentId: 1, name: "node2" },
  { id: 4, parentId: 2, name: "node1.1" },
  { id: 5, parentId: 2, name: "node1.2" },
  { id: 6, parentId: 4, name: "node1.1.1" }
];

var roots = listToTree(list);
console.log(roots);


/******************************************************/


function treeToList(data) {
  let res = [];

  const dfs = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i]
      if (node.children && node.children.length) {
        dfs(node.children)
      } else {
        res.push(node)
      }
    }
  }

  dfs(data)

  return res;
}
