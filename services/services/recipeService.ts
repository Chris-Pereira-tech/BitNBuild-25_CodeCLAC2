export const API_BASE_URL = "http://localhost:5000/api"; 
// 🔼 replace with your backend server URL (can be localhost or deployed endpoint)

export async function searchRecipes(ingredients: string[], dietaryStyle: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/search`, {
      method: "POST", // or GET depending on backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients,
        dietaryStyle,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // { id, title, ingredients, instructions, nutrition, ... }
  } catch (error) {
    console.error("Recipe search failed:", error);
    throw error;
  }
}
