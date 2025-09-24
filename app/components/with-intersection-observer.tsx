import { useEffect, useRef, useState } from "react";
// import { RecipeCard } from "./recipe-card";
import type { RecipeItem } from "../types";

export function WithIntersectionObserver({
    recipes,
    fetchData,
    error,
    loading,
}: {
    recipes: RecipeItem[];
    fetchData: (recipeId: number) => Promise<void>;
    error: null | Error;
    loading: boolean;
}) {
    const [page, setPage] = useState(0);
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchData(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget]);

    return (
        <>
            <ul className="">
                {recipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe.id}></RecipeCard>
                ))}
            </ul>
            <div ref={observerTarget}></div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </>
    );
};
