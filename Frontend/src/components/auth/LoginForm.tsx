import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.tsx";
import { loginSchema, type LoginFormData } from "../../schemas/AuthSchemas.ts";

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitError("");
      await login(data);

      const origin = location.state?.from?.pathname || "/home";
      navigate(origin, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Login failed");
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <article className="prose prose-sm max-w-none">
          <h2 className="card-title justify-center mb-6">Anmelden</h2>

          {submitError && (
            <div className="alert alert-error mb-4">
              <span>{submitError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label" htmlFor="username">
                <span className="label-text">Benutzername</span>
              </label>
              <input
                {...register("username")}
                id="username"
                type="text"
                placeholder="Benutzername eingeben"
                className={`input input-bordered w-full ${
                  errors.username ? "input-error" : ""
                }`}
                disabled={isFormDisabled}
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.username.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label" htmlFor="password">
                <span className="label-text">Passwort</span>
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Passwort eingeben"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                disabled={isFormDisabled}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isFormDisabled}
                className="btn btn-primary w-full"
              >
                {isFormDisabled && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                {isFormDisabled ? "Anmelden..." : "Anmelden"}
              </button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
};
