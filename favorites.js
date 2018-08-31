/* const dataValue = localStorage['favArray'];
console.log("Passed Value ", dataValue); */
const apiPath = "https://kitsu.io/api/edge/anime?filter[id]=";
const favs = document.querySelector(".favoritesList");
let dataValue = localStorage['favArray'].split(",");
let numFav = dataValue.length;
function grabFavorites() {
    res = [];
    $.each(dataValue,function(_,value) {
        $.getJSON(apiPath + value, (info) => {
            const titles = info['data'][0]['attributes']['titles'];
            const first = titles[Object.keys(titles)[0]];
            const poster = info['data'][0]['attributes']['posterImage']['large'];
            const synopsis = info['data'][0]['attributes']['synopsis'];
            favs.innerHTML +=`<div class='favoriteSet'> <div class='group'><p class="title">${first}</p><img src=${poster}></div> <div class="synopsis"><p>${synopsis}</p></div></div>`;
        });
    })

    console.log(res);
    return res;
}

grabFavorites();
