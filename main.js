import React from "react";
import ReactDOM from "react-dom";
const apiPath = "https://kitsu.io/api/edge";
const container = document.querySelector(".container");
const favButton = document.querySelector(".favorite");
const request = new XMLHttpRequest();
let xhr;
request.open('GET', apiPath + '/trending/anime');
request.onreadystatechange = function () {
    let images = [];
    if (this.readyState === 4) {
        const trending = JSON.parse(this.response);
        const data = trending['data'];
        for (i = 0; i < data.length; i++) {
            console.log('slug ', data[i]['attributes']['slug']);
            const image = data[i]['attributes']['posterImage']['large'];
            images.push(`<div class="item"><img src="${image}"><img class="favorite" src="icons/unchecked_favorites.png"></div>`)
        }
        container.innerHTML = images.join('');
    }
    else {
        console.log('Not ready')
    }
};

request.send();

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Array(10).fill({info: null, favorited: false}),
            favorites: [],

        }
    }

    handleFavoriteClick(i) {
        const match = this.state.favorites.filter(item => item == this.state.data[i]);
        if (this.state.data[i]['favorited']) {
            this.state.data[i]['favorited'] = false;
            this.setState({
                favorites: this.state.favorities.filter(item => item !== this.state.data[i]['info'])
            })
        }
        else {
            this.setState({
                favorites: this.state.favorites.concat(this.state.data[i])
            });
            this.state.data[i]['favorited'] = true;
        }
    }

    getData() {
        if (xhr.readyState === 4) {
            const newData = JSON.parse(xhr.response)['data'];
            this.setState({
                data: this.state.data.concat(newData)
            })
        }
    }

    handleSearchClick(terms) {
        const query = terms.replace(' ', '%20');
        xhr = new XMLHttpRequest();
        xhr.open('GET', apiPath + '/anime?filter[text]=' + query);
        xhr.addEventListener("readystatechange", getData);
        xhr.send();
    }
}