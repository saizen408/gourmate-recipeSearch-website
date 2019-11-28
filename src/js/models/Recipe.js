import axios from 'axios';
import { key, host } from '../config'
import Search from './Search';


var ingNames, ingAmts, ingUnits, ingVals;


export default class Recipe extends Search {
    constructor(id) {
        super();
        this.id = id;       
    }

    async getRecipe() {
        
        try {
            const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${this.id}/ingredientWidget.json`;
            const res = await axios({
                "url": url,
                "headers":{
                    "x-rapidapi-host": host,
                    "x-rapidapi-key": key
                },
                "params":{
                    "id": this.id 
                }  
            })
            this.img = `https://spoonacular.com/recipeImages/${this.id}-90x90.jpg`;
            this.ingredients = res.data.ingredients;
            } catch (error) {
                console.log(error);
                alert('something went wrong');
            }
    }
    // calcTime() {} //don't need erase
    // // calcServings() {} //don't need erase
    parseIngredients() {
        ingNames = []; ingAmts = []; ingVals = []; ingUnits = [];
        var newIngredients = this.ingredients
        console.log(newIngredients)
        //loop through this.ingredients and pull the name
        for (let i = 0; i < newIngredients.length; i++) {    
            ingNames.push(newIngredients[i].name)
        }
        //loop through this.ingredients and pull the amount object
        for (let i = 0; i < newIngredients.length; i++) {
            ingAmts.push(newIngredients[i].amount)
        }
        //loop through ingAmt and pull the us unit and val
        for (let i = 0; i < ingAmts.length; i++) {
            ingVals.push(ingAmts[i].us.value)
            ingUnits.push(ingAmts[i].us.unit)
        }
        console.log(ingNames)
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach((el,i) => {
            ingVals[i] *= (newServings / this.servings);
        })
        this.servings = newServings;
    }

}

export {ingNames, ingVals, ingUnits}





    