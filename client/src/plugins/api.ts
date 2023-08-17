class Api{   
    apiSettings : any;
    constructor(){
        this.apiSettings = {
            "https://localhost/": {
                api: "http://192.168.1.111:3000/",
                //api: "http://localhost:3000/",
                assets: "https://localhost/",
            },
            "http://localhost": {
                api: "http://localhost:3000/",
                //api: "http://localhost:3000/",
                assets: "http://localhost:8080/",
            },           
        };
    }
    getBaseUrl(envApi : any) {
        for (const k in this.apiSettings) {
            if (top?.location.href.includes(k)) {
                return envApi ? this.apiSettings[k].api : this.apiSettings[k].assets;
            }
        }
    }
    async get(url : string, options: any = {}) {
        const myHeaders = new Headers();
        if (options.data) {
            url + `?${options.data.join("")}`;
        }
        if (localStorage.token) {
            myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
        }
        //temp hack
        if (localStorage.userId) {
            myHeaders.append("Authorization", `Bearer ${localStorage.userId}`);
        }
        var method = options.method || "GET";
        const requestOptions = {
            method: method,
            headers: myHeaders,
            redirect: "follow",
            credentials: "include",
        };
        const res = await fetch(this.getBaseUrl("api") + url, requestOptions as RequestInit);
        return await res.json();
    }
    async delete(url : string, options: any = {}) {
        options.method = "DELETE";
        return await this.get(url, options);
    }
    async put(url: string, options: any = {}) {
        options.method = "PUT";
        if (options.data) {
            options.body = JSON.stringify(options.data);
        }
        return await this.send(url, options);
    }
    async upload(url: string, options: any = {}) {
        options.method = "POST";
        return await this.send(url, options);
    }
    async post(url: string, options: any = {}) {
        options.method = "POST";
        options.headers = options.headers || {};
        return await this.send(url, options);
    }
    async send(url: string, options: any = {}) {
        const myHeaders = new Headers();
        let data;
        if (options.data && options.method == "POST") {
            data = new FormData();
            for (const p in options.data) {
                data.append(p, options.data[p]);
            }            
            //options.headers["Content-Type"] = `multipart/form-data;  boundary=${bound}`;        
        }
        if (options.jsonData && options.method == "POST") {
            data = JSON.stringify(options.jsonData);           
            options.headers["Content-Type"] = `application/json`;        
        }
        if(options.headers){
            for(const h in options.headers){
                myHeaders.append(h, options.headers[h]);
            }
        }
        if (options.files) {
            data = data || new FormData();
            if(typeof data != "string"){
                for (const file of options.files) {
                    data.append(file.fieldname, file.file, file.file.name);
                }
            }
        }
        if (options.body) {
            data = options.body;
        }
        if (localStorage.token) {
            myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
        }
        //temp hack
        if (localStorage.userId) {
            myHeaders.append("Authorization", `Bearer ${localStorage.userId}`);
        }
        const method = options.method ? options.method : "POST";
        const requestOptions = {
            method: method,
            headers: myHeaders,
            body: data,
            redirect: "follow",
            credentials: "include",
        };
        const res = await fetch(this.getBaseUrl("api") + url, requestOptions as RequestInit);
        return await res.json();
    }
       
};
export default new Api();