import type { Route } from "./+types/home";
import { Link } from "react-router";

export default function Contact() {
    return (
        <main>
            <h1>Hello, welcome to my website.</h1>
            <Link to="/dog">Dog Generator</Link>
            <Link to="/cookbook">Cookbook</Link>
        </main>
    );
}