class Dijkstra {
  constructor(grid, startNode, endNode) {
    this.grid = grid;
    this.startNode = startNode;
    this.endNode = endNode;

    //this.find_path(grid, startNode, endNode)
  }

  duplicateGrid(grid,startNode){
    //console.log(grid)
    let nodes = [];
    let grid2 = [];
    let size = 0;

        for (let row = 0;row < grid.length;row++) {
            let arr = [];
            for (let col = 0; col < grid[0].length; col++) {
                let node = new Node(row, col);

                if(row == startNode.row && col == startNode.col){
                  node.distance = 0;
                }

                if(row == this.endNode.row && col == this.endNode.col){
                  this.endNode == node;
                }
                
                if (grid[row][col].wall) {
                    node.wall = true;
                    
                }
                else {
                    //this.mapArr[col][row] = 1
                    node.wall = false;
                    
                }

                node.tile = grid[row][col].tile;
                arr[col] = node;
                nodes.push(node)
                //this.nodes[size] = arr[col];
                //size++;
            }
            
            grid2.push(arr)

        }
        //console.log('grid2',grid2)
        return {"grid":grid2,"nodes":nodes};
  }


  find_path(grid, startNode, endNode) {
    let gridObj = this.duplicateGrid(grid.grid,startNode)
    let dupGrid = gridObj.grid;
    let nodes = gridObj.nodes
  //   for(let i=0; i < tilemap.grid.nodes.length; i++){
  //     console.log(i)
  //     tilemap.grid.nodes[i].parent = null;
  //     // tilemap.grid.nodes[i].visted = false;
  //     // tilemap.grid.nodes[i].distance = Infinity;
  // }
    //console.log("start",startNode)
    //console.log("end",endNode)
    //let nodes = grid.nodes;
    //grid = d;

    //console.log('grid',dupGrid)
    //console.log("nodes", nodes)
    //startNode.distance = 0
    const visitedNodes = []
    const unvisitedNodes = nodes
    //let unvisitedNodes = this.getNodes(nodes)
    
    //console.log(unvisitedNodes)
    //throw new Error("Something went badly wrong!");

    const delay = 5
    let step = 1
    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance)
      const closestNode = unvisitedNodes.shift()
      console.log('closest', closestNode)
      if (closestNode.col == endNode.col && closestNode.row == endNode.row) {
        //endNode.parent = visitedNodes[visitedNodes.length-1]
        //console.log('end',visitedNodes)
        // startNode.parent = null;
        // startNode.distance = Infinity;
        return {"visited":visitedNodes,"endNode":closestNode};
      }
      if (closestNode.distance === Infinity) {
        console.log("No path found")
        //return 0;
      }

      //closestNode.addTimer("visited", delay * step)
      closestNode.visited = true;
      visitedNodes.push(closestNode)
      const neighbors = this.getNeighbors(closestNode, dupGrid)
      //console.log('neighborgs', neighbors)
      for (const neighbor of neighbors) {

        neighbor.distance = closestNode.distance + 1
        neighbor.parent = closestNode

        // if (neighbor.col == endNode.col && neighbor.row == endNode.row) {
        //   console.log('end from for',visitedNodes)
        //   return visitedNodes
        // }
      }
       console.log('n',neighbors)
      // console.log('v',visitedNodes)
      ++step
    }
  }

  getNodes(grid){
    let temp = [];
    for(let row = 0; row < grid.length; row++){
      for(let col = 0; col < grid[0].length; col++){
        temp.push(grid[row][col]);
      }
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