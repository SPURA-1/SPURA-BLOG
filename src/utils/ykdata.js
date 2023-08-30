//渐变色
export const color = [
    [
        'linear-gradient(180deg, #FFA7EB 0%, #F026A8 100%)',
        'linear-gradient(180deg, #DFA1FF 0%, #9A36F0 100%)',
        'linear-gradient(180deg, #9EAAFF 0%, #3846F4 100%)',
        'linear-gradient(180deg, #7BE7FF 2%, #1E85E2 100%)',
        'linear-gradient(180deg, #89FED8 0%, #18C997 100%)',
        'linear-gradient(180deg, #FFED48 0%, #FD9E16 100%)',
        'linear-gradient(180deg, #FFBA8D 1%, #EB6423 100%)',
    ],
    [
        '#2B7AF5', '#2B9DF5', '#79CFFF', '#1B67DD', '#4F94FF', '#2180F2', '#3FD0FF',
    ],
];

//7种方块元素
export const blockMod = (color) => {
    let a = {
        site: [0, 1, 0, 2, 1, 2, 2, 2],
        color: color[0],
    };
    let b = {
        site: [0, 1, 1, 1, 1, 2, 2, 2],
        color: color[1],
    };
    let c = {
        site: [1, 1, 1, 2, 2, 1, 2, 2],
        color: color[2],
    };
    let d = {
        site: [1, 0, 1, 1, 1, 2, 1, 3],
        color: color[3],
    };
    let e = {
        site: [0, 2, 1, 1, 1, 2, 2, 1],
        color: color[4],
    };
    let f = {
        site: [0, 1, 0, 2, 1, 1, 2, 1],
        color: color[5],
    };
    let g = {
        site: [1, 1, 2, 0, 2, 1, 2, 2],
        color: color[6],
    };
    return ([a, b, c, d, e, f, g]);
};

//旋转规则
export const transition = [
    [
        {
            x: 1, y: 1,
        }, {
            x: 1, y: 0,
        }, {
            x: 0, y: -2,
        }, {
            x: -2, y: 1,
        }
    ],
    [
        {
            x: 1, y: 1,
        }, {
            x: 1, y: 0,
        }, {
            x: 0, y: -2,
        }, {
            x: -2, y: 1,
        }
    ],
    [
        {
            x: 0, y: 1,
        }, {
            x: 1, y: 0,
        }, {
            x: 0, y: -1,
        }, {
            x: -1, y: 0,
        }
    ],
    [
        {
            x: -1, y: 2,
        }, {
            x: 1, y: 1,
        }, {
            x: 2, y: -1,
        }, {
            x: -2, y: -2,
        }
    ],
    [
        {
            x: 2, y: 0,
        }, {
            x: 0, y: -1,
        }, {
            x: -1, y: -1,
        }, {
            x: -1, y: 2,
        }
    ],
    [
        {
            x: 1, y: 1,
        }, {
            x: 1, y: 0,
        }, {
            x: 0, y: -2,
        }, {
            x: -2, y: 1,
        }
    ],
    [
        {
            x: 0, y: 0,
        }, {
            x: 1, y: 0,
        }, {
            x: -1, y: 0,
        }, {
            x: 0, y: 0,
        }
    ],
]