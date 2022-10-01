export class CharacterList {
    constructor(){
        this.list = [];
    }

    add(entity){
        this.list.push(entity);
    }

    remove(entity){
        let obj = this.find(entity);

        let index = obj.index;

        this.list.splice(index, 1);
    }

    find(entity){

        for(let i = 0; i < this.list.length; i++){
            let element = this.list[i];
            if(element.containerIndex == entity.containerIndex && element.constructor.name == entity.constructor.name){
                console.log('here')
                return {'entity':element,'index': i};
            }
        }
    }


}