/**
 * Created by liu on 2018/5/9.   
 * fatch
 * url:请求路径 
 * params:请求参数
 */

export default class FetchAsync {
    // get
    static getFatch(url) {
        let geturl = url;
        return new Promise((resolve, reject) => {
                var url = 'http://127.0.0.1:3000/' + geturl;
                fetch(url, {
                    method: 'GET',
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Token': localStorage.getItem('token')
                    },
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject({status: response.status})
                    }
                }).then((res) => {
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            }
        )
    }

    // post
    static postFatch(url, params) {
        console.log(params);
        var url = 'http://127.0.0.1:3000/' + url;
        return new Promise((resolve, reject) => {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        'Token': localStorage.getItem('token')
                    },
                    body: JSON.stringify(params)
                }).then(response => response.json()).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                });
            }
        )
    }
}
 