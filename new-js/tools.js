function CalculateRowAndCol(position) {
    let row = Math.floor(position.x / 16);
    let col = Math.floor(position.y / 16);

    return { "row": row, "col": col };
}

function CalculatePosition(row, col) {
    let x = Math.floor(row / 16) * 16;
    let y = Math.floor(col / 16) * 16;

    return { "x": x, "y": y };
}

function createRect(x, y, width, height) {
    let rect = new PIXI.Graphics()
        .beginFill(0xFFFFFFF0000)
        .lineStyle({ color: 1, width: 1, native: true })
        .drawShape({ "x": x, "y": y, "width": width, "height": height, "type": 1 });

    return rect;

}

function getObjectSize(obj) {
    return Object.keys(obj).length;
}

function getObjectKeys(obj) {
    return Object.keys(obj);
}

function createGrid(collisionLayer, tiles) {
    //console.log(collisionLayer)
    let size = 0;
    let grid = [];
    let nodes = [];

    for (let row = 0; row < collisionLayer.height; row++) {
        let arr = [];
        for (let col = 0; col < collisionLayer.width; col++) {
            let node = new Node(row, col);

            if (collisionLayer.data[size] == 0) {
                node.wall = false;
                node.tile = tiles[size]
            }
            else {
                //this.mapArr[col][row] = 1
                node.wall = true;
                node.tile = tiles[size]
            }
            arr[col] = node;
            nodes[size] = arr[col];
            size++;
        }

        grid.push(arr)

    }
    //console.log(grid)
    // console.log(this.grid)
    // console.log(this.nodes)
    return { 'grid': grid, 'nodes': nodes };
}

function printGrid(grid,id) {
    let height = grid.length;
    let width = grid[0].length;
    let html = '';

    let el = $('#' + id);
    el.html('');

    el.append('<table>')

    for (let col = 0; col < height; col++) {
        //el.append('<tr>')
        html = '';
        html += "<tr>";
        for (let row = 0; row < width; row++) {
            //el.append('<td>')

            if (grid[col][row].playerPosition) {
                //el.append('X')
                html += "<td style='background:yellow'>";
                html += "X";
            }
            else if (grid[col][row].action) {
                html += "<td style='background:green'>";
                html += "a";
            }
            else if (grid[col][row].enemeyPosition) {
                html += "<td style='background:pink'>";
                html += "E";
            }
            else if (!grid[col][row].wall) {
                //el.append('0')
                html += "<td style='background:lightblue'>";
                html += "0";
            }
            else {
                //el.append('1')
                html += "<td style='background:red'>";
                html += "1";
            }
            //el.append('</td>')
            html += "</td>";
        }
        //el.append('</tr>')
        html += "</tr>";
        el.append(html);

    }
    el.append('</table>')
}
