import express from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ========== GEMINI ==========
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/gemini', async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) return res.status(400).json({ error: "Missing ingredients" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate 3 recipes using these ingredients: ${ingredients}.
      Return JSON like:
      [
        { "title": "...", "ingredients": ["..."], "instructions": ["..."] }
      ]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let recipes;
    try {
      recipes = JSON.parse(text);
    } catch {
      recipes = [{ note: "Could not parse JSON", raw: text }];
    }

    res.json(recipes);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

// ========== SPOONACULAR ==========
const SPOON_KEY = process.env.SPOONACULAR_KEY;
const SPOON_BASE = "https://api.spoonacular.com";

router.get('/spoonacular', async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) return res.status(400).json({ error: "Missing ingredients" });

  try {
    const resp = await axios.get(`${SPOON_BASE}/recipes/findByIngredients`, {
      params: {
        ingredients,
        number: 5,
        apiKey: SPOON_KEY,
      },
    });
    res.json(resp.data);
  } catch (err: any) {
    console.error("Spoonacular error:", err.response?.data || err.message);
    res.status(500).json({ error: "Spoonacular API call failed" });
  }
});

export default router;
