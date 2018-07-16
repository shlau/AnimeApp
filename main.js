/* import React from "react";
import ReactDOM from "react-dom";  */
const apiPath = "https://kitsu.io/api/edge";
const container = document.querySelector(".container");
const favButton = document.querySelector(".favorite");
let xhr;
/* const trending = JSON.parse(this.response);
const data = trending['data'];
for (i = 0; i < data.length; i++) {
    console.log('slug ', data[i]['attributes']['slug']);
    const image = data[i]['attributes']['posterImage']['large'];
    images.push(`<div class="item"><img src="${image}"><img class="favorite" src="icons/unchecked_favorites.png"></div>`)
}
container.innerHTML = images.join(''); */
/* window.onload = function () {
    const request = new XMLHttpRequest();
    request.open('GET', apiPath + '/trending/anime');
    request.onreadystatechange = function () {
        let images = [];
        if (this.readyState === 4) {
            trending = JSON.parse(this.response)['data'];
            console.log('trending ready', trending);
        }
    };

    request.send();
} */

function Box(props) {

    return (
        <img src={props.img} />
    );
}
class Grid extends React.Component {
    renderBox(i) {
        return (
            <Box
                key={i}
                img={this.props.data[i]['attributes']['posterImage']['large']}
            />
        );
    }

    render() {
        let res = []
        for (let i = 0; i < this.props.data.length; i++) {
            res.push(
            <div key={i} className="item">
                {this.renderBox(i)}
                <img className="favorite" src="icons/unchecked_favorites.png" />
            </div>);
        }
        return res;
    }
}
class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Array(10).fill({attributes: {posterImage: {large: "icons/loading_icon.png"}}}),
            favorites: [],

        }
    }

    componentDidMount() {
        $.getJSON(apiPath + '/trending/anime', (info) => {
            this.setState({
                data: info['data']
            })
        });
    }
    handleFavoriteClick(i) {
        const match = this.state.favorites.filter(item => item == this.state.data[i]);
        if (match.length == 0) {

            this.setState({
                favorites: this.state.favorites.concat(this.state.data[i])
            })
        }
        else {
            this.setState({
                favorites: this.state.favorites.filter(item => item !== this.state.data[i])
            });
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

    render() {
        return (
            <Grid
                data={this.state.data}
            />
        );
    }
}

ReactDOM.render(<Display />, container);