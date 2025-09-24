import type { Route } from "./+types/dog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const res = await fetch(`https://dog.ceo/api/breeds/image/random`);
  const product = await res.json();
  return product;
}

export default function Home({
  loaderData,
}: Route.ComponentProps) {
  // needs to be matching with the json format
  const { message, status } = loaderData;
  console.log(message);
  console.log(status);
  return <img src={message}></img>;
}
