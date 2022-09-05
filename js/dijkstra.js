class Dijkstra {
  constructor(grid, startNode, endNode) {
    this.grid = grid;
    this.startNode = startNode;
    this.endNode = endNode;

  }

  duplicateGrid(grid, startNode) {
    let nodes = [];
    let grid2 = [];

    for (let row = 0; row < grid.length; row++) {
      let arr = [];
      for (let col = 0; col < grid[0].length; col++) {
        let node = new Node(row, col);

        if (row == startNode.row && col == startNode.col) {
          node.distance = 0;
        }

        if (row == this.endNode.row && col == this.endNode.col) {
          this.endNode == node;
        }

        if (grid[row][col].wall) {
          node.wall = true;
        }
        else {
          node.wall = false;
        }

        node.tile = grid[row][col].tile;
        arr[col] = node;
        nodes.push(node)
      }

      grid2.push(arr)

    }

    return { "grid": grid2, "nodes": nodes };
  }


  find_path(grid, startNode, endNode) {
    let gridObj = this.duplicateGrid(grid, startNode)
    let dupGrid = gridObj.grid;
    let nodes = gridObj.nodes

    const visitedNodes = []
    const unvisitedNodes = nodes

    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance)
      const closestNode = unvisitedNodes.shift()

      if (closestNode.col == endNode.col && closestNode.row == endNode.row) {

        return { "visited": visitedNodes, "endNode": closestNode };

      }
      if (closestNode.distance === Infinity) {
        console.log("No path found")
        //return 0;
      }
      if (!closestNode.wall) {

        closestNode.visited = true;
        visitedNodes.push(closestNode)
        const neighbors = this.getNeighbors(closestNode, dupGrid)

        for (const neighbor of neighbors) {

          neighbor.distance = closestNode.distance + 1
          neighbor.parent = closestNode

        }
      }
    }
  }

  getNodes(grid) {
    let temp = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        temp.push(grid[row][col]);
      }
    }
    return temp;
  }

  makePath(node) {
    let currentNode = node;
    let path = [];

    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = currentNode.parent;
    }
    return path;
  }


  getNeighbors(node, grid) {
    const neighbors = []
    const { row, col } = node

    //previous
    if (row !== 0) neighbors.push(grid[row - 1][col])
    //Get next
    if (row !== grid.length - 1) neighbors.push(grid[row + 1][col])
    //get up
    if (col !== 0) neighbors.push(grid[row][col - 1])
    //get down
    if (col !== grid[0].length - 1) neighbors.push(grid[row][col + 1])

    //Diagonal neighbors
    //Not yet implemeneted

    //dia up left
    // if(row > 0 && col > 0) neighbors.push(grid[row-1][col-1])
    // //dia up right
    // if(row > 0 && row < grid.length -1) neighbors.push(grid[row-1][col+1])
    // //dia down left
    // if(col > 0 && col < grid[0].length -1) neighbors.push(grid[row+1][col-1])
    // //dia down right
    // if(row < grid.length -1  && col < grid[0].length -1) neighbors.push(grid[row+1][col+1])

    return neighbors.filter((neighbor) => !neighbor.visited)
  }
}