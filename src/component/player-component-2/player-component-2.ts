import Vue from "vue";
import template from './player-component-2.html';
import style from './player-component-2.less';


class Player {
    container: HTMLElement;
    imageList: Array<MyHtmlElement> = [];
    private playing = false;
    loaded = false;

    constructor(private getUrls: () => string[]) {
    }

    setContainer(c: HTMLElement) {
        this.container = c;
    }

    play() {
        if (this.playing) {
            return
        }
        if (!this.loaded) {
            // this.loading = true;
            debugger
            return this.loadImageList()
                .then(() => {
                    // this.loading = false;
                    this.loaded = true;
                    this.play()
                })
        }
        this.playing = true;
        Promise.all(
            this.imageList.map((img: MyHtmlElement, index) => {
                if (index === this.imageList.length - 1) {
                    return img.$fadeTo(0, 1, 100)
                }
                return img.$fadeTo(1, 0, 100)
            })
        )
            .then(() => {
                let index = this.imageList.length;
                const intervalId = setInterval(() => {
                    index--;
                    this.fade(index)
                    if (index < 1) {
                        clearInterval(intervalId)
                        this.playing = false;
                    }

                }, 1000)
            });
        console.log('ok')
    }

    private fade(index: number) {
        this.imageList[index].$fadeTo(0, 1, 1200)
            .then(() => {
                if (index !== 0) {
                    this.imageList[index].$fadeTo(1, 0, 2000)
                }

            })
    }

    onBack() {

    }

    onPlay() {

    }

    loadImageList() {
        const urls = this.getUrls()
        debugger;
        return Promise.all(
            urls.map((url, i) => this.loadImage(url, i))
        )
    }

    loadImage(url: string, index: number) {
        const image = new Image();
        //  image.style.opacity = '0';
        return new Promise((resolve) => {
            image.onload = () => {
                this.imageList.push(image as any)
                resolve(image);
            };
            image.src = url;
            this.container.appendChild(image)
        })
    }
}

export const PlayerComponent2 = Vue.component('player-component-2', {

    props: [
        'container',
        'getUrlList',
        'start'
    ],
    template: template,

    data() {
        const $this = this;
        console.log('sss->', this)
        const player = new Player( () => {

            // @ts-ignore
            return $this.$attrs.getUrlList()
        });
        return {
            scope: {
                player: player
            },
            style: style,
            onBack: () => {

            },
            onPlay: () => {
                $this.start();
                player.play()
            },
            onForward() {

            }
        }
    },
    watch: {
        container(val) {
            if (val) {
                this.$data.scope.player.setContainer(val)
            }
        }
    },
    created(): void {
        // this.$data.scope.container =

        console.log(this.$props.container)
    }


})

