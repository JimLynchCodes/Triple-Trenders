
const GREEN_ROW_COLOR = '#B9EDB9'
const RED_ROW_COLOR = '#f7b2b2'

const TREND_BAR_COLOR = '#003A64'
const DIP_BAR_COLOR = '#54A2D2'
const VOLUME_BAR_COLOR = '#A9CEE8'

const getEmailHeader = analyzedStocks => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">` +
    '<div style="background:rgb(255,255,255);max-width:700px;width:100%;margin:0px auto; text-align: center;">' +
    '<br/>' +
    '<h1>Rippers N\' Dippers</h1>' +
    '<p style="font-size: 1rem;">The ultimate technical analysis report and momentum detection tool.</p>' +
    '<p style="font-size: 1rem;">' +
    `This report is based on 6 month historical data, scraped on ${analyzedStocks.date_analyzed}.<br/><br/>All stocks in the NYSE, Nasdaq, and AMEX exchanges were considered.` +
    '</p>' +
    '<p style="font-size: 2rem;">' +
    '<div style="width:100%;text-align:center;width:auto;min-height:50px;">🏆</div>' +
    '</p>' +
    '<p style="font-size: 1rem;">Have friends who want to receive the daily Rippers N\' Dippers report? <a href="https://cdn.forms-content.sg-form.com/bc799e4b-7212-11eb-b7d9-72cfbf9b238f">Sign up here</a>!</p>' +
    '<br/>' +
    '<hr/>' +
    '<br/>'

const tableHeaders = () => {

    return '<tr>' +
        '<th><h4 style="margin: 5px 2px;">Symbol</h4></th>' +
        '<th><h4 style="margin: 5px 2px;">Trend<br/>Rate</h4>' +
        `<div style="width: 20px; height: 20px; background-color: ${TREND_BAR_COLOR}; border-radius: 5px;  margin: auto auto 5px auto; border: black solid 0.5px;"></div></th>` +
        '<th><h4 style="margin: 5px 2px;">Dip<br/>Percentage</h4>' +
        `<div style="width: 20px; height: 20px; background-color: ${DIP_BAR_COLOR}; border-radius: 5px; margin: auto auto 5px auto; border: black solid 0.5px;"></div></th>` +
        '<th><h4 style="margin: 5px 2px;">Volume<br/>Ratio</h4>' +
        `<div style="width: 20px; height: 20px; background-color: ${VOLUME_BAR_COLOR}; border-radius: 5px; margin: auto auto 5px auto; border: black solid 0.5px;"></div></th>` +
        '<th><h4 style="margin: 5px 2px;">Rankings</h4></th>' +
        '<th><h4 style="margin: 5px 2px;">Market<br/>Cap</h4></th>' +
        '<th><h4 style="margin: 5px 2px;">PE Ratio</h4></th>' +
        '</tr>'
}

const buildTtRowFromStocksArray = (stocksArray, upwardsOrDownwards) => {

    let colorNextRow = true

    console.log('up or down: ', upwardsOrDownwards)

    return stocksArray
        .map(trenderObj => {

            let tr

            if (colorNextRow) {
                tr = upwardsOrDownwards === 'trending_upwards' ?
                    `<tr bgcolor='${GREEN_ROW_COLOR}'>` :
                    `<tr bgcolor='${RED_ROW_COLOR}'>`
                colorNextRow = false
            } else {
                tr = `<tr>`
                colorNextRow = true
            }

            const trendBarHeight = 2 + Math.floor(43 * trenderObj.rankings.trend)
            const dipBarHeight = 2 + Math.floor(43 * trenderObj.rankings.dip)
            const volumeBarHeight = 2 + Math.floor(43 * trenderObj.rankings.volume)

            return tr +
                '<td style="min-width:83px">' +
                `<a href="https://finviz.com/quote.ashx?t=${trenderObj.symbol}">${trenderObj.symbol}</a>` +
                '</td>' +
                '<td style="min-width:78px">' +
                trenderObj.trend_rate +
                '</td>' +
                '<td style="min-width:110px">' +
                trenderObj.dip_percentage +
                '</td>' +
                '<td style="min-width:80px">' +
                trenderObj.volume_ratio +
                '</td>' +
                '<td style="min-width: 85px; min-height: 50px; padding: 0.5rem; display: flex;">' +

                `<div title="${(trenderObj.rankings.trend * 100).toFixed(0) + '%'}" style="background-color: ${TREND_BAR_COLOR}; min-width: 15px; min-height: ${trendBarHeight}px; margin: auto auto 0 auto; border: 1.5px solid black;"></div>` +
                `<div title="${(trenderObj.rankings.dip * 100).toFixed(0) + '%'}" style="background-color: ${DIP_BAR_COLOR}; min-width: 15px; min-height: ${dipBarHeight}px; margin: auto auto 0 auto; border: 1.5px solid black;"></div>` +
                `<div title="${(trenderObj.rankings.volume * 100).toFixed(0) + '%'}" style="background-color: ${VOLUME_BAR_COLOR}; min-width: 15px; min-height: ${volumeBarHeight}px; margin: auto auto 0 auto; border: 1.5px solid black;"></div>` +

                '</td>' +
                '<td style="min-width:75px">' +
                trenderObj.market_cap_group +
                '</td>' +
                '<td style="min-width:87px">' +
                trenderObj.pe_ratio +
                '</td>' +
                '</tr>'
        })
        .join('')
}

// const largeCapTrendersTableRows = buildTtRowFromMongoData(analyzedStocks, 'trending_upwards')

// colorNextRow = true

// const largeCapLosersTableRows = buildTtRowFromMongoData(analyzedStocks, 'trending_downwards')

const getTrendingUpwardsSection = (trendingUpwardsSymbols, upwardsOrDownwards) => `<div>` +
    '<br/>' +
    '<h2>Trending Upwards</h2>' +
    '<p style="font-size: 1rem;">Go <i><strong>LONG</strong></i> these upward trending equities that have dipped downwards.</p>' +
    '<table border="1" cellspacing="0" padding="0" style="border: 1px solid black; font-size: 1rem; margin: auto;">' +
    tableHeaders() +
    buildTtRowFromStocksArray(trendingUpwardsSymbols, upwardsOrDownwards) +
    '</table>' +
    '</div>' +
    '<br/>'

const getTrendingDownwardsSection = (trendingDownwardsSymbols, upwardsOrDownwards) => `<div>` +
    '<br/>' +
    '<h2>Trending Downwards</h2>' +
    '<p style="font-size: 1rem;">Go <i><strong>SHORT</strong></i> these downward trending equities that have dipped upwards.</p>' +
    '<table border="1" cellspacing="0" padding="0" style="border: 1px solid black; font-size: 1rem; margin: auto;">' +
    tableHeaders() +
    buildTtRowFromStocksArray(trendingDownwardsSymbols, upwardsOrDownwards) +
    '</table>' +
    '</div>' +
    '<br/>'

const getDefinitionsSection = trendingUpwardsSymbols => `<br/><br/><div style="text-align: left; max-width: 550px; margin: auto; padding: 0 1rem; border: .15rem solid black; border-radius: 0.5rem;">` +
    '<h2>Definitions</h2>' +
    '<p style="font-size: 1rem;"><strong><u>Symbol</u></strong> - The ticker that identifies a given stock or financial instrument.</p>' +
    '<p style="font-size: 1rem;"><strong><u>Trend Intervals</u></strong> - The time periods used to determine if a given stock is trending. Our algorithm looks at the percentage price change over the "dip interval" and "trend intervals" which correspond to the following time periods:' +
    '<ul>' +
    '<li style="font-size: 1rem;">Ti1: between 6 months ago and 3 months ago' +
    '<li style="font-size: 1rem;">Ti2: between 3 months ago and 1 month ago' +
    '<li style="font-size: 1rem;">Ti3: between 1 month ago and 5 trading days ago' +
    '<li style="font-size: 1rem;">Di: the last 5 trading days' +
    '</ul>' +
    '</p>' +
    // '<img src=""/>' +
    '<p style="font-size: 1rem;">Note - The trending upwards and trending downwards tables contain ONLY stocks whose price has moved in the same direction over all three trend intervals.</p>' +
    '<p style="font-size: 1rem;"><strong><u>Trend Rate</u></strong> - Represents the speed at which price change momentum is increasing.</p>' +
    '<p style="font-size: 1rem;">(a positive number represents an upward trend, and a negative number represents a downwards trend)</p>' +
    '<p style="font-size: 1rem;">(a trend rate value that is farther from zero indicates more price change momentum in the trend direction)</p>' +
    `<p style="font-size: 1rem;"><strong><u>Dip Percentage</u></strong> - The percentage a stock's price has changed over the past 5 trading days.</p>` +
    `<p style="font-size: 1rem;"><strong><u>Rankings</u></strong> - The three bars respectively represent how a stock's trend rate, dip percentage, and volume ratio together compare to those of other symbols also trending in that direction for the given day.</p>` +
    '<p style="font-size: 1rem;">(a large bar indicates a strong signal for the corresponding indicator)</p>' +
    '<p style="font-size: 1rem;"><strong><u>Market Cap</u></strong> - A high-level group describing the size of a company based on the total value of all shares.</p>' +
    '<p style="font-size: 1rem;">(Micro < 300M < Small < 2B < Mid < 10B < Large < 200B < Mega)</p>' +
    '<p style="font-size: 1rem;"><strong><u>PE Ratio</u></strong> - Compares the price per share of a company\'s stock to its earnings per share.</p>' +
    '<p style="font-size: 1rem;">(A PE ratio closer to zero means you are buying into more dollars of earnings per dollar invested)</p>' +
    '<p style="font-size: 1rem;">(A negative PE ratio means the company is not yet profitable)</p>' +
    `</div>`

const getFooterSection = trendingUpwardsSymbols => '<br/>' +
    `<p style="font-size: 1rem;">Good luck and enjoy the ride!</p><br/>` +
    `<p style="font-size: 1rem;">We want to hear from YOU! If you enjoy getting these stock picks or have any questions at all, just reply to this email and say hello!</p>` +
    '<div>' +
    '<br/>' +
    '<div style="width: 500px; display: flex; margin: auto;">' +
    '<div style="margin: auto; text-align: left;">' +
    '<h2>Sincerely,</h2>' +
    '<h2>Your Friend & Fellow Trader,</h2>' +
    '<h1>&nbsp;&nbsp;&nbsp;&nbsp;Jim Lynch</h1>' +
    '</div>' +
    '<img style="margin: auto;" src="https://raw.githubusercontent.com/JimLynchCodes/Rippers-N-Dippers/main/notifier/images/jim-headshot-hand-drawn.jpeg" />' +
    '</div>' +
    '<br/>' +
    '<br/>' +
    '<p style="font-size: 1rem;"><i>Disclaimer: any information here may be incorrect. Invest at your own risk!</i></p>' +
    '</div>' +
    '<p style="font-size: 1rem;">Shoutout to <a href="https://www.barchart.com/">barchart.com</a> and <a href="https://iexcloud.io/">iexcloud.io</a> for generously<br/>providing data used in generating this report!</p>' +
    '<br/>' +
    '<div>' +
    '<a href="<%asm_group_unsubscribe_raw_url%>">Unsubscribe</a> | <a href="<%asm_preferences_raw_url%>">Manage Email Preferences</a>' +
    '<br/>' +
    '</div>'

module.exports = {
    getEmailHeader,
    getTrendingUpwardsSection,
    getTrendingDownwardsSection,
    getDefinitionsSection,
    getFooterSection
}