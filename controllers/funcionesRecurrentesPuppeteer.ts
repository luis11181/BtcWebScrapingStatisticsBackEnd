import puppeteer from "puppeteer";

export interface IResultadosGenerales {
  resultado: {
    rango: string;
    coins: number;
  }[];
}

export interface IResultadosTopWallets {
  resultado: {
    cartera: string;
    nombre: string;
    coins: number;
  }[];
}

export const datosGeneralesPupperteer = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 250, // slow down by 250ms
  });

  try {
    const page = await browser.newPage();

    // Prepare for the tests para no ser detectados como bots
    await preparePageForTests(page);

    const response = await page.goto(
      "https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html" //, { waitUntil: 'networkidle0' }
    );

    if (response.status() < 400) {
      // get the table data by xpath xpath("//table[contains(@class,'table table-condensed')]"

      // make screesnshot to check everything is ok
      // await page.screenshot({ path: "example.png" });

      await page.waitForSelector(".table.table-condensed.bb");

      const table = await page.evaluate(() => {
        const firstResult = document.querySelector(
          ".table.table-condensed.bb"
        )! as HTMLTableElement;
        const table = firstResult;
        const rows = [...table.querySelectorAll("tr")];
        const data = rows.map((row) => {
          const columns = [...row.querySelectorAll("td")];
          return columns.map((column) => column.innerText);
        });
        return data;
      });
      //console.log(table, "table");

      const table2 = table
        .filter(function (dato) {
          if (dato.length > 0) {
            return true;
          }
          return false;
        })
        .map((dato) => {
          return {
            rango: dato[0],
            coins: parseFloat(
              dato[3].replace(",", "").substring(0, dato[3].length - 4)
            ),
          };
        });

      const object: IResultadosGenerales = { resultado: table2 };
      // table2.forEach((dato, i) => {
      //   object[i] = { rango: dato.rango, coins: dato.coins };
      // });

      //console.log(object, "object");

      // const searchValue = await page.$eval(".table .table-condensed", (el) => {
      //   return el.outerHTML;
      // });
      // console.log(searchValue);

      //await page.waitForTimeout(50000);

      await browser.close();

      return object;
    } else {
      console.log("pagina caida");
      return undefined;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const datosTopWalletPupperteer = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 250, // slow down by 250ms
  });

  try {
    const page = await browser.newPage();

    // Prepare for the tests para no ser detectados como bots
    await preparePageForTests(page);

    const response = await page.goto(
      "https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html" //, { waitUntil: 'networkidle0' }
    );

    if (response.status() < 400) {
      // get the table data by xpath xpath("//table[contains(@class,'table table-condensed')]"

      // make screesnshot to check everything is ok
      // await page.screenshot({ path: "example.png" });

      await page.waitForSelector("#tblOne");
      await page.waitForSelector("#tblOne2");

      const table = await page.evaluate(() => {
        const firstResult = document.querySelector(
          "#tblOne"
        )! as HTMLTableElement;
        const table = firstResult;
        const rows = [...table.querySelectorAll("tr")];
        const data = rows.map((row) => {
          const columns = [...row.querySelectorAll("td")];
          return columns.map((column) => column.innerText);
        });
        return data;
      });
      //console.log(table, "table");

      const table2 = table
        .filter(function (dato) {
          if (dato.length > 0) {
            return true;
          }
          return false;
        })
        .map((dato) => {
          return {
            cartera: dato[1].toString().replace("\n", " ").split(" ")[0].trim(), //agraga cientos de espacios
            nombre: dato[1]
              .toString()
              .replace(
                "\n",
                "                                                                                                                                                                                                                    "
              )
              .substring(100)
              .trim(), //agraga cientos de espacios,
            coins: parseFloat(
              dato[2]
                .toString()
                .replace(",", "")
                .split(" ")[0] //agranda espacio para separar el numero
                //.substring(0, 7) //cortasolo numero
                .trim() //elimina espacios
            ),
          };
        });
      // console.log(table2, "table2");

      //*segunda tabla

      const table3 = await page.evaluate(() => {
        const firstResult = document.querySelector(
          "#tblOne2"
        )! as HTMLTableElement;
        const table = firstResult;
        const rows = [...table.querySelectorAll("tr")];
        const data = rows.map((row) => {
          const columns = [...row.querySelectorAll("td")];
          return columns.map((column) => column.innerText);
        });
        return data;
      });
      //console.log(table, "table");

      const table4 = table3
        .filter(function (dato) {
          if (dato.length > 0) {
            return true;
          }
          return false;
        })
        .map((dato) => {
          return {
            cartera: dato[1].toString().replace("\n", " ").split(" ")[0].trim(), //agraga cientos de espacios
            nombre: dato[1]
              .toString()
              .replace(
                "\n",
                "                                                                                                                                                                                                                    "
              )
              .substring(100)
              .trim(), //agraga cientos de espacios,
            coins: parseFloat(
              dato[2]
                .toString()
                .replace(",", "")
                .split(" ")[0] //agranda espacio para separar el numero
                //.substring(0, 7) //cortasolo numero
                .trim() //elimina espacios
            ),
          };
        });

      const object: IResultadosTopWallets = {
        resultado: [...table2, ...table4],
      };

      //console.log(object, "object");

      //const object: IResultadosGenerales = { resultado: table2 };

      // table2.forEach((dato, i) => {
      //   object[i] = { rango: dato.rango, coins: dato.coins };
      // });

      //console.log(object, "object");

      // const searchValue = await page.$eval(".table .table-condensed", (el) => {
      //   return el.outerHTML;
      // });
      // console.log(searchValue);

      //await page.waitForTimeout(50000);

      await browser.close();

      return object; //object
    } else {
      console.log("pagina caida");
      return undefined;
    }
  } catch (error) {
    console.log("error", error);
  }
};

//! funcion para evitar ser identificados como bots  https://intoli.com/blog/not-possible-to-block-chrome-headless/
// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page: puppeteer.Page) => {
  //   // Pass the User-Agent Test.
  //   const userAgent =
  //     "Mozilla/5.0 (X11; Linux x86_64)" +
  //     "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  //   await page.setUserAgent(userAgent);
  //   // Pass the Webdriver Test.
  //   await page.evaluateOnNewDocument(() => {
  //     Object.defineProperty(navigator, "webdriver", {
  //       get: () => false,
  //     });
  //   });
  //   // Pass the Plugins Length Test.
  //   await page.evaluateOnNewDocument(() => {
  //     // Overwrite the `plugins` property to use a custom getter.
  //     Object.defineProperty(navigator, "plugins", {
  //       // This just needs to have `length > 0` for the current test,
  //       // but we could mock the plugins too if necessary.
  //       get: () => [1, 2, 3, 4, 5],
  //     });
  //   });
  //   // Pass the Languages Test.
  //   await page.evaluateOnNewDocument(() => {
  //     // Overwrite the `plugins` property to use a custom getter.
  //     Object.defineProperty(navigator, "languages", {
  //       get: () => ["en-US", "en"],
  //     });
  //   });
};
