const { strict } = require("assert");
const fs = require("fs")
const list_db = "./list-db.json";


class ProcessData{

    static get_data(){

        let text = ProcessData.read_db();
        return JSON.parse(text);

    }


    static get_item(item_name){

        let text = ProcessData.read_db();

        let item = false;

        let items = JSON.parse(text);

        item = items.find(val => val.name === item_name);

        if(!item){
            return new ExpressErro(`'${item_name}' not found`, 404);
        }

        return item;
    }


    static add_item(item){

        let text = ProcessData.read_db();
            
        let data;
        let check = false;

        text.indexOf("message") != -1? data = [] : data = JSON.parse(text);

        check = data.find(val => val.name == item.name);

        if(check){

            return new ExpressErro(`Item '${item.name}' already exists`, 404);

        }

        data.push(item);

        ProcessData.write_in_db(data);

        return {"added": item}

    }


    static update_item(item_name, item_data){
       
        let check = ProcessData.get_item(item_name);

        if(check.status == 404){
            throw check;
        }

        let items = ProcessData.get_data();

        let data = items.map(val => {

            if(val.name == item_name){

                if(item_data.name != undefined){

                    val.name = item_data.name;

                    if(item_data.price != undefined){

                        val.price = item_data.price;

                    }
                            
                }

            } 

            return val;    
        });

        ProcessData.write_in_db(data);

        return data;
    }


    static delete_item(item_name){

        let check = ProcessData.get_item(item_name);

        if(check.status == 404){
            throw check;
        }

        let items = ProcessData.get_data();

        let data = items.map(val => val.name != item_name);

        data[0]? ProcessData.write_in_db(data): ProcessData.write_in_db([]);

        return true;

    }


    static read_db(){

        let text;

        try{

            text = fs.readFileSync(list_db,'utf8');

        }catch{

            throw new ExpressErro(`DB error while reading`, 500);

        }

        if(text.length == 0){

           text = JSON.stringify([{"message":"there are no items in the database"}]);

        }

        return text;
        
    }


    static write_in_db(items){

        let data = JSON.stringify(items);

        try{

            fs.writeFile(list_db, data, 'utf8', err  => {

                if(err){

                    throw new ExpressErro(`DB error on insert`, 500);

                }

            });

        }catch(err){

            throw new ExpressErro(`DB error on insert`, 500);

        }

    }
}


class ExpressErro extends Error{

    constructor(message, status){

        super();
        this.message = message;
        this.status = status;
        console.log('error runs')

    }

}


module.exports = {
    processData: ProcessData, 
    erroClass: ExpressErro,
};