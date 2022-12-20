const express = require("express");
const puppeteer = require('puppeteer');
require('dotenv').config()
const app = express();

const PORT = process.env.PORT || 5000;
console.log(PORT)

// middleware
app.use(express.json());
app.use(express.urlencoded());

app.post("/tudo-azul", async (req, res) => {
  console.log(req.body);

  const { user, password } = req.body;
    console.log(user, password);
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--window-size=1920,1080'],
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto('https://www.voeazul.com.br/home');
    
    await page.waitForSelector('.TCSS__header__form');
    await page.click(".TCSS__header__input--user input");
    await page.type(".TCSS__header__input--user input", user, { delay: 100 })
    await page.click(".TCSS__header__input--password input");
    await page.type(".TCSS__header__input--password input", password, { delay: 100 })
    await page.evaluate(()=>document.querySelector('.TCSS__header__field .TCSS__btn.TCSS__btn--blue').click())

    await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    await page.waitForSelector(".TCSS__header__logged");
    await page.waitForSelector(".TCSS__header__points");
    const pageContent = await page.evaluate(() => {
        return {
            points: document.querySelector('.TCSS__header__points').innerHTML
        }
    });
    console.log(pageContent)


    await browser.close();
    res.send({
        points: pageContent.points
    })
});

app.listen(PORT, () => console.log(`App is running`));