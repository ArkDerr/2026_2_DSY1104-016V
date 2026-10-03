import { beforeEach, describe, expect, test, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm.jsx";

describe("Componente LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("muestra los campos de usuario y contraseña", () => {
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    expect(screen.getByLabelText("Usuario")).toBeInTheDocument();

    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  test("envía usuario y contraseña al hacer login", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn(() => true);
    render(<LoginForm onLogin={onLogin} />);

    const inputUsuario = screen.getByLabelText("Usuario");
    const inputPassword = screen.getByLabelText("Contraseña");

    await user.type(inputUsuario, "Admin");
    await user.type(inputPassword, "123456");

    await user.click(
      screen.getByRole("button", {
        name: "Ingresar",
      }),
    );

    expect(onLogin).toHaveBeenCalledWith("Admin", "123456");
  });

  test("muestra error cuando el login es incorrecto", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn(() => false);
    render(<LoginForm onLogin={onLogin} />);

    await user.type(screen.getByLabelText("Usuario"), "Pedro");

    await user.type(screen.getByLabelText("Contraseña"), "111111");

    await user.click(
      screen.getByRole("button", {
        name: "Ingresar",
      }),
    );

    expect(
      screen.getByText("Usuario o contraseña incorrectos"),
    ).toBeInTheDocument();
  });

  test("recupera el último usuario desde localStorage", () => {
    localStorage.setItem("ultimoUsuario", "Admin");
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    expect(screen.getByLabelText("Usuario")).toHaveValue("Admin");
  });
});
