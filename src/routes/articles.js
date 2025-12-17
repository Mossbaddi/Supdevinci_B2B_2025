import express from 'express'
import { createArticle } from '../controllers/articleController.js'


const router = express.Router()

router.get('/', (req, res) => {})
router.get('/:id', (req, res) => {})
router.post('/', createArticle)
router.delete('/:id', (req, res) => {})
router.put('/:id', (req, res) => {})
router.patch('/:id', (req, res) => {})

export default router