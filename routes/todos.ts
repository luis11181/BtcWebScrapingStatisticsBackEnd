import { Router } from "express";

import { getResumen, getTopWallet } from "../controllers/todos";

const router = Router();

router.get("/", getResumen);

router.get("/top", getTopWallet);

// router.get('/', getTodos);

// router.patch('/:id', updateTodo);

// router.delete('/:id', deleteTodo);

export default router;
