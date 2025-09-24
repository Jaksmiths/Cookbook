import { Form } from "react-router";
import type { Route } from "./+types/edit-recipe";
import UnitDropdown from "~/components/unit-dropdown";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`http://localhost:9000/recipe/` + params.recipeId);
  const resTwo = await fetch(`http://localhost:9000/units`);
  if (!res && !resTwo) {
    throw new Response("Not Found", { status: 404 });
  }
  const recipe = await res.json();
  const units = await resTwo.json();
  return { recipe, units };
}

export default function EditContact({
  loaderData,
  params,
}: Route.ComponentProps) {
    const { recipe, units } = loaderData;
    const { rec, ing, ins } = recipe;
    const unitlist = units.units;
    return (
        <Form key={params.recipeId}>
            <div className="grid grid-flow-col grid-rows-3 gap-4 m-4">
                <div className="col-span-2 row-start-1">
                        <label>
                            <span>Name</span>
                            <input 
                                aria-label="Recipe name"
                                defaultValue={rec[0].name}
                                name="name"
                                placeholder="Name"
                                type="text"
                            />
                        </label>
                        <label>
                            <span>Serving Size</span>
                            <input 
                                aria-label="Serving size amount"
                                defaultValue={rec[0].serv}
                                name="serving"
                                placeholder="Serving"
                                type="text"
                            />
                            <UnitDropdown 
                                defaultVal={rec[0].servunit} 
                                units={unitlist} 
                                name="servunit" 
                            />
                        </label>
                        <label>
                            <span>Total Time</span>
                            <input
                                aria-label="Total cooking time"
                                defaultValue={rec[0].time}
                                name="time"
                                placeholder="Time"
                                type="text"
                            />
                            <UnitDropdown 
                                defaultVal={rec[0].timeunit} 
                                units={unitlist} 
                                name="timeunit" 
                            />
                        </label>
                </div>

                <div className="col-span-1 row-start-1 col-start-3">
                    <p>
                        <button type="submit">Save</button>
                        <button type="button">Cancel</button>
                    </p>
                </div>
                
                <div className="row-span-3 col-start-1 row-start-2">
                    <ul>
                        {ing.length ? (ing.map((item : { ingredient : string; qty : string; qtyunit : string }, index : number) => (
                            <li key={"ing" + index}>
                                <label>
                                    <input
                                        aria-label={item.ingredient}
                                        defaultValue={item.ingredient}
                                        name="ing[]"
                                        placeholder="Ingredient"
                                        type="text"
                                    />
                                    <input
                                        aria-label="Ingredient quanity number"
                                        defaultValue={item.qty}
                                        name="qty[]"
                                        placeholder="Ingredient quanity"
                                        type="text"
                                    />
                                    <UnitDropdown 
                                        defaultVal={item.qtyunit} 
                                        units={unitlist} 
                                        name="qtyunit[]" 
                                    />
                                </label>
                            </li>
                        ))) : (
                            <li>
                                <p>Empty</p>
                            </li>
                        )}
                    </ul>
                    <p>
                        <button type="button">Add Ingredient +</button>
                    </p>
                </div>

                <div className="col-span-2 row-span-2">
                    <ul>
                        {ins.length ? (ins.map((item : { step : string; instruct : string }) => (
                            <li key={item.step + "_instr"} className="mt-3">
                                <label className="flex">
                                    <input
                                        aria-label="Instruction step"
                                        className="w-14 flex-none"
                                        defaultValue={item.step}
                                        name="step[]"
                                        placeholder={"Step " + item.step}
                                        type="text"
                                    />
                                    <textarea
                                        aria-label="Instruction text"
                                        className="w-64 flex-1"
                                        defaultValue={item.instruct}
                                        name="ins[]"
                                        placeholder={"instruction " + item.step}
                                        rows={10}
                                        cols={50}
                                    />
                                </label>
                            </li>
                        ))) : (
                            <li>
                                <p>Empty</p>
                            </li>
                        )}
                    </ul>
                    <p>
                        <button type="button">Add Instruction +</button>
                    </p>
                </div>
            </div>
        </Form>
    );
}