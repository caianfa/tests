const tree = {
  name: 'root',
  children: [
    {
      name: 'c1',
      children: [
        {
          name: 'c11',
          children: []
        },
        {
          name: 'c12',
          children: []
        }
      ]
    },
    {
      name: 'c2',
      children: [
        {
          name: 'c21',
          children: []
        },
        {
          name: 'c22',
          children: []
        }
      ]
    }
  ]
}
// ['root', 'c1','c11', 'c12', 'c2', 'c21', 'c22']
// 递归
/* let res = []
function dfs(tree) {
  res.push(tree.name)

  if(tree.children.length > 0) {
    for (let i = 0; i < tree.children.length; i++) {
      dfs(tree.children[i])
    }
  }
}
dfs(tree) */

let stack = [tree]
let res = []

function dfs() {
  while (stack.length > 0) {
    let tree = stack.pop()
    res.push(tree.name)

    for (let i = tree.children.length - 1; i >= 0; i--) {
      stack.push(tree.children[i])
    }
  }
}

dfs(tree)
console.log(res);

