declare module '*.html' {
    const content: string;
    export default content;
}
declare module '*.less' {
    const content: { [key: string]: any };
    export default content;
}

declare interface MyHtmlElement extends HTMLElement {
    $fadeTo(from: number, to: number, duration: number, promiseResolveTime?: number): Promise<this>
}


interface Window {
    GmI: any
}
