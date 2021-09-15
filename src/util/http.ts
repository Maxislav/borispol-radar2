const createRequest = () => {
    return new XMLHttpRequest();
};

class Http {
    get<T>(url: string): Promise<T> {
        return new Promise((resolve, reject) => {
            const xhr = createRequest();
            xhr.open('GET', url, true);
            xhr.addEventListener('load', () => {
                if (xhr.status != 200) {

                    return reject(xhr)
                }
                console.log(xhr.responseType);
                const contentType = xhr.getResponseHeader('Content-Type');
                let response = null;
                if (contentType.match(/application\/json/)) {
                    response = JSON.parse(xhr.response);
                } else {
                    response = xhr.response
                }
                return resolve(response);
            }, false);
            xhr.addEventListener('error', () => {
                return reject(xhr);
            }, false);
            xhr.send()
        });

    }
}

export const http = new Http();
