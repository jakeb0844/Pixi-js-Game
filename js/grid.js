class Grid{
    constructor(cols,rows) {
        this.nodes =[];
        this.grid = [];
        this.init(cols,rows);
    }

    init(cols,rows){
        let size =0;
        
        for(let col = 0; col < cols; col++){
            let arr = [];
            for(let row = 0; row < rows; row++){
                arr[row] = new Node(col,row);
                this.nodes[size] = arr[row];
                //this.nodes[size].distance = col + row;
                size++;
            }

            this.grid.push(arr)
            
        }

        console.log(this.grid)
        console.log(this.nodes)




    }

}