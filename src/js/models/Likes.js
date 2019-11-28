export default class Likes {
    constructor() {
        this.likes = []; 
    }

    addLike(id, title, cals, img) {
        const like = { id, title, cals, img};
        this.likes.push(like);

        //Persist data in localStorage
        this.persistdata();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //Persit data in localStorage
        this.persistdata();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistdata() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}