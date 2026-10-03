import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Inicio from "./Inicio.jsx";

describe("Página Inicio", () => {
  test("muestra el usuario recibido por props", () => {
    render(<Inicio usuario="Admin" />);

    expect(
      screen.getByRole("heading", {
        name: "Bienvenido Admin",
      }),
    ).toBeInTheDocument();
  });
});
