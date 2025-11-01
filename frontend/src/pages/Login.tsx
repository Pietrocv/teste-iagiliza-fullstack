export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Login</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          type="email"
          placeholder="Email"
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700"
          type="password"
          placeholder="Senha"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          type="submit"
        >
          Entrar
        </button>
      </form>
      <a href="/register" className="text-blue-600 hover:underline">
        Criar conta
      </a>
    </div>
  );
}
