import express from "express"
import puppeteer from "puppeteer"
import Machine from './models/Machine'

const router = express.Router()

router.get("/listNames", async (req, res) => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.calculadoradetaxas.com.br")

    const result = await page.$$eval("body > section > ul li a", items =>
        items.map(x => x.textContent)
    )

    browser.close()
    res.json(result)
})

router.get("/getData", async (req, res) => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.calculadoradetaxas.com.br")
    
    const qtdMaquininhas = (await page.$x(`/html/body/section/ul/li`)).length
    
    const result : Machine[] = []

    for (let i = 1; i <= qtdMaquininhas; i++) {
        if (i === 1) continue
        const machineLink = (await page.$x(`/html/body/section/ul/li[${i}]/a`))[0]
        machineLink.click()
        await page.waitForNavigation()
        
        await page.evaluate(_ => document.querySelector('body > section > div.ng-scope > div.panel.panel-default > div.row.panel-body > div > form > div > div:nth-child(1) > div:nth-child(4) > select')?.setAttribute('value', 'object:15'))

        const name : string = await page.evaluate(el => 
            el.textContent, 
            (await page.$x(`/html/body/section/ul/li[${i}]/a`))[0]
        )

        const link : string = page.url()

        const imgLink : string = await page.evaluate(el => 
            el.getAttribute("src"), 
            (await page.$x("/html/body/section/div[3]/div[2]/div[1]/a/img"))[0]
        )
        
        const typeSelectOptions = await page.evaluate(
            // @ts-ignore
            () => Array.from(document.querySelectorAll('select[name="planosRecebimento"] > option')).map(option => ({ text: option.label, value: option.value })),
            (await page.$x('select[@name="planosRecebimento"]'))[0]
        )
        
        const types = []
        const feeInputGroupNth = ['1-3', '2-1', '2-2', '2-3']

        for (let type of typeSelectOptions) {
            await page.select("select[name='planosRecebimento']", type.value)
            const fees = []
            
            for (let _inputGroup of feeInputGroupNth) {
                try {
                    const [firstDivChild, secondDivChild] = _inputGroup.split('-')
                    const groupSelector = `body > section > div.ng-scope > div.panel.panel-default > div.row.panel-body > div > form > div > div:nth-child(${firstDivChild}) > div:nth-child(${secondDivChild})`
                    
                    // @ts-ignore
                    const feeInput = await page.$eval(`${groupSelector} input:not(.ng-hide)`, input => input.value)
                    const name : string = (await page.$eval(`${groupSelector} label`, label => label.innerHTML)).split('\n')[0]
                    const fee : number = <number>feeInput.replace(',','.').match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g, '').join('').trim()
                    const type : string = feeInput.replace(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g, '').trim()

                    fees.push({ name, fee, type })
                } catch(e) {
                    console.log("error: ", e)
                }
            }

            types.push({ name: type.text.trim(), fees })
        }
        
        result.push(<Machine>{
            name,
            link,
            imgLink,
            types,
        })
        // console.dir(result, { depth: null })
        console.log(JSON.stringify(result, null, 4));
    }  
    
    browser.close()
    res.json(result)
})

export default router