export const getConsoleKey = (key: string): string | undefined =>{
    const regexp = new RegExp('\-\-'.concat(key).concat('$'))
    const index = process.argv.findIndex(it  => it.match(regexp));
    if(index == -1) return;
    const value = process.argv[index+1]
    if (!value || value.match(/^\-\-/)) return
    return value
}