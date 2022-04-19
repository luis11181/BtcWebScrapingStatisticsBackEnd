import { RequestHandler } from "express";
import { promises as fsPromises } from "fs";

import fs from "fs";
import { mainAppPath } from "../app";
import path from "path";
// import { Todo } from '../models/todo';

import { IJsonGeneral, IJsonTopWallets } from "./funcionesRecurrentes";

// const TODOS: Todo[] = [];

export const getResumen: RequestHandler = async (req, res, next) => {
  //const text = (req.body as { text: string }).text;

  let jsonGeneralString = await fsPromises
    .readFile(path.join(mainAppPath, "/resultadosGenerales.json"), "utf-8")
    .catch((err) => console.error("Failed to read file", err));

  // parse JSON object
  let jsonGeneral: undefined | IJsonGeneral = undefined;
  if (jsonGeneralString) {
    jsonGeneral = JSON.parse(jsonGeneralString);
  }

  res.status(201).json({ result: jsonGeneral?.statistics });
};

export const getTopWallet: RequestHandler = async (req, res, next) => {
  //const text = (req.body as { text: string }).text;

  let jsonTopWalletString = await fsPromises
    .readFile(path.join(mainAppPath, "/resultadosTopWallet.json"), "utf-8")
    .catch((err) => console.error("Failed to read file", err));

  // parse JSON object
  let jsonTopWallet: undefined | IJsonTopWallets = undefined;
  if (jsonTopWalletString) {
    jsonTopWallet = JSON.parse(jsonTopWalletString);
  }

  res.status(201).json({ result: jsonTopWallet?.statistics });
};

// export const createTodo: RequestHandler = (req, res, next) => {
//    const text = (req.body as { text: string }).text;
//    const newTodo = new Todo(Math.random().toString(), text);

//    TODOS.push(newTodo);

//    res.status(201).json({ message: 'Created the todo.', createdTodo: newTodo });
// };

// export const getTodos: RequestHandler = (req, res, next) => {
//    res.json({ todos: TODOS });
// };

// //* con el generic type casting se le dice de que typo sera lo que recibiremos
// export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
//    const todoId = req.params.id;

//    const updatedText = (req.body as { text: string }).text;

//    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);

//    if (todoIndex < 0) {
//       throw new Error('Could not find todo!');
//    }

//    TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, updatedText);

//    res.json({ message: 'Updated!', updatedTodo: TODOS[todoIndex] });
// };

// export const deleteTodo: RequestHandler = (req, res, next) => {
//    const todoId = req.params.id;

//    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);

//    if (todoIndex < 0) {
//       throw new Error('Could not find todo!');
//    }

//    TODOS.splice(todoIndex, 1);

//    res.json({ message: 'Todo deleted!' });
// };
