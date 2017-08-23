class Color extends Array{

    constructor(){
       super();
       Color.const.map((item, i)=>{
           const color = {
               id: i,
               text:item.text,
               hex: item.hex,
               colorHex: '#'+item.hex,
               colorDec: parseInt(item.hex, 16)
           };
           return this.push(color)
        })
    }

    static get const(){
        return[
            {
                hex: '9beb8f',
                text: 'Осадки слабые'
            },
            {
                hex: '58ff42',
                text: 'Остадки умеренные'
            },
            {
                hex: '48c277',
                text: 'Остадки сильные'
            },
            {
                hex: '9be1ff',
                text: 'Конвективная облачность'
            },
            {
                hex: '4793f8',
                text: 'Конвективные осадки слабые'
            },
            {
                hex: '0c59ff', //206cfd
                text: 'Конвективные осадки умерянные'
            },
            {
                hex: '6154bf',
                text: 'Конвективные осадки сильные'
            },
            {
                hex: 'ff8c9b',
                text: 'Гроза вероятность 30-70%'
            },
            {
                hex: 'ff3c36',
                text: 'Гроза вероятность 70-90%'
            },
            {
                hex: 'c20511',
                text: 'Гроза вероятность 90%-100%'
            },
            {
                hex: 'ffeb0a',
                text: 'Слабый град'
            },
            {
                hex: 'ff9812',
                text: 'Град умерянный'
            },
            {
                hex: 'a84c06',
                text: 'Град сильный'
            },
            {
                hex: 'dda8ff',
                text: 'Шквал слабый'
            },
            {
                hex: 'e859ff',
                text: 'Шквал умерянный'
            },
            {
                hex: 'be1cff',
                text: 'Шквал сильный'
            }
        ]
    }
}

export default new Color();