export async function  action() {
  try {
      const result = await fetch(
          `http://localhost:9000/createblank`
      );
      await result.json();
  } catch (error) {
    console.log(error);
  }
}

export default function Cookbook() {
    return (
        <>
            <h1>
                This is my cookbook site
            </h1>
            <p>
                Click on the left to select a recipe and see details on it.
                Use the search bar to search for sepecific recipies and use 
                the + to create a new one.
            </p>
        </>
    );
}