import { promises as fsPromises } from "fs";
import path from "path";
import { mainAppPath } from "../app";

const nodemailer = require("nodemailer"); //*paquetes para gestionar envio de correos

import {
  datosGeneralesPupperteer,
  datosTopWalletPupperteer,
  IResultadosTopWallets,
} from "./funcionesRecurrentesPuppeteer";
//interfaces
import { IResultadosGenerales } from "./funcionesRecurrentesPuppeteer";

export interface IJsonGeneral {
  statistics: {
    diffMax: { rango: string; diffCoins: number; diffPercent: number }[];
    diff72h: { rango: string; diffCoins: number; diffPercent: number }[];
    diff24h: { rango: string; diffCoins: number; diffPercent: number }[];
    diff8h: { rango: string; diffCoins: number; diffPercent: number }[];
    diff4h: { rango: string; diffCoins: number; diffPercent: number }[];
    diff1h: { rango: string; diffCoins: number; diffPercent: number }[];
    diff30min: { rango: string; diffCoins: number; diffPercent: number }[];
  };
  data: { date: string; resultadosGenerales: IResultadosGenerales }[];
}

export interface IJsonTopWallets {
  statistics: {
    diffMax: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff72h: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff24h: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff8h: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff1h: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff30min: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
    diff4h: {
      wallet: string;
      nombre: string;
      coins: number;
      diffCoins: number;
      diffPercent: number;
    }[];
  };
  data: { date: string; resultadosTopWallet: IResultadosTopWallets }[];
}

//() => WebScrapper(url);
export const datosGenerales = async () => {
  console.log("Iniciando datosGenerales func1 dentro");

  //variable global para tener los resultados en todas las paginas
  let resultadosGenerales: IResultadosGenerales | undefined = undefined;

  //webscrapping que recupera los datos generales de la pagina
  resultadosGenerales = await datosGeneralesPupperteer();
  const currentDate = new Date();

  // const date =
  //   currentDate.getUTCFullYear().toString() +
  //   +(currentDate.getUTCMonth() + 1).toString() +
  //   +currentDate.getUTCDate().toString() +
  //   +currentDate.getUTCHours().toString(); //la hora se entrega en zona  horaria universal, no necesariamente es la hpra que se ve en el reloj

  const currentDateString = currentDate.toISOString(); //currentDate.toUTCString(); // almacenandolo como utc hour, sin zona hpraira de colombia

  console.log("run at:", currentDateString);

  if (resultadosGenerales !== undefined) {
    let jsonGeneral: undefined | IJsonGeneral = undefined;

    let jsonGeneralString = await fsPromises
      .readFile(path.join(mainAppPath, "/resultadosGenerales.json"), "utf-8")
      .catch((err) => console.error("Failed to read file", err));

    //console.log("jsonGeneralString:", jsonGeneralString);

    // parse JSON object
    if (jsonGeneralString) {
      jsonGeneral = await JSON.parse(jsonGeneralString);

      // print JSON object
      //console.log(jsonGeneral);

      if (jsonGeneral !== undefined) {
        // console.log(jsonGeneral.data, "data1");

        let hacerPush = true;

        jsonGeneral.data.forEach((element, i, array) => {
          //si se imprimen mas de 1 valor cada media hora
          console.log("func generales inside iteration", i);
          if (
            // new Date(element.date).getFullYear() ===
            //   currentDate.getFullYear() &&
            // new Date(element.date).getMonth() === currentDate.getMonth() &&
            // new Date(element.date).getDate() === currentDate.getDate() &&
            // new Date(element.date).getHours() === currentDate.getHours()
            new Date(element.date).getTime() >
            currentDate.getTime() - 1000 * 60 * 60 * 0.5
          ) {
            // array[i] = {
            //   date: currentDateString,
            //   resultadosGenerales: resultadosGenerales!,
            // };

            hacerPush = false;
          }

          //elimina todos los objetos de mas de 5 dias excepto la primera
          if (
            new Date(element.date).getTime() <
            currentDate.getTime() - 1000 * 60 * 60 * 24 * 5
          ) {
            if (i != 0) {
              array.splice(i, 1);
            }
          }

          if (i == 0) {
            jsonGeneral!.statistics.diffMax =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calculate hte siference with a date that is aproximatelly 72 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 72.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 69.7 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff72h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calculate hte siference with a date that is aproximatelly 1 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 1.2 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 0.8 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff1h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calcula las diferencias a los 24 horas
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 24.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 23.7 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff24h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calcula las diferencias a los 6 horas
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 8.2 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 7.8 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff8h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calcula las diferencias a los 4 horas
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 4.2 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 3.8 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff4h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }

          //calcula las diferencias a los 1 horas
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 1.2 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 0.8 //si es mayor a 72 h
          ) {
            jsonGeneral!.statistics.diff1h =
              element.resultadosGenerales.resultado.map((e, j) => {
                return {
                  rango: e.rango,
                  diffCoins: resultadosGenerales!.resultado[j].coins - e.coins,
                  diffPercent:
                    ((resultadosGenerales!.resultado[j].coins - e.coins) *
                      100) /
                    e.coins,
                };
              });
          }
        });

        if (hacerPush) {
          jsonGeneral.data.push({
            date: currentDateString,
            resultadosGenerales: resultadosGenerales,
          });
        }

        //console.log(jsonGeneral.data, "data2");

        //! escribir en el archivo
        fsPromises
          .writeFile(
            path.join(mainAppPath, "/resultadosGenerales.json"),
            JSON.stringify(jsonGeneral, null, 2)
          )
          .catch((err) => console.error("Failed to write file", err));

        //console.log(jsonGeneral, "jsonGeneral");

        console.log("JSON data is saved.");
      }
    } else {
      //! si no hay aechivo y se busca crearlo por primera vez, pero si sirve pupperteer

      jsonGeneral = {
        data: [],
        statistics: {
          diffMax: [],
          diff72h: [],
          diff24h: [],
          diff8h: [],
          diff4h: [],
          diff1h: [],
          diff30min: [],
        },
      };

      jsonGeneral.data.push({
        date: currentDateString,
        resultadosGenerales: resultadosGenerales,
      });

      //! escribir en el archivo
      fsPromises
        .writeFile(
          path.join(mainAppPath, "/resultadosGenerales.json"),
          JSON.stringify(jsonGeneral, null, 2)
        )
        .catch((err) => console.error("Failed to write file", err));

      console.log("JSON data is saved for the first time.");
    }
  }
}; //,/null,true,'America/Los_Angeles'

