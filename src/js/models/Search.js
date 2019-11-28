import axios from 'axios';
import { key, host } from '../config'


var searchArr = [];


export default class Search {

    
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        
        const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search'
        try {
            const res = await axios({
                "url": url,
                "headers":{
                    "x-rapidapi-host": host,
                    "x-rapidapi-key": key
                },
                "params":{
                    "query": this.query,
                    "number": 30
                }  
            })
            this.result = res.data.results
            searchArr = this.result
        } catch (error) {
            console.log(error)
        }
    }

    ingredientParsePrep() {
        const index = searchArr.findIndex(x => x.id == this.id)
        if(index !== -1) {
            this.title = searchArr[index].title;
            this.servings = searchArr[index].servings;
            this.prepTime = searchArr[index].readyInMinutes;

        } else {
            console.log('Results couldn\'t be parsed')
        }
    }
}




