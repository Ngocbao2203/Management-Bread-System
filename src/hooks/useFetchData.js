import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCategories } from "../services/categoryService";
import { getIngredients } from "../services/ingredientService";

export const useFetchData = () => {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryData, ingredientData] = await Promise.all([
          getCategories(1, 100), // Lấy tối đa 100 categories
          getIngredients(1, 100), // Lấy tối đa 100 ingredients
        ]);

        const formattedCategories = categoryData.items.map((item) => ({
          id: item.id,
          name: item.categoryName || item.name,
        }));
        const formattedIngredients = ingredientData.items;

        setCategories(formattedCategories);
        setIngredients(formattedIngredients);
      } catch (error) {
        toast.error(error.message || "Failed to load categories or ingredients");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { categories, ingredients, loading };
};