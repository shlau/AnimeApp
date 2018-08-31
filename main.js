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
/*         console.log("slug is", this.props.data[i]['attributes']['titles']['en']); */
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
            console.log("current is", this.props.data[i]);
            console.log("favorites is", this.props.favorites);
            console.log("match length:", match.length);
            match.length == 0 ? srcImg = "icons/unchecked_favorites.png" : srcImg = "icons/checked_favorites.png";
            const titles = this.props.data[i]['attributes']['titles'];
            const first = titles[Object.keys(titles)[0]];
            res.push(
                <div key={i} className="item">
                    <p>{first}</p>
                    {this.renderBox(i)}
                    <img onClick={()=>this.props.onClick(i)} className="favorite" src={srcImg} />
                </div>);
        }
        return res;
    }
}

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Array(10).fill({ id: 0, attributes: { posterImage: { large: "icons/loading_icon.png" }, titles: { en_us: "loading", en_jp:"loading", en:"loading" } } }),
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
        localStorage.setItem("favArray",res);
        console.log("Passing favorites: ", res);
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
 /*        console.log("search Clicked!: ", terms); */
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
                    favorites={this.state.favorites}
                    onClick = {i => this.handleFavoriteClick(i)}
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
/*         console.log("callback enabled!", dataFromChild); */
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