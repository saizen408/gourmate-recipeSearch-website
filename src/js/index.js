// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** UI Todo Items ***
 * gourmate App
 * 1. Random grandient color generator
 * 2. Interactive buttons and icons (hover/reload)
 * 3. Improve the loader design
 * 4. Autocomplete
 * 5. Random Recipe ('surprise me')
 * 6. Push likes to email 
 */

const state = {};


/**
 * 
 * Search Controller
 *
**/


const controlSearch = async () => {
    // 1) Get the query from view
    const query = searchView.getInput(); //todo
    if(query) {
        //2) new search object and add to state
        state.search = new Search(query);
        
        // 3) Preapare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)
        try {
            // 4) Search for recipes
            await state.search.getResults();
            // 5) Render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
            // saveResultArr = state.search.result
        } catch (e) {
            clearLoader();
            alert('Something wrong with the search...')
        }
    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from loading in the case of 'submit'
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * 
 * Recipe Controller
 *
**/

const controlRecipe = async (e) => {
    //Get the ID from url
    const id = window.location.hash.replace('#', '');
            
    if (id) {
        //Prepare the UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search) searchView.highlightedSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id)
        try {
            await state.recipe.getRecipe();
                state.recipe.ingredientParsePrep();
                state.recipe.parseIngredients();
                clearLoader();
                recipeView.renderRecipe(
                    state.recipe,
                    state.likes.isLiked(id)
                );
            // } 
        } catch (e) {
            console.log(e)
        }
    } 
}; 

window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * 
 * LIST CONTROLLER
 *
**/
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.amount.us.value, el.amount.us.unit, el.name);
        listView.renderItem(item);
    });

}
    

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }
});

/**
 * 
 * LIKE CONTROLLER
 *
**/

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {    
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            'cals', //will come from state.nutrition
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add like to the UI list
        likesView.renderLike(newLike);

    // User has liked current recipe
    } else {    
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from the UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked reciped on page
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likesf
    state.likes.readStorage();
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});



// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);

    } else if(e.target.matches(`.recipe__btn--add, .recipe__btn--add *`)){
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
})


// window.l = new List();

