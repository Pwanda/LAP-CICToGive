import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 mx-auto">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <article className="prose lg:prose-xl max-w-none">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Willkommen in Ihrer App
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Entdecken Sie fantastische Inhalte, durchstöbern Sie unsere
              Sammlungen und finden Sie die perfekten Geschenke. Treten Sie noch
              heute unserer Gemeinschaft bei, um zu beginnen.
            </p>
          </article>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-stretch gap-4 ">
          <LoginForm />
          <RegisterForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <article className="prose prose-sm max-w-none">
            <p className="text-base-content/60">Copyright IBM CIC </p>
          </article>
        </div>
      </div>
    </div>
  );
}
