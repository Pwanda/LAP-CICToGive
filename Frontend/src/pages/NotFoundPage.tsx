import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-base-content/20">404</h1>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Seite nicht gefunden
          </h2>
          <p className="text-xl text-base-content/70 mb-8">
            Entschuldigung, die Seite, die Sie suchen, existiert nicht.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/home" className="btn btn-primary">
            Zurück
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-base-content/50">
            Wenn Sie denken, dass dies ein Fehler ist, kontaktieren Sie bitte
            den Support.
          </p>
        </div>
      </div>
    </div>
  );
}
