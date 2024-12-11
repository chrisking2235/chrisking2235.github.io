data = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    [NaN, 38125.87, 0, 15432.78, -3847.32, 22841.09, 14732.16, 0, 30225.54, 26412.98, 9834.23, -1984.65, 0, 21998.45, 33125.32, 27341.67, -4218.97, 0, 18243.78, 14534.21, 25983.16, -2391.54, 17231.44, 19874.32, 21456.09, 0, 20315.87, 34827.41, 16245.53, 28394.18, -3125.49],
    [NaN, 21348.78, 17483.45, 14295.23, 0, -2893.47, 19832.41, 13542.34, 22984.56, 0, 16478.12, 14921.39, 19543.78, 0, 11842.90, -3194.67, 15384.56, 18743.67, 20492.15, 12394.78, 22184.34, 16834.57, 14129.34, 18984.21, 15293.67, 19382.14, 10843.67, 17934.12, 21394.87, 13248.12, 18729.45, 14598.21],
    [NaN, 0, 14938.56, 11283.45, 18495.32, 0, 22194.87, 15832.19, 10345.67, 0, 19875.43, 12394.76, 0, 16938.25, 13429.87, 21394.56, 0, 14384.23, 0, -2473.89, 19283.45, 0, 17394.58, 18982.32, 15329.87, 0, 20487.45, 19832.56, 0, 16489.34, 14283.67],
    [NaN, 10348.56, 0, 9483.12, 11234.45, 7492.89, 13984.23, -3294.78, 0, 14582.34, 13048.68]
]

cal_data = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    [
        1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28,
        29, 30, 0, 0, 0, 0, 0
    ],
    [
        0, 0, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 0, 0
    ],
    [
        0, 0, 0, 0, 0, 1, 2,
        3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30,
    ],
    [
        1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
]

/* 
            <div class="row">
                <div class="cal"></div>
                <div class="cal"></div>
                <div class="cal"></div>
                <div class="cal"></div>
                <div class="cal"></div>
                <div class="cal red">
                    <p class="date">5</p>
                    <p class="percent red">-2,893.47</p>
                </div>
                <div class="cal green">
                    <p class="date">6</p>
                    <p class="percent green">+22,184.34</p>
                </div>
            </div>

            </div>
*/
let calendar_storage = '';
function gen_calendar(month, range_start, range_end, ) {
    let str = '';
    for (let i=0;i<5;i++) {
        str += '<div class="row">'
        for (let j=0;j<7;j++)
        {
            let idx = i*7+j;
            let day = cal_data[month][idx];
            let date = new Date(2024, month-1, day);
            if (!(range_start <= date && date <= range_end) || day == 0)
            {
                console.log(date, day)
                str += '<div class="cal"></div>'
            }

            else  {
                if (data[month][day] == 0) str += `<div class="cal" style="justify-content: center;"><p class="date" style="top: 0;">${day}</p></div>`
                else if (data[month][day] > 0) str += 
                    `<div class="cal green">
                        <p class="date">${day}</p>
                        <p class="percent green">+${floatString(data[month][day])}</p>
                    </div>`
                else str += 
                    `<div class="cal red">
                        <p class="date">${day}</p>
                        <p class="percent red">${floatString(data[month][day])}</p>
                    </div>`
            }
        }
        str += '</div>'
    }
    calendar_storage = str;
    // console.log(calendar_storage)
}

gen_calendar(12, new Date(2024, 12-1, 1), new Date())
// document.getElementById('calendar').innerHTML = rec[0];
// console.log(rec[1])


// profit, loss
let lst = [];
let ranges = [7, 30, 90]
for (let period of ranges) {
    let date = new Date(), now = new Date();
    let profit=0, loss=0;
    for (let i=1;i<=period;i++) {
        date.setDate(date.getDate() - 1);
        let price = data[date.getMonth()][date.getDay()];
        if (price > 0) profit += price;
        else if (price < 0) loss -= price;
        // else console.log(date)
    }
    lst.push({
        'profit': profit,
        'loss': loss,
        'total': profit - loss
    })
}

let profit=0, loss=0;
for (let i=9;i<=12;i++) {
    for (let j=1;j<data[i].length;j++) {
        let price = data[i][j];
        if (price > 0) profit += price;
        else if (price < 0) loss -= price;
    }
}
lst.push({
    'profit': profit,
    'loss': loss,
    'total': profit - loss
})

function refreshPopup() {
    document.getElementById('calendar').innerHTML = ''
    document.getElementById('7d-pnl-usd').innerHTML = floatString(lst[0].total);
    document.getElementById('30d-pnl-usd').innerHTML = floatString(lst[1].total);
    document.getElementById('lifetime-pnl-usd').innerHTML = floatString(lst[3].total);
}
console.log(lst);

let bg_left = [35, 125, 216, 306]
function changePeriod(elem, idx=3) {
    document.querySelector('.sel').classList.remove('sel');
    elem.classList.add('sel')
    /* 7D: 35 / 1M: 125 / 3M: 216 / 1Y: 306px*/
    document.getElementById('period-bg').style = `left: ${bg_left[idx]}px;`

    document.getElementById('total-profit').innerHTML = `${floatString(lst[idx].profit)} USD`
    document.getElementById('total-loss').innerHTML = `${floatString(lst[idx].loss)} USD`
    document.getElementById('total-total').innerHTML = `${floatString(lst[idx].total)} USD`


    let range_start = new Date()
    range_start.setDate(range_start.getDate() - ranges[idx]);
    // console.log(date1, new Date())
    let range_end = new Date()
    gen_calendar(12, range_start, range_end);
    loading();
}

function floatString(str) {
    return parseFloat(str).toLocaleString(undefined, {'minimumFractionDigits':2,'maximumFractionDigits':2});
}