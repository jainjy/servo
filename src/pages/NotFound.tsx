export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        {/* Ajout du GIF */}
        <img 
          src="/404.gif" 
          alt="Page non trouvée" 
          className="mx-auto mb-4 max-w-xs"
        />
        <p className="mb-4 text-lg text-gray-600">
          Oups ! La page que vous recherchez est introuvable.
        </p>
        
        <a
          href="/"
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}