class Grid {
    constructor(cols, rows, collisionLayer,tiles) {
        console.log('cols',cols);
        console.log('rows',rows)
        this.nodes = [];
        this.grid = [];
        this.init(cols, rows, collisionLayer,tiles);
    }

    init(cols, rows,collisionLayer,tiles) {
        console.log(collisionLayer)
        let size = 0;

        for (let row = 0;row < collisionLayer.height;row++) {
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
                this.nodes[size] = arr[col];
                size++;
            }
            
            this.grid.push(arr)

        }

        console.log(this.grid)
        console.log(this.nodes)

    }

    printGrid(id) {
        let height = this.mapArr.length;
        let width = this.mapArr[0].length;
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

                if (this.mapArr[col][row].char_here) {
                    //el.append('X')
                    html += "<td style='background:yellow'>";
                    html += "X";
                }
                else if (this.mapArr[col][row].action) {
                    html += "<td style='background:green'>";
                    html += "a";
                }
                else if (this.mapArr[col][row].walkable) {
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

}