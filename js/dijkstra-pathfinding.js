class Dijkstra {
    constructor(grid, start, end) {
        this.grid = grid;
        this.start = start;
        this.end = end;

        this.find_path(grid,start,end)
    }

    find_path(grid, startNode, endNode) {
        console.log('grid',grid)
        startNode.distance = 0
        const visitedNodes = []
        //const unvisitedNodes = getNodes(grid)
        const unvisitedNodes = tilemap.nodes;
        
        const delay = 5
        let step = 1
        while (unvisitedNodes.length) {
          unvisitedNodes.sort((a, b) => a.distance - b.distance)
          const closestNode = unvisitedNodes.shift()
          console.log('closest',closestNode)
          if (closestNode.col == endNode.col && closestNode.row == endNode.row) {
            //endNode.parent = visitedNodes[visitedNodes.length-1]
            console.log(visitedNodes)
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
          console.log('neighborgs',neighbors)
          for (const neighbor of neighbors) {
            
            neighbor.distance = closestNode.distance + 1
            neighbor.parent = closestNode
  
            if(neighbor.col == endNode.col && neighbor.row == endNode.row){
              return visitedNodes
            }
          }
          ++step
        }
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
        console.log('node',node)
        const neighbors = []
        const { row, col } = node
        console.log('row',row)
        console.log('col',col)
        
        //previous
        if (row !== 0) neighbors.push(grid[row - 1][col].node)
        //Get next
        if (row !== grid.length - 1) neighbors.push(grid[row + 1][col].node)
        //get up
        if (col !== 0) neighbors.push(grid[row][col - 1].node)
        //get down
        if (col !== grid[0].length - 1) neighbors.push(grid[row][col + 1].node)
  
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
        // console.log('before filter',neighbors)
         return neighbors.filter((neighbor) => !neighbor.visited)
      }
}