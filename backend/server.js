const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dietaryStyles = [
    { id: '1', name: 'Mediterranean', description: 'Fresh, healthy ingredients...', icon: '🫒' },
    { id: '2', name: 'Asian Fusion', description: 'Bold flavors with soy...', icon: '🥢' },
    { id: '3', name: 'Italian', description: 'Classic Italian with pasta...', icon: '🍝' },
    { id: '4', name: 'Mexican', description: 'Spicy and vibrant...', icon: '🌶️' },
    { id: '5', name: 'Vegetarian', description: 'Plant-based ingredients only', icon: '🥬' },
    { id: '6', name: 'Keto', description: 'Low-carb, high-fat recipes', icon: '🥑' }
];
const commonIngredients = ['Chicken breast', 'Salmon', 'Ground beef', 'Eggs', 'Tofu', 'Rice', 'Pasta', 'Quinoa', 'Bread', 'Potatoes', 'Tomatoes', 'Onions', 'Garlic', 'Bell peppers', 'Spinach', 'Broccoli', 'Carrots', 'Mushrooms', 'Avocado', 'Lemon', 'Olive oil', 'Butter', 'Cheese', 'Milk', 'Yogurt', 'Salt', 'Black pepper', 'Basil', 'Oregano', 'Paprika'];

app.get('/api/dietary-styles', (req, res) => res.json(dietaryStyles));
app.get('/api/ingredients', (req, res) => res.json(commonIngredients));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-recipe', async (req, res) => {
    try {
        const { ingredients, dietaryStyle } = req.body;
        if (!ingredients || ingredients.length === 0 || !dietaryStyle) {
            return res.status(400).json({ error: 'Ingredients and dietary style are required.' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
          You are a helpful recipe generator. Create a recipe based on the following details.
          Ingredients: ${ingredients.join(', ')}
          Dietary Style: ${dietaryStyle}
          Please provide a response in a clean JSON format. Do not include any text before or after the JSON object.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        res.json(jsonResponse);
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ error: 'Failed to generate recipe.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});