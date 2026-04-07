import "@radix-ui/themes/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import App from "./App";
import "./index.css";

const router = createHashRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

const root = document.getElementById("root");
if (root) {
    createRoot(root).render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>,
    );
}
