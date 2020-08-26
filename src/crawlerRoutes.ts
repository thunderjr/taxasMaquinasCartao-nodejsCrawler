import express from "express"
import puppeteer from "puppeteer"
import Machine from './models/Machine'

const router = express.Router()

router.get("/names", async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto("https://www.calculadoradetaxas.com.br")

    const result = await page.$$eval("body > section > ul li a", items => items.map(x => x.textContent))

    browser.close()
    res.json(result)
})

router.get("/data/all", async (req, res) => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.calculadoradetaxas.com.br")
    
    const qtdMaquininhas = (await page.$x(`/html/body/section/ul/li`)).length
    
    const result : Machine[] = []

    for (let i = 1; i < qtdMaquininhas; i++) {
        const link : string = page.url()

        const name : string = await page.evaluate(
            a => a.textContent,
            (await page.$x(`/html/body/section/ul/li[${i}]/a`))[0]
        )

        const imgLink : string = await page.evaluate(
            img => img.getAttribute("src"),
            (await page.$x("/html/body/section/div[3]/div[2]/div[1]/a/img"))[0]
        )

        const typeSelectOptions = await page.evaluate(
            // TODO: use another method to implement this
            // @ts-ignore
            () => Array.from(document.querySelectorAll('select[name="planosRecebimento"] > option')).map(option => ({ text: option.label, value: option.value })),
            (await page.$x('select[@name="planosRecebimento"]'))[0]
        )
        
        const types = []
        
        for (let type of typeSelectOptions) {
            await page.waitFor(() => !!document.querySelector("select[name='planosRecebimento']"))
            await page.select("select[name='planosRecebimento']", type.value)
            const fees = []
            const feeGroups = await page.evaluate(
                (div1 : Element, div2 : Element) => {
                    // @ts-ignore
                    const fgs1 = Array.from(div1.children).filter(fg => fg.querySelector('label')?.textContent?.includes('Taxa')).map(x => ({ label: x.querySelector('label')?.innerText, inputVal: x.querySelector('input:not(.ng-hide)')?.value }))
                    // @ts-ignore
                    const fgs2 = Array.from(div2.children).filter(fg => fg.querySelector('label')?.textContent?.includes('Taxa')).map(x => ({ label: x.querySelector('label')?.innerText, inputVal: x.querySelector('input:not(.ng-hide)')?.value }))
                    return fgs1.concat(fgs2)
                },
                (await page.$x('/html/body/section/div[3]/div[3]/div[1]/div/form/div/div[1]'))[0],
                (await page.$x('/html/body/section/div[3]/div[3]/div[1]/div/form/div/div[2]'))[0]
            )

            for (let group of feeGroups) {
                try {
                    const fee : number = <number>group.inputVal.replace(',','.').match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g, '').join('').trim()
                    const type : string = group.inputVal.replace(',','.').replace(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g, '').trim()

                    fees.push({ name: group.label, fee, type })
                } catch(e) {
                    console.log("\nurl: ", page.url(), '\n')
                    console.log("\nerror: ", e, '\n')
                }
            }
            types.push({ name: type.text.trim(), fees })
        }
        result.push(<Machine>{ name, link, imgLink, types })
        
        const machineLinkHandler = (await page.$x(`/html/body/section/ul/li[${i + 1}]/a`))[0]
        const machineLinkHref = await page.evaluate((el : Element) => el.getAttribute('href'), (await page.$x(`/html/body/section/ul/li[${i + 1}]/a`))[0])
        machineLinkHandler.click()
        await page.waitForNavigation()
    }  
    
    browser.close()
    res.json(result)
})

export default router