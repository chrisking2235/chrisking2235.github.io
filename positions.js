const MAINTENANCE_MARGIN_RATES = {
    125: 0.004,
    50: 0.005,
    25: 0.01,
    15: 0.015,
    5: 0.025,
    3: 0.05
};

const BINANCE_MARK_PRICE_URL = "https://fapi.binance.com/fapi/v1/premiumIndex";

let calculatedLiquidationPrice = null;
let currentPrice = null;

async function getCurrentPrice(symbol = "BTCUSDT") {
    try {
        const response = await fetch(`${BINANCE_MARK_PRICE_URL}?symbol=${symbol}`);
        if (response.ok) {
            const data = await response.json();
            return parseFloat(data.markPrice);
        } else {
            alert("Failed to fetch the current price.");
            console.error("Response status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching price:", error);
        alert("An error occurred while fetching the price.");
    }
    return null;
}


const USDTUSD_URL = "https://api.kraken.com/0/public/Ticker"

async function getUsdtUsd(pair="USDTUSD") {
    try {
        const response = await fetch(`${USDTUSD_URL}?pair=${pair}`);
        if (response.ok) {
            const data = await response.json();
            return parseFloat(data.result.USDTZUSD.b[0]);
        } else {
            alert("Failed to fetch the USDTUSD.");
            console.error("Response status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching USDTUSD:", error);
        alert("An error occurred while fetching the USDTUSD.");
    }
    return null;
}
const v = parseInt(localStorage.getItem('v'))
document.getElementById('v').innerHTML = floatString(v);

const entryPrice = parseFloat(localStorage.getItem('entry_price'))
const margin = parseFloat(localStorage.getItem('margin'))
const leverage = parseInt(localStorage.getItem('leverage'))

document.getElementById('entry_price').innerHTML = floatString(entryPrice);
document.getElementById('margin').innerHTML = floatString(margin);
document.getElementById('leverage').innerHTML = `Isolated ${leverage}X`;

let a = 0, pnl = 0;

setInterval(async () => {
    try {
        if (isNaN(entryPrice) || isNaN(margin)) {
            alert("Please enter valid numbers for Entry Price and Margin.");
            return;
        }

        const maintenanceMarginRate = MAINTENANCE_MARGIN_RATES[leverage];
        const positionSize = (margin * leverage) / entryPrice;

        const currentPrice = await getCurrentPrice();
        if (currentPrice === null) return;

        const usdtusd = await getUsdtUsd() + (Math.random() % 100) / 1000000;
        // console.log(usdtusd)

        const maintenanceMargin = positionSize * currentPrice * maintenanceMarginRate;
        pnl = (currentPrice - entryPrice) * positionSize;
        const roi = (pnl / margin) * 100;

        if (calculatedLiquidationPrice === null) {
            calculatedLiquidationPrice = entryPrice - (margin / positionSize) - maintenanceMargin + 347;
        }

        const accountEquity = margin + pnl;
        let marginRatio = (maintenanceMargin / accountEquity) * 100;
        marginRatio -= 5.89;


        // console.log(pnl, roi, calculatedLiquidationPrice, marginRatio)
        document.getElementById("pnl").innerHTML = `${floatString(pnl)}`;
        document.getElementById("roi").innerHTML = `+${floatString(roi)}%`;
        document.getElementById("liq_price").innerHTML = `${floatString(calculatedLiquidationPrice)}`;
        document.getElementById("margin_ratio").innerHTML = `${floatString(marginRatio)}%`;
        document.getElementById("size").innerHTML = `${floatString(margin * leverage)}`;
        document.getElementById("mark_price").innerHTML = `${floatString(currentPrice)}`;


        let p = pnl;
        a = v+p;
        
        // console.log('v: ' +v +'p: ' +p +'a: '+a)
        document.getElementById('a').innerHTML = floatString(a);
        document.getElementById('p').innerHTML = floatString(p);
        document.getElementById('dollar-a').innerHTML = floatStringSix(a*usdtusd);
        document.getElementById('dollar-v').innerHTML = floatString(v*usdtusd);
        document.getElementById('dollar-p').innerHTML = floatStringSix(p*usdtusd);
        document.getElementById('today-pnl').innerHTML = `\$${floatString(pnl)} (${floatString((pnl/a)*100)}%)`
            + '<img style="opacity: 1; transform: translateX(20px);" width="17" src="right_arrow.png">';
    } catch (error) {
        console.error("Error during calculation:", error);
        alert("An error occurred during calculation.");
    }
}, 1000);

function floatString(str) {
    return parseFloat(str).toLocaleString(undefined, {'minimumFractionDigits':2,'maximumFractionDigits':2});
}

function floatStringSix(str) {
    return parseFloat(str).toLocaleString(undefined, {'minimumFractionDigits':6,'maximumFractionDigits':6});
}

const exc = parseInt(localStorage.getItem('exc'))
for (let i=1;i<=exc;i++) {
    document.getElementById(`exc${i}`).classList.add('exc-green');
}