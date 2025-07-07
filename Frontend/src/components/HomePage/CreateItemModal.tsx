import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createItemSchema,
  type CreateItemFormData,
  CATEGORIES,
  CONDITIONS,
} from "../../schemas/ItemSchemas.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemFormData) => void;
}

export default function CreateItemModal({ isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
  });

  const handleFormSubmit = (data: CreateItemFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Neuen Artikel erstellen</h2>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Bilder auswählen (bis zu 5)
                </legend>
                <input
                  {...register("images")}
                  type="file"
                  accept="image/*"
                  multiple
                  className="file-input"
                />
                <label className="label">
                  Max. Größe 2MB pro Bild, bis zu 5 Bilder
                </label>
              </fieldset>
              <input
                {...register("title")}
                placeholder="Titel"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-error text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register("description")}
                placeholder="Beschreibung"
                className="textarea textarea-bordered w-full"
              />
              {errors.description && (
                <p className="text-error text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("category")}
                className="select select-bordered w-full"
              >
                <option value="">Kategorie auswählen</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-error text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("location")}
                placeholder="Standort"
                className="input input-bordered w-full"
              />
              {errors.location && (
                <p className="text-error text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("condition")}
                className="select select-bordered w-full"
              >
                <option value="">Zustand auswählen</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="text-error text-xs mt-1">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost flex-1"
              >
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
