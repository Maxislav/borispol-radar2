class Color extends Array{

    constructor(){
       super();
       Color.const.map((item, i)=>{
           const color = {
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
                text: 'Остадки умерянные'
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
                text: 'Конвективная осадки слабые'
            },
            {
                hex: '0d5eff',
                text: 'Конвективная осадки умерянные'
            },
            {
                hex: '6154bf',
                text: 'Конвективная осадки сильные'
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
                hex: 'ffeb0a',
                text: 'Слабый град'
            },
            {
                hex: 'ff9812',
                text: 'Град умерянный'
            }
        ]
    }
}

export default new Color();