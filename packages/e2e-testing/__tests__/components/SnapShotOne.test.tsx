import puppeteer from "puppeteer";
import { toMatchImageSnapshot } from "jest-image-snapshot";
expect.extend({ toMatchImageSnapshot });

describe("Visual Testing", () => {
  test("Form Snapshot", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file:${__dirname}/../../build/index.html?form=1`);
    const element = await page.waitForSelector(".App");
    const image = await element?.screenshot();
    expect(image).toMatchImageSnapshot();
    await browser.close();
  });
});