export const datosTopWallet = async () => {
  console.log("datosTopWallet entro a funcion");

  //variable global para tener los resultados en todas las paginas
  let resultadosTopWallet: IResultadosTopWallets | undefined = undefined;

  //webscrapping que recupera los datos generales de la pagina
  resultadosTopWallet = await datosTopWalletPupperteer();
  const currentDate = new Date();

  const currentDateString = currentDate.toISOString();

  console.log("run at:", currentDateString);

  if (resultadosTopWallet !== undefined) {
    let jsonTopWallet: undefined | IJsonTopWallets = undefined;

    let jsonTopWalletString = await fsPromises
      .readFile(path.join(mainAppPath, "/resultadosTopWallet.json"), "utf-8")
      .catch((err) => console.error("Failed to read file", err));

    //console.log("jsonTopWalletString:", jsonTopWalletString);

    // parse JSON object
    if (jsonTopWalletString) {
      jsonTopWallet = await JSON.parse(jsonTopWalletString);

      // print JSON object
      //console.log(jsonGeneral);

      if (jsonTopWallet !== undefined) {
        // console.log(jsonTopWallet.data, "data1");

        let hacerPush = true;

        jsonTopWallet.data.forEach((element, i, array) => {
          console.log("funcion top inside iteration", i);

          //si se imprimen mas de 1 valor cada hora lo sobreescribe el ultimo
          if (
            new Date(element.date).getTime() >
            currentDate.getTime() - 1000 * 60 * 60 * 0.5
          ) {
            // array[i] = {
            //   date: currentDateString,
            //   resultadosTopWallet: resultadosTopWallet!,
            // };

            hacerPush = false;
          }

          //elimina todos los objetos de mas de 5 dias excepto el primero
          if (
            new Date(element.date).getTime() <
            currentDate.getTime() - 1000 * 60 * 60 * 24 * 5
          ) {
            if (i != 0) {
              array.splice(i, 1);
            }
          }

          if (i == 0) {
            console.log("entro a top diferencia maxima");

            jsonTopWallet!.statistics.diffMax = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  console.log("diffmax cartera ==cartera");

                  jsonTopWallet!.statistics.diffMax.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });
                  break;
                }
              }
            });
          }

          //! elimino estadisticas anteriores para calcularlas nuevamente

          //calculate hte siference with a date that is aproximatelly 72 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 3.7 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 4.3 //si es mayor a 72 h
          ) {
            jsonTopWallet!.statistics.diff4h = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  jsonTopWallet!.statistics.diff4h.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });
                  break;
                }
              }
            });

            // jsonTopWallet!.statistics.forEach() =
          }

          //calculate hte siference with a date that is aproximatelly 72 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 72.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 69.7 //si es mayor a 72 h
          ) {
            jsonTopWallet!.statistics.diff72h = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  jsonTopWallet!.statistics.diff72h.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });
                  break;
                }
              }
            });

            // jsonTopWallet!.statistics.forEach() =
          }

          //calculate hte siference with a date that is aproximatelly 24 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 24.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 23.7 //si es mayor a 72 h
          ) {
            jsonTopWallet!.statistics.diff24h = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  jsonTopWallet!.statistics.diff24h.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });
                  break;
                }
              }
            });
            // jsonTopWallet!.statistics.forEach() =
          }

          //calculate hte siference with a date that is aproximatelly 6 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 8.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 7.7 //si es mayor a 72 h
          ) {
            jsonTopWallet!.statistics.diff8h = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  jsonTopWallet!.statistics.diff8h.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });
                  break;
                }
              }
            });
            // jsonTopWallet!.statistics.forEach() =
          }

          //calculate hte siference with a date that is aproximatelly 1 hours ago
          if (
            new Date(element.date).getTime() >
              currentDate.getTime() - 1000 * 60 * 60 * 1.3 && //si es menor a 3 dias
            new Date(element.date).getTime() <
              currentDate.getTime() - 1000 * 60 * 60 * 0.7 //si es mayor a 72 h
          ) {
            console.log("entro a diferencia de una hora");

            jsonTopWallet!.statistics.diff1h = [];
            resultadosTopWallet!.resultado.forEach((e, j) => {
              for (
                let index = 0;
                index < element.resultadosTopWallet.resultado.length;
                index++
              ) {
                let e2 = element.resultadosTopWallet.resultado[index];
                if (e.cartera === e2.cartera) {
                  jsonTopWallet!.statistics.diff1h.push({
                    wallet: e.cartera,
                    nombre: e.nombre,
                    coins: e.coins,
                    diffCoins: e.coins - e2.coins,
                    diffPercent: ((e.coins - e2.coins) * 100) / e2.coins,
                  });

                  if (Math.abs(e.coins - e2.coins) > 5000) {
                    //!enviar email
                    console.log("enviar email");
                    let valor = e.coins - e2.coins;

                    main(e.cartera, valor).catch(console.error);
                  }
                  break;
                }
              }
            });
            // jsonTopWallet!.statistics.forEach() =
          }
        });

        if (hacerPush) {
          jsonTopWallet.data.push({
            date: currentDateString,
            resultadosTopWallet: resultadosTopWallet,
          });
        }

        //! escribir en el archivo
        fsPromises
          .writeFile(
            path.join(mainAppPath, "/resultadosTopWallet.json"),
            JSON.stringify(jsonTopWallet, null, 2)
          )
          .catch((err) => console.error("Failed to write file", err));

        console.log("JSON data is saved.");
      }
    } else {
      //! si no hay aechivo y se busca crearlo por primera vez,pero si sirve pupperteer

      jsonTopWallet = {
        data: [],
        statistics: {
          diffMax: [],
          diff72h: [],
          diff24h: [],
          diff8h: [],
          diff4h: [],
          diff1h: [],
          diff30min: [],
        },
      };

      jsonTopWallet.data.push({
        date: currentDateString,
        resultadosTopWallet: resultadosTopWallet,
      });

      //! escribir en el archivo
      fsPromises
        .writeFile(
          path.join(mainAppPath, "/resultadosTopWallet.json"),
          JSON.stringify(jsonTopWallet, null, 2)
        )
        .catch((err) => console.error("Failed to write file", err));

      console.log("JSON topwallet data is saved for the first time.");
    }
  }
}; //,/null,true,'America/Los_Angeles'

// async..await is not allowed in global scope, must use a wrapper
async function main(wallet: string, valor: number) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "wallet movement", // Subject line
    text: `wallet #: ${wallet} hizo una trasaccion de ${valor}.   mas de 5000 btc`, // plain text body
    html: `wallet #: ${wallet} hizo una trasaccion de ${valor}.   mas de 5000 btc`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
