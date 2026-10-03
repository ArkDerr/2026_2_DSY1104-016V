import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductoCard from "./ProductoCard.jsx";

describe("Componente ProductoCard", () => {
  test("muestra nombre y precio recibidos por props", () => {
    const precio = 39990;

    render(<ProductoCard nombre="Teclado Gamer" precio={precio} />);

    expect(screen.getByText("Teclado Gamer")).toBeInTheDocument();

    expect(
      screen.getByText(`$${precio.toLocaleString("es-CL")}`),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Ver producto",
      }),
    ).toBeInTheDocument();
  });
});
