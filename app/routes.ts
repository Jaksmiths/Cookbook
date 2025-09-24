import { 
    type RouteConfig, 
    index,
    layout,
    route,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("dog", "routes/dog.tsx"),
    layout("layouts/sidebar.tsx", [
        route("cookbook", "routes/cookbook.tsx"),
        route("cookbook/:recipeId", "routes/recipe.tsx"),
        route("cookbook/:recipeId/edit", "routes/edit-recipe.tsx"),
    ]),
    
] satisfies RouteConfig;
