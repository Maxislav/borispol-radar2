import Vue from "vue";
import template from './player-component-2.html';
import style from './player-component-2.less';

interface IImage {
    index: number,
    img: MyHtmlElement
}

class Player {

    private container: HTMLElement;
    private imageList: Array<IImage> = [];
    private playing = false;
    private loaded = false;
    private loadedCount = 0;
    private urlList: Array<string>;

    constructor(private getUrls: () => string[], private loadProgress: (progress: {loading: boolean, value: number}) => void) {
    }

    setContainer(c: HTMLElement) {
        this.container = c;
    }

    play() {
        if (this.playing) {
            return
        }
        if (!this.loaded) {
            this.loadProgress({
                loading: true,
                value: 0
            });
            return this.loadImageList()
                .then(() => {
                    // this.loading = false;
                    this.loaded = true;
                    this.imageList.sort((a, b) => {
                        return a.index - b.index
                    });
                    this.play()
                })
        }
        this.playing = true;
        Promise.all(
            this.imageList.map((iImage: IImage, index) => {
                if (index === this.imageList.length - 1) {
                    return iImage.img.$fadeTo(0, 1, 100)
                }
                return iImage.img.$fadeTo(1, 0, 100)
            })
        )
            .then(() => {
                let index = this.imageList.length;
                const intervalId = setInterval(() => {
                    index--;
                    this.fade(index);
                    if (index < 1) {
                        clearInterval(intervalId);
                        this.playing = false;
                    }

                }, 1000)
            });
        console.log('ok')
    }

    private fade(index: number) {
        this.imageList[index].img.$fadeTo(0, 1, 1200)
            .then(() => {
                if (index !== 0) {
                    this.imageList[index].img.$fadeTo(1, 0, 2000)
                }
            })
    }

    onBack() {

    }

    onPlay() {

    }

    loadImageList() {
        const urls = this.urlList = this.getUrls();
        return Promise.all(
            urls.map((url, i) => this.loadImage(url, i))
        )
    }

    loadImage(url: string, index: number) {
        const image = new Image();
        image.style.zIndex = String(100 - index);
        return new Promise((resolve) => {

            image.onload = () => {
                this.imageList.push({
                    index,
                    img: image as any
                });
                resolve(image);
                this.loadedCount++;
                this.loadProgress({
                    loading: this.loadedCount < this.urlList.length,
                    value: 100*this.loadedCount/this.urlList.length
                })
            };
            image.src = url;
            this.container.appendChild(image)
        })
    }
}

export const PlayerComponent2 = Vue.component('player-component-2', {

    props: [
        'container',
        'geturllist',
        'start',
        'loadprogress'
    ],
    template: template,

    data() {
        const $this = this;
        console.log('sss->', this)
        const player = new Player(this.geturllist, this.loadprogress);

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

