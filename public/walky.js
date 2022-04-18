(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walk_1 = require("../lib/tree/walk");
const util_1 = require("../lib/util");
const w_1 = require("../lib/w");
document.body.append(`Hello LA. You're up way past your bedtime`);
const testView = document.createElement('div');
const testViewStyle = {
    display: 'block',
    width: '80vmin',
    height: '45vmin',
    background: '#eee'
};
Object.assign(testView.style, testViewStyle);
document.body.append(testView);
// how does canvas behave?
// it takes initial dimensions and uses contain to fill parent element
const canvasCss = {
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
};
let lastSize;
let currentCanvas;
let resizeListener;
let htmlCanvas;
const dirty = {};
const tick = async (time) => {
    const { size } = dirty;
    if (size !== undefined) {
        // .. do stuff
        dirty.size = undefined;
    }
    if (htmlCanvas === undefined || currentCanvas === undefined)
        return;
    const ctx = (0, util_1.ass)(htmlCanvas.getContext('2d'));
    const color = currentCanvas.value.bg ? `rgb(${currentCanvas.value.bg.join()})` : '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
    ctx.font = '8px sans-serif';
    (0, walk_1.walk)(canEl, node => {
        if ('text' in node.value) {
            const { value } = node;
            const color = value.color ? `rgb(${value.color.join()})` : '#fff';
            ctx.fillStyle = color;
            const text = value.name === 'debugPointer' ? String(time | 0) : value.text;
            ctx.fillText(text, value.x, value.y + 8);
        }
    });
    requestAnimationFrame(tick);
};
const addCanvas = (parent, el) => {
    removeCanvas(parent);
    parent.style.position = 'relative';
    const { width, height } = parent.getBoundingClientRect();
    htmlCanvas = document.createElement('canvas');
    htmlCanvas.width = el.value.width;
    htmlCanvas.height = el.value.height;
    const ctx = (0, util_1.ass)(htmlCanvas.getContext('2d'));
    ctx.fillStyle = '#39f';
    ctx.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
    Object.assign(htmlCanvas.style, canvasCss);
    parent.append(htmlCanvas);
    lastSize = [width, height].join();
    currentCanvas = el;
    resizeListener = () => {
        const { width, height } = parent.getBoundingClientRect();
        const size = [width, height].join();
        if (size === lastSize)
            return;
        dirty.size = { width, height };
    };
    window.addEventListener('resize', resizeListener);
    requestAnimationFrame(tick);
};
const removeCanvas = (parent) => {
    if (resizeListener !== undefined) {
        window.removeEventListener('resize', resizeListener);
    }
    if (currentCanvas !== undefined) {
        currentCanvas = undefined;
        htmlCanvas = undefined;
        (0, util_1.ass)(parent.querySelector('canvas')).remove();
    }
};
const canSize = { width: 160, height: 144 };
const canEl = (0, w_1.wcanvas)(canSize, { bg: [51, 255, 153] }, (0, w_1.wspan)('walky'), (0, w_1.wspan)('schrkNET v1.666'), (0, w_1.wspan)('----------', { y: 8 }), (0, w_1.wspan)('==========', { y: canSize.height - 16 }), (0, w_1.wspan)('[0,0]', { name: 'debugPointer', y: canSize.height - 8 }));
const pre = document.createElement('pre');
(0, walk_1.walk)(canEl, (node, depth = 0) => {
    pre.append(`${' '.repeat(depth * 2)}${node.value.name}\n`);
});
document.body.append(pre);
let hasCanvas = false;
testView.addEventListener('click', () => {
    if (hasCanvas) {
        removeCanvas(testView);
        hasCanvas = false;
    }
    else {
        addCanvas(testView, canEl);
        hasCanvas = true;
    }
});

},{"../lib/tree/walk":4,"../lib/util":5,"../lib/w":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N = void 0;
const N = (value, ...children) => {
    const node = { value, children };
    return node;
};
exports.N = N;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTNode = void 0;
const isTNode = (item) => item && 'value' in item;
exports.isTNode = isTNode;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = void 0;
const walk = (node, cb, depth = 0, parent) => {
    const isHalt = cb(node, depth, parent);
    if (isHalt)
        return isHalt;
    if (node.children) {
        for (const child of node.children) {
            const isHalt = (0, exports.walk)(child, cb, depth + 1, node);
            if (isHalt)
                return isHalt;
        }
    }
};
exports.walk = walk;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ass = void 0;
const ass = (value) => {
    if (value === undefined)
        throw Error('Unexpected undefined');
    if (value === null)
        throw Error('Unexpected null');
    return value;
};
exports.ass = ass;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wspan = exports.wcanvas = exports.W = void 0;
const n_1 = require("../tree/n");
const predicates_1 = require("../tree/predicates");
const W = (_name, value, ...args) => {
    const { children, partials } = args.reduce((prev, curr) => {
        if ((0, predicates_1.isTNode)(curr)) {
            prev.children.push(curr);
        }
        else {
            prev.partials.push(curr);
        }
        return prev;
    }, {
        children: [],
        partials: []
    });
    const node = (0, n_1.N)(value, ...children);
    Object.assign(node.value, ...partials);
    return node;
};
exports.W = W;
const wcanvas = ({ width, height }, ...args) => {
    const canvasEl = {
        width, height, name: [width, height].join('×')
    };
    return (0, exports.W)('canvas', canvasEl, ...args);
};
exports.wcanvas = wcanvas;
const wspan = (text, ...args) => {
    const spanEl = { text, name: text, x: 0, y: 0 };
    return (0, exports.W)('span', spanEl, ...args);
};
exports.wspan = wspan;

},{"../tree/n":2,"../tree/predicates":3}]},{},[1]);
