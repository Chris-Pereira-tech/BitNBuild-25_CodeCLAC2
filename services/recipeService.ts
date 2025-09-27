export const API_BASE_URL = "http://172.27.7.67:8001/api";

// ✅ Quick test function
export async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`);
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    const data = await response.json();
    console.log("✅ Backend is working! Ingredients fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    return null;
  }
}
