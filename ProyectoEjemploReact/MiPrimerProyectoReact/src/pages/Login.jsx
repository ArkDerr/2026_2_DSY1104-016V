import LoginForm from "../components/LoginForm.jsx";

export default function Login({ onLogin }) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
            <h1 className="h3 text-center mb-4">Iniciar sesión</h1>

            <LoginForm onLogin={onLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}