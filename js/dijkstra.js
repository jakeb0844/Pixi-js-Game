class Dijkstra {
  constructor(grid, startNode, endNode) {
    this.grid = grid;
    this.startNode = startNode;
    this.endNode = endNode;

    //this.find_path(grid, startNode, endNode)
  }

  find_path(grid, startNode, endNode) {

  //   for(let i=0; i < tilemap.grid.nodes.length; i++){
  //     console.log(i)
  //     tilemap.grid.nodes[i].parent = null;
  //     // tilemap.grid.nodes[i].visted = false;
  //     // tilemap.grid.nodes[i].distance = Infinity;
  // }
    //console.log("start",startNode)
    //console.log("end",endNode)
    let nodes = grid.nodes;
    grid = grid.grid;

    //console.log('grid',grid)
    console.log("nodes", nodes)
    startNode.distance = 0
    const visitedNodes = []
    //const unvisitedNodes = getNodes(grid)
    const unvisitedNodes = this.getNodes(nodes)
    console.log(unvisitedNodes)

    const delay = 5
    let step = 1
    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance)
      const closestNode = unvisitedNodes.shift()
      //console.log('closest', closestNode)
      if (closestNode.col == endNode.col && closestNode.row == endNode.row) {
        //endNode.parent = visitedNodes[visitedNodes.length-1]
        //console.log('end',visitedNodes)
        // startNode.parent = null;
        // startNode.distance = Infinity;
        return visitedNodes;
      }
      if (closestNode.distance === Infinity) {
        console.log("No path found")
        //return 0;
      }

      //closestNode.addTimer("visited", delay * step)
      closestNode.visited = true;
      visitedNodes.push(closestNode)
      const neighbors = this.getNeighbors(closestNode, grid)
      //console.log('neighborgs', neighbors)
      for (const neighbor of neighbors) {

        neighbor.distance = closestNode.distance + 1
        neighbor.parent = closestNode

        // if (neighbor.col == endNode.col && neighbor.row == endNode.row) {
        //   console.log('end from for',visitedNodes)
        //   return visitedNodes
        // }
      }
       //console.log('n',neighbors)
      // console.log('v',visitedNodes)
      ++step
    }
  }

  getNodes(nodes){
    let temp = [];
    for(let i=0; i < nodes.length; i++){
      temp[i] = new Node(nodes[i].row,nodes[i].col,nodes[i].tile)
    }

    return temp;
  }

  makePath(node) {
    let currentNode = node;
    console.log("start", currentNode)
    let path = [];
    //let delay = timeDelay
    let step = 1
    while (currentNode !== null) {
      //delay += 20
      //currentNode.addTimer("path", delay)
      path.unshift(currentNode);
      currentNode = currentNode.parent;
      console.log('while', currentNode)
      //break;
    }
    return path;
  }


  getNeighbors(node, grid) {
    //console.log('node', node)
    const neighbors = []
    const { row, col } = node
    //console.log('row', row)
    //console.log('col', col)

    //previous
    if (row !== 0) neighbors.push(grid[row - 1][col])
    //Get next
    if (row !== grid.length - 1) neighbors.push(grid[row + 1][col])
    //get up
    if (col !== 0) neighbors.push(grid[row][col - 1])
    //get down
    if (col !== grid[0].length - 1) neighbors.push(grid[row][col + 1])

    //get dia across right
    //if(row == 0 && col == 0) neighbors.push(grid[row+1][col+1])
    //get dia across left
    //if(row == 0 && col != 0) neighbors.push(grid[row+1][col-1])


    //dia up left
    // if(row > 0 && col > 0) neighbors.push(grid[row-1][col-1])
    // //dia up right
    // if(row > 0 && row < grid.length -1) neighbors.push(grid[row-1][col+1])
    // //dia down left
    // if(col > 0 && col < grid[0].length -1) neighbors.push(grid[row+1][col-1])
    // //dia down right
    // if(row < grid.length -1  && col < grid[0].length -1) neighbors.push(grid[row+1][col+1])
     //console.log('before filter',neighbors)
    return neighbors.filter((neighbor) => !neighbor.visited)
  }
}