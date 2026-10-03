import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contador from "./Contador.jsx";

describe("Componente Contador", () => {
  test("muestra inicialmente el valor 0", () => {
    render(<Contador />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("aumenta el contador al presionar el botón", async () => {
    const user = userEvent.setup();
    render(<Contador />);

    const boton = screen.getByRole("button", {
      name: "Aumentar",
    });

    await user.click(boton);

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
