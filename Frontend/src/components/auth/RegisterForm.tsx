import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth.tsx";
import {
  type RegisterFormData,
  registerSchema,
} from "../../schemas/AuthSchemas.ts";

export const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError("");
      const { ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <article className="prose prose-sm max-w-none">
          <h2 className="card-title justify-center mb-6">Konto erstellen</h2>

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
                placeholder="Benutzername wählen"
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
              <label className="label" htmlFor="email">
                <span className="label-text">E-Mail</span>
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="E-Mail eingeben"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                disabled={isFormDisabled}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
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
                placeholder="Passwort wählen"
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

            <div className="form-control w-full">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">Passwort bestätigen</span>
              </label>
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Passwort bestätigen"
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                disabled={isFormDisabled}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
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
                {isFormDisabled ? "Konto wird erstellt..." : "Konto erstellen"}
              </button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
};
