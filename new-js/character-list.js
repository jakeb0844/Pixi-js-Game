export class CharacterList {
    constructor(){
        this.list = [];
    }

    add(entity){
        this.list.push(entity);
    }

    remove(entity){
    
    }

    find(entity){
        this.list.forEach(element => {
            if(element.name == entity.name){
                return element;
            }
        });
    }


}