const puppeteer = require("puppeteer");
const chalk = require("chalk");

(async function init() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  insertStars();
  console.log(chalk.green("Loading weather data..."));
  insertStars();
  await page.goto("https://cbs6albany.com/weather");

  const weatherData = await page.evaluate(() => {
    // this function is executed in the context of the actual page that is loaded by Puppeteer
    const wordsPerLine = 10;

    const weatherP = document.querySelector(".custom-html-container p:nth-child(5)").innerText;
    const lastUpdated = document.querySelector(".custom-html-container p:nth-child(2)").innerText;

    // cut the number of words that appear on each line down.
    const forecast = weatherP.split(" ").reduce((acc, cur, index) => {
      if(index % wordsPerLine === 0) {
        return acc + " " + cur + "\n";
      } else {
        return acc + " " + cur;
      }
    });

    return {
      forecast,
      lastUpdated
    };
  });

  console.log(chalk.magenta(`\nLast Updated: ${weatherData.lastUpdated}\n\n`)); 
  insertStars();
  console.log("\n",chalk.cyan(weatherData.forecast), "\n");
  insertStars();
  await browser.close();

})();


function insertStars() {
  const starLength = 80;
  const stars = Array(starLength).fill("*").join("");
  
  console.log(chalk.yellowBright(stars));
  
}


