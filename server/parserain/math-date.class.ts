export class MathDate{

    getCurrentDate(): Date{
        const d = new Date();
        const ss = parseInt(d.getSeconds()/30)*30;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), ss, 0)
    }
}


