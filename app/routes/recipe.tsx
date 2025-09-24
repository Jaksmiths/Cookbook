import { Form } from "react-router";
import type { Route } from "./+types/recipe";

export async function loader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`http://localhost:9000/recipe/` + params.recipeId);
  if (!res) {
    throw new Response("Not Found", { status: 404 });
  }
  const recipe = await res.json();
  return recipe;
}

export default function Recipe({
  loaderData,
}: Route.ComponentProps) {
  // needs to be matching with the json format
  const { rec, ing, ins } = loaderData;
  return (
    <>
        <div className="grid grid-flow-col grid-rows-3 gap-4 m-4">
            <div className="col-span-2 row-start-1">
                <ul>
                    <li key="name" className="text-2xl">{rec[0].name}</li>
                    <li key="serv">Serving Size: {rec[0].serv} {rec[0].servunit}</li>
                    <li key={"time"}>Total Time: {rec[0].time} {rec[0].timeunit}</li>
                </ul>
            </div>

            <div className="col-span-1 row-start-1 col-start-3">
                <Form action="edit">
                    <button type="submit">Edit</button>
                </Form>

                <Form
                    action="destroy"
                    method="post"
                    onSubmit={(event) => {
                    const response = confirm(
                        "Please confirm you want to delete this record.",
                    );
                    if (!response) {
                        event.preventDefault();
                    }
                    }}
                >
                    <button type="submit">Delete</button>
                </Form>
            </div>
            
            <div className="row-span-3 col-start-1 row-start-2">
                <ul>
                    {ing.length ? (ing.map((item : { ingredient : string; qty : string; qtyunit : string }) => (
                        <li key={item.ingredient}>
                            {item.ingredient} {item.qty} {item.qtyunit}
                        </li>
                    ))) : (
                        <li>
                            <p>Empty</p>
                        </li>
                    )}
                </ul>
            </div>

            <div className="col-span-2 row-span-2">
                <ul>
                    {ins.length ? (ins.map((item : { step : string; instruct : string }) => (
                        <li key={item.step + "_instr"} className="mt-3">
                            <div className="flex">
                                <div className="w-14 flex-none">{item.step}</div>
                                <div className="w-64 flex-1">{item.instruct}</div>
                            </div>
                        </li>
                    ))) : (
                        <li>
                            <p>Empty</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </>
  );
}