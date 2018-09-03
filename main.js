/* import React from "react";
import ReactDOM from "react-dom";  */
const apiPath = "https://kitsu.io/api/edge";
const wrapper = document.querySelector(".wrapper");
const favButton = document.querySelector(".favorite");
const searchButton = document.querySelector("#search");
let favList;
let xhr;

class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <input type="text" placeholder="Search for anime..." />
                <button id="search" onClick={this.props.searchClick}>Search</button>
            </div>
        );
    }
}
function Box(props) {

    return (
        <div>
            <img src={props.img} />
            <p>{props.title}</p>
        </div>
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
        let srcImg;
        for (let i = 0; i < this.props.data.length; i++) {
            const match = this.props.favorites.filter(item => item == this.props.data[i]['id']);
            match.length == 0 ? srcImg = "icons/unchecked_favorites.png" : srcImg = "icons/checked_favorites.png";
            const titles = this.props.data[i]['attributes']['titles'];

            /* there isn't a way to tell which keys are present, so grab the first one */
            const first = titles[Object.keys(titles)[0]];
            res.push(
                <div key={i} className="item">
                    <p>{first}</p>
                    {this.renderBox(i)}
                    <img onClick={() => this.props.onClick(i)} className="favorite" src={srcImg} />
                </div>);
        }
        return res;
    }
}

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /* include keys and default values in object to avoid null errors */
            data: Array(10).fill({ id: 0, attributes: { posterImage: { large: "icons/loading_icon.png" }, titles: { en_us: "loading", en_jp: "loading", en: "loading" } } }),

            /* check if anime has been favorited before */
            favorites: localStorage.getItem("favArray") !== null ? localStorage['favArray'].split(',') : []
        }
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.getData = this.getData.bind(this);
        this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
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
        const match = this.state.favorites.filter(item => item == this.state.data[i]['id']);
        let res;
        if (match.length == 0) {
            res = this.state.favorites.concat(this.state.data[i]['id']);
            this.setState({
                favorites: res
            });

        }
        else {
            res = this.state.favorites.filter(item => item !== this.state.data[i]['id']);
            this.setState({
                favorites: res
            });
        }
        localStorage.setItem("favArray", res);
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
        const query = terms.replace(' ', '%20');
        xhr = new XMLHttpRequest();
        xhr.open('GET', apiPath + '/anime?filter[text]=' + query);
        xhr.addEventListener("readystatechange", this.getData);
        xhr.send();
    }

    render() {

        return (
            <div className="container">
                <Grid
                    data={this.state.data}
                    favorites={this.state.favorites}
                    onClick={i => this.handleFavoriteClick(i)}
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

    /* get the search method from the display component */
    myCallback = (dataFromChild) => {
        this.setState({ childData: dataFromChild });
    }

    render() {
        /* call the display component's search method with the search input */
        return (<div className="filler">
            <Search searchClick={() => this.state.childData(document.querySelector(".search input").value)} />
            <Display callback={this.myCallback} />
        </div>);
    }
}

ReactDOM.render(<App />, wrapper);