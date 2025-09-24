import { useEffect, useState } from "react";
import type { Route } from "./+types/sidebar";
import type { RecipeItem } from "~/types";
import { WithIntersectionObserver } from "~/components/with-intersection-observer";
import { Outlet, Form, useSubmit, Link } from "react-router";

export async function loader() {
  try {
    const result = await fetch(
      `http://localhost:9000/cookbook/?limit=60&skip=0`
    );
    if (!result) {
      throw new Response("Not Found", { status: 404 });
    }
    const data = await result.json();
    const list: RecipeItem[] = data.rec;
    return { list };
  } catch (error) {
    console.log(error);
  }
}

export default function SidebarLayout({
  loaderData,
}: Route.ComponentProps) {
    const { list } = loaderData;

    const submit = useSubmit();
    return (
        <>
          <div className="flex sticky">
            <div id="sidebar" className="w-64 h-screen flex-none overflow-y-scroll">
                <div className="flex p-4">
                  <Form
                    id="search-form"
                    action="cookbook"
                    onChange={(event) => {
                        submit(event.currentTarget)
                    }}
                  >
                    <input 
                        aria-label="Search recipe"
                        // className={creating ? "loading" : ""}
                        defaultValue=""
                        id="q"
                        name="q"
                        placeholder="Search"
                        type="search"
                    />
                    {/* <div
                        aria-hidden
                        hidden={!creating}
                        id="search-spinner"
                    /> */}
                  </Form>
                  <Form action="cookbook" method="post">
                      <button className="flex" type="submit">New +</button>
                  </Form>
                </div>
                <nav>
                  {list.length ? (
                    <ul>
                      {list.map((recipe: RecipeItem) => (
                        <li key={"recipe_" + recipe.id} className="p-2">
                          <Link to={`cookbook/${recipe.id}`}>
                            <div>{recipe.name}</div>
                            <div>Serving Size: {recipe.serv} {recipe.servunit}</div>
                            <div>Total Time: {recipe.time} {recipe.timeunit}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <i>No Recipies</i>
                    </p>
                  )}
                </nav>
            </div>
            <div id="detail" className="flex-auto h-screen overflow-y-scroll">
                <Outlet />
            </div>
          </div>
        </>
        
    );
}