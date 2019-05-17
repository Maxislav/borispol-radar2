import { getImageWorker } from "../../util/load-image-blob";
import { urlCron } from "../../config/congig-url";


function getRoundColor(x, y, d, context) {
    const list = [];

    for(let _x = x-d/2; _x<x+d/2; _x++){
        for(let _y= y-d/2; _y<y+d/2; _y++){
            const color = context.getImageData(_x, _y, 1, 1).data;

            list.push(color)
        }
    }
    const res = []
    for(let i = 0; i<3; i++){
        let sum=0;
        list.forEach(rgba => {
            sum+=rgba[i]
        });
        const avg = sum/list.length
        res.push(avg)
    }
    return res

}


function getVerticesColors(canvas) {

    const context = canvas.getContext("2d");

    let dx = 16;
    let dy = dx*Math.pow(3, 1/2) ;


    let points = [];
    let colors = [];
    let vertices = [];
    for(let x = 0; x< 500; x+=dx){
        for(let y = 0; y<canvas.height; y+=dy){
            const vertex = [
                x, y+dy/2,
                x+dx/2, y,
                x+dx, y+dy/2,

                x+dx/2, y,
                x+dx+dx/2, y,
                x+dx, y+dy/2,

                x+dx, y+dy/2,
                x+dx+dx/2, y+dy,
                x+dx/2, y+dy,

                x, y+dy/2,
                x+dx, y+dy/2,
                x+dx/2, y+dy
            ];
            points = points.concat(vertex)

            let _color = [];

            for(let i = 0; i<vertex.length; i+=2){
                const x = vertex[i];
                const y = vertex[i+1];

                const d = context.getImageData(x, y, 1, 1).data;
                // const d = getRoundColor(x, y, dx, context);
                _color = _color.concat(d[0]/255, d[1]/255, d[2]/255)
            }

            colors = colors.concat(_color)

        }

    }

    for(let i = 0; i<points.length; i+=2){
        const x = points[i];
        const y = points[i+1];
        const xFactor = 2/500;
        const yFactor = 2/ canvas.height;


        const xx = x*xFactor - 1;
        const yy = 1 - y*yFactor ;
        vertices.push(xx, yy);

    }

    return {
        vertices,
        colors
    }

}


export function mounted(canvas) {
    var gl = canvas.getContext("webgl");

    const width = canvas.width;
    const height = canvas.height;




    /*var vertices = [
        -0.5,0.5,
        0.5,0.5,
        0.5,-0.5,

        0.5,-0.5,
        -0.5,-0.5,
        -0.5,0.5
    ];


    var colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, 0.0,
    ];*/


    var vertCode =
        'precision mediump float;' +

        'attribute vec2 coordinates;' +
        'attribute vec3 color;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
        ' vColor = color;' +
        ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
        ' gl_PointSize = 4.0;' +
        '}';

    var fragCode =
        'precision mediump float;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
        '  gl_FragColor = vec4(vColor[0], vColor[1], vColor[2], 1.0);' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, vertCode);
    gl.shaderSource(fragShader, fragCode);

    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertShader);

    gl.attachShader(shaderProgram, fragShader);

    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram);

    gl.viewport(0,0,canvas.width,canvas.height);


    function  draw(){

    }

    getImageWorker(urlCron.ukbb)
        .then(image => {

            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            const {vertices, colors} =   getVerticesColors(canvas)

            const vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            const coord = gl.getAttribLocation(shaderProgram, "coordinates");
            gl.vertexAttribPointer(coord, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(coord);

/*
            const dxdy_buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, dxdy_buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.1, 0.0]), gl.STATIC_DRAW);
            const dxdycoord = gl.getAttribLocation(shaderProgram, "dxdy");
            gl.vertexAttribPointer(dxdycoord, 2, gl.FLOAT, gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(dxdycoord);*/



            const color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            const color = gl.getAttribLocation(shaderProgram, "color");
            gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(color);



            gl.clearColor(0.5, 0.5, 0.5, 0.9);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);

            // console.log(vertices.splice(0,24))
                // console.log(colors.splice(0,36))
            //gl.drawElements(gl.TRIANGLES, 100, gl.UNSIGNED_SHORT,0);


        })






}