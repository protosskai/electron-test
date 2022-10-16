import axios from "../lib/http";
import fs from "fs";


let myCookie = '';
const apiUrlA = 'https://api.bilibili.com/x/web-interface/view';
const apiUrlB = "https://api.bilibili.com/x/player/playurl";
const UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:56.0) Gecko/20100101 Firefox/56.0";



const bv2av = function (bvOrAv, is2Bv) {
    const table =
        "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF",
        tr = {};
    for (let i = 0; i < 58; i++) {
        tr[table[i]] = i;
    }
    const s = [11, 10, 3, 8, 4, 6],
        xor = 177451812,
        add = 8728348608;

    function dec(x) {
        let r = 0;
        for (let i = 0; i < 6; i++) {
            r += tr[x[s[i]]] * 58 ** i;
        }
        return (r - add) ^ xor;
    }

    function enc(x) {
        let r = 0;
        x = (x ^ xor) + add;
        r = "BV1  4 1 7  ".split("");
        for (let i = 0; i < 6; i++) {
            r[s[i]] = table[Math.floor(x / 58 ** i) % 58];
        }
        return r.join("");
    }
    if (is2Bv) {
        return enc(parseInt(bvOrAv));
    }
    return dec(bvOrAv);
};
export const extractAid = (url) => {
    const pattern = new RegExp('\/video\/([av|bv][a-z0-9]+)', 'i');
    const matches = pattern.exec(url);
    if (matches.length >= 2) {
        let aid = matches[1];
        if (aid.indexOf('av') >= 0) {
            aid = aid.substring(aid.lastIndexOf('av') + 2);
        } else if (aid.indexOf('BV') >= 0) {
            aid = aid.substring(aid.lastIndexOf('BV'));
            if (aid.indexOf('/') > 0) {
                aid = aid.substring(0, aid.indexOf('/'));
            }
            aid = ('' + bv2av(aid)).trim();
        }
        console.log('aid:[%s]', aid);
        return aid;
    }
    return null;
}

export const getVideoInfo = async (aid) => {
    const resp = await axios.request({
        method: "get",
        url: apiUrlA,
        headers: {
            "User-Agent": UA,
            Cookie: myCookie,
        },
        params: {
            aid,
        },
    });
    const info = resp.data;
    if (info.data) {
        return info.data;
    }
    console.error('无video数据:%j', info);
    return null;
}

export const getDownloadInfo = async (aid, cid, qualityNum) => {
    const resp = await axios.request({
        method: "get",
        url: apiUrlB,
        headers: {
            "User-Agent": UA,
            Cookie: myCookie,
        },
        params: {
            avid: aid,
            cid,
            qn: qualityNum,
            otype: "json",
        },
    });
    const info = resp.data;
    if (info.data) {
        return info.data;
    }
    console.error('无download数据:%j', info);
    return null;
}


export const getPartInfo = (videoInfo) => {
    if (videoInfo.pages && videoInfo.pages.length > 1) {
        const pageArr = [];
        const pageCount = videoInfo.pages.length;
        for (let i = 0; i < pageCount; i++) {
            const pageOne = videoInfo.pages[i];
            pageArr.push(pageOne.part);
        }
        return pageArr;
    }
    return null;
}


export const getStreamInfoTable = (videoInfo, downloadInfo) => {
    const result = {};
    const pageArr = [];
    const qualityArr = [];
    for(let page of videoInfo.pages) {
        pageArr.push(page);
    }
    result.pages = pageArr;
    for(let i = 0; i < downloadInfo.accept_quality.length; i++){
        qualityArr.push({
            quality:  downloadInfo.accept_quality[i],
            desc: downloadInfo.accept_description[i]
        })
    }
    result.qualities = qualityArr;
    return result;
}