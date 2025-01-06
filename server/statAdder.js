// Stats

const preSeason = [
    {
        "acone27@jesuitmail.org": 44.477,
        "aliu28@jesuitmail.org": 0,
        "abuyuk28@jesuitmail.org": 27.468,
        "akumar27@jesuitmail.org": 5.43,
        "ahuang26@jesuitmail.org": 55.493,
        "akondred28@jesuitmail.org": 41.498,
        "arexroad28@jesuitmail.org": 40.348,
        "acurbow27@jesuitmail.org": 62.129,
        "apowvalla26@jesuitmail.org": 58.306,
        "abansal28@jesuitmail.org": 41.263,
        "anigam27@jesuitmail.org": 36.381,
        "bschind25@jesuitmail.org": 44.186,
        "cching28@jesuitmail.org": 0,
        "cveloso27@jesuitmail.org": 53.683,
        "cvanzan26@jesuitmail.org": 60.785,
        "cstarmor27@jesuitmail.org": 48.983,
        "dsoni28@jesuitmail.org": 22.31,
        "ewhite25@jesuitmail.org": 58.778,
        "enguyen25@jesuitmail.org": 33.83,
        "epaes27@jesuitmail.org": 62.847,
        "flove28@jesuitmail.org": 57.975,
        "fstreu28@jesuitmail.org": 56.91,
        "fdemerell27@jesuitmail.org": 2.528,
        "gwerts26@jesuitmail.org": 53.957,
        "gwang28@jesuitmail.org": 0,
        "ischmidt25@jesuitmail.org": 15.289,
        "iveloso25@jesuitmail.org": 29.19,
        "imamor27@jesuitmail.org": 44.982,
        "jdavis25@jesuitmail.org": 49.302,
        "jvlasak28@jesuitmail.org": 20.465,
        "jmurdoch27@jesuitmail.org": 4.009,
        "jhiramat28@jesuitmail.org": 27.003,
        "kkummel27@jesuitmail.org": 34.891,
        "kbori27@jesuitmail.org": 25.208,
        "ktran27@jesuitmail.org": 23.721,
        "kczarn26@jesuitmail.org": 48.197,
        "lvuppa28@jesuitmail.org": 0,
        "mgrund25@jesuitmail.org": 0,
        "mbuizon26@jesuitmail.org": 51.402,
        "mramsey27@jesuitmail.org": 56.812,
        "mmotter28@jesuitmail.org": 53.911,
        "nharakal28@jesuitmail.org": 52.043,
        "ovacmu26@jesuitmail.org": 58.28,
        "okummel27@jesuitmail.org": 32.411,
        "phanifan28@jesuitmail.org": 3.578,
        "ppinto27@jesuitmail.org": 0,
        "ssantosh28@jesuitmail.org": 6.654,
        "sscholin2026@edisonhs.org": 37.826,
        "sragha27@jesuitmail.org": 0,
        "svellanki28@jesuitmail.org": 13.303,
        "skattar26@jesuitmail.org": 41.671,
        "sgowda26@jesuitmail.org": 45.14,
        "twagner25@jesuitmail.org": 46.923,
        "wborne28@jesuitmail.org": 39.177,
        "xpederson28@jesuitmail.org": 51.367,
        "zhem27@jesuitmail.org": 36.141,
        "zpersun27@jesuitmail.org": 47.126
    }
]

function getPreSeasonHours(email) {
    for (let i = 0; i < preSeason.length; i++) {
        if (preSeason[i].hasOwnProperty(email)) {
            return preSeason[i][email];
        }
    }
}

function getData() {
    return preSeason;
}

module.exports = {
    getPreSeasonHours,
    getData
};