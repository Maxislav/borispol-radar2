
const storages = {};

/**
 * @type {string} storageKey Default value
 */
const storageKey = 'meteo-radar';
const jsonParse = (str) => {
    let json;
    try {
        json = JSON.parse(str)
    } catch (err) {
        console.warn('Error parse json from localStorage')
    }
    return json || {};
};


class Storage  {
    constructor(name) {
        this.storageKey = `${storageKey}-${name}`
    }

    /**
     * @param name
     * @param value
     * @return {*}
     */
    setItem(name, value) {
        const json = this.json;
        json[name] = value;
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
        this._doChange && this._doChange(json);
        //this.emit(name, value);
        return value
    }

    /**
     * @param {string} name
     * @return {number|string}
     */
    getItem(name) {
        return this.json[name]
    }

    /**
     * @param {any} name
     * @return {Storage}
     */
    removeItem(name) {
        const json = this.json;
        delete json[name];
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
        return this
    }


    /**
     * Удаление полностью ключа со всем содержимым
     * @return {Storage}
     */
    remove() {
        window.localStorage.removeItem(this.storageKey)
        return this
    }

    /**
     * @return {{}}
     */
    get json() {
        return jsonParse(window.localStorage.getItem(this.storageKey))
    }


    /**
     * @param {Function.<*>} f
     */
    set doChange(f) {
        this._doChange = f
    }
}


export const create = (name) => {
    if (storages[name]) {
        return storages[name]
    }
    return storages[name] = new Storage(name)
}
