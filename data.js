const popura = require('popura');
 
class AbstractAnimeDataSource {
    getAnime(name) {
        throw "Implementation error";
    }

    _constructAnimeModel(animeResponse) {
        throw "Implementation error";
    }
}

class Anime {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

class MALClient extends AbstractAnimeDataSource {
    constructor(popuraClient) {
        super();
        this._client = popuraClient;
    }

    getAnime(name) {
        return new Promise((resolve, reject) => {
            this._client.searchAnimes(name)
                .then(response => {
                    const result = response.shift();
                    resolve(resolve === null ? result : this._constructAnimeModel(result));
                })
                .catch(err => reject(err));
        });
    }

    _constructAnimeModel(animeResponse) {
        return new Anime(animeResponse.title, animeResponse.score); 
    }
}

const mal = new MALClient(popura(process.env.MAL_USERNAME, process.env.MAL_PASSWORD));

module.exports = mal;