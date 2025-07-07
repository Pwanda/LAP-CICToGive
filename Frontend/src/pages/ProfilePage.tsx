import { useState, useEffect } from "react";
import { z } from "zod";
import { profileApi } from "../utils/api.ts";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ZodError {
  errors: Array<{ message: string }>;
}

// Zod Schema für Avatar-Upload
const avatarSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= 5000000; // 5MB limit
    }, "Datei muss kleiner als 5MB sein")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        files[0]?.type,
      );
    }, "Nur JPG, PNG oder WebP Dateien sind erlaubt"),
});

// Zod Schema für Passwort-Änderung
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
    newPassword: z
      .string()
      .min(6, "Neues Passwort muss mindestens 6 Zeichen lang sein"),
    confirmPassword: z.string().min(1, "Passwort bestätigen ist erforderlich"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export default function ProfilePage() {
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profil beim Laden der Seite abrufen
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileApi.getProfile();
      setCurrentAvatar(profile.avatarUrl || null);
    } catch (error: unknown) {
      console.error("Fehler beim Laden des Profils:", error);
      // Redirect to login if not authenticated
      if (error instanceof Error && error.message === "Unauthorized") {
        window.location.href = "/login";
      }
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    setError("");
    setSuccess("");

    try {
      // Zod Validierung
      avatarSchema.parse({ avatar: files });

      if (files && files[0]) {
        setIsUploading(true);

        const result = await profileApi.uploadAvatar(files[0]);
        setCurrentAvatar(result.avatarUrl);
        setSuccess(result.message);
        setIsUploading(false);
      }
    } catch (validationError: unknown) {
      if (
        validationError &&
        typeof validationError === "object" &&
        "errors" in validationError
      ) {
        setError((validationError as ZodError).errors[0].message);
      } else if (validationError instanceof Error) {
        setError(validationError.message);
      } else {
        setError("Fehler beim Upload");
      }
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setError("");
      setSuccess("");

      const result = await profileApi.removeAvatar();
      setCurrentAvatar(null);
      setSuccess(result.message);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Fehler beim Entfernen des Avatars",
      );
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      // Zod Validierung
      passwordSchema.parse(passwordData);

      setIsChangingPassword(true);

      const result = await profileApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      setSuccess(result.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (validationError: unknown) {
      if (
        validationError &&
        typeof validationError === "object" &&
        "errors" in validationError
      ) {
        setError((validationError as ZodError).errors[0].message);
      } else if (validationError instanceof Error) {
        setError(validationError.message);
      } else {
        setError("Validierungsfehler");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Profil</h1>
          <p className="text-base-content opacity-70">
            Verwalten Sie Ihr Profil und Avatar
          </p>
        </div>

        {/* Avatar Sektion */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Avatar
            </h2>

            {/* Avatar Anzeige */}
            <div className="flex flex-col items-center gap-6">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt="User Avatar"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-neutral text-neutral-content flex items-center justify-center text-4xl font-bold">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Buttons */}
              <div className="flex gap-4">
                <label className="btn btn-primary">
                  {isUploading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Avatar hochladen
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </label>

                {currentAvatar && (
                  <button
                    className="btn btn-outline btn-error"
                    onClick={removeAvatar}
                    disabled={isUploading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Entfernen
                  </button>
                )}
              </div>

              {/* Upload Info */}
              <div className="text-center">
                <p className="text-sm text-base-content opacity-60">
                  JPG, PNG oder WebP. Max. 5MB.
                </p>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="alert alert-success">
                  <svg
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <svg
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zusätzliche Aktionen */}
        <div className="card bg-base-100 shadow-lg mt-6">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Sicherheit
            </h3>

            {!showPasswordForm ? (
              <button
                className="btn btn-outline w-fit"
                onClick={() => setShowPasswordForm(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Passwort ändern
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Aktuelles Passwort</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Neues Passwort</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">
                      Neues Passwort bestätigen
                    </span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Ändern...
                      </>
                    ) : (
                      "Passwort ändern"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
