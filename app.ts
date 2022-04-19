//! npx nodemon ./app.ts   to run the server
// npx tsc  // to compile to javascript
// node build/app.js  // to run the server

import express, { Request, Response, NextFunction } from "express";

import todoRoutes from "./routes/todos";

import path from "path";

import {
  datosGenerales,
  datosTopWallet,
} from "./controllers/funcionesRecurrentes";

const app = express();

//app.use(express.urlencoded({ extended: false })); //hace la conversion  y nos da el mensaje para leer; extend hace que admita objetos dentro de objetos
app.use(express.json()); //hace la conversion  y nos da el mensaje para leer; extend hace que admita objetos dentro de objetos

//!%%%%%% set headers for all the responses
//*para permitir cross origin resource sharing(CORS)
app.use((req: Request, res: Response, next: NextFunction) => {
  //* permite a dominios individuales o a todos * interactuar con este servidor
  res.setHeader("Access-Control-Allow-Origin", "*");
  //* define que metodos estan habilitados para ser usados por clientes desde afuera
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  //* deine que headers pueden poner los clientes en los request que envian,
  //algunos estan autorizados por defecto, pero otros nos toca indicarlo
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //*authheader permite pasar aca el json web token
  next(); //permite seguir
});

//!rutas disponibles
app.use("/", todoRoutes);

//* se puede poner cada typo luego de importarlo de express, una alternativa es usar RequestHandler al iniciar la funcion y asi no ponerle el typo a cada uno
//!%%%%%% funcion para errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  res.status(500).json({ message: err.message });
});

//!%%%%%% funciones recurrentes las cuales se llaman a si mismas luego de terminar la ejecucion
const loop = async function () {
  console.log("loop1");

  await datosGenerales();

  // after short delay, call itself again
  // delay can be removed if you really want to hammer external resources
  //     as much as possible, but usually, you don't want to put that much
  //     load on external resources
  setTimeout(loop, 1000 * 60 * 10);
};

loop().catch((err) => console.log(err));

const loop2 = async function () {
  console.log("loop2");

  await datosTopWallet();
  // after short delay, call itself again
  // delay can be removed if you really want to hammer external resources
  //     as much as possible, but usually, you don't want to put that much
  //     load on external resources
  setTimeout(loop2, 1000 * 60 * 10);
};

loop2().catch((err) => {
  console.log(err);
});

// //! las mismas funciones recurrentes con cron
// const CronJob = require("cron").CronJob;
// console.log("antes de correr los jobs");

// const jobGeneral = new CronJob(
//   "* * * * *",
//   //console.log("running task 1 every 10 minute");
//   datosGenerales() //, null, true, "America/Los_Angeles"
//   //console.log("At Ten Minutes:", new Date());
//   //,
//   // null,
//   // true
// );

// jobGeneral.start();

// Use this if the 4th param is default value(false)
// job.start()

// const jobTop = new CronJob(
//   "* * * * *",
//   //console.log("running task 2 every 10 minute");
//   datosTopWallet() //, null, true, "America/Los_Angeles"
// );
// jobTop.start();

//Use this if the 4th param is default value(false)

//! start the server
export const mainAppPath = path.join(__dirname);
console.log(path.join(__dirname), "url que estoy usando");

app.listen(3010, () => {
  console.log("Server running on port 3000");
});
