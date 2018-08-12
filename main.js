/* import React from "react";
import ReactDOM from "react-dom";  */
const apiPath = "https://kitsu.io/api/edge";
const wrapper = document.querySelector(".wrapper");
const favButton = document.querySelector(".favorite");
const searchButton = document.querySelector("#search");
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
class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <input type="text" placeholder="Search for anime..." />
                <button id="search" onClick={this.props.searchClick}>Search</button>
            </div>
        )
    }
}
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
            data: Array(10).fill({ attributes: { posterImage: { large: "icons/loading_icon.png" } } }),
            favorites: [],

        }
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.props.callback(this.handleSearchClick);
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
                data: newData,
            })
        }
    }

    handleSearchClick(terms) {
        console.log("search Clicked!: ", terms);
        const query = terms.replace(' ', '%20');
        xhr = new XMLHttpRequest();
        xhr.open('GET', apiPath + '/anime?filter[text]=' + query);
        xhr.addEventListener("readystatechange", this.getData);
        xhr.send();
        console.log("data is: ", this.state.data);
    }

    render() {

        return (
            <div className="container">
                <Grid
                    data={this.state.data}
                />
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childData: null,
        }
    }
    myCallback = (dataFromChild) => {
        console.log("callback enabled!", dataFromChild);
        this.setState({ childData: dataFromChild });
    }
    render() {
        return (<div className="filler">
            <Search searchClick={() => this.state.childData(document.querySelector(".search input").value)} />
            <Display callback={this.myCallback} />
        </div>);
    }
}
ReactDOM.render(<App />, wrapper);