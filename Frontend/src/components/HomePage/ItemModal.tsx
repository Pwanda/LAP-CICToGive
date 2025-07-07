import type { Item } from "../../types";
import CommentSection from "./CommentSection";
import ImageGallery from "../ImageGallery";
import { useComments, useToggleReservation, useItem } from "../../hooks/useAPI";

interface ItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: Item) => void;
}

export default function ItemModal({
  item,
  isOpen,
  onClose,
  onEdit,
}: ItemModalProps) {
  // Use real-time item data instead of stale selectedItem
  const { data: currentItem } = useItem(item?.id || 0, {
    enabled: !!item && isOpen,
  });
  const { data: comments = [], refetch: refetchComments } = useComments(
    item?.id || 0,
    { enabled: !!item && isOpen },
  );

  const toggleReservationMutation = useToggleReservation();

  // Use current item data from query, fallback to passed item
  const displayItem = currentItem || item;

  if (!displayItem || !isOpen) return null;

  const handleReserve = async () => {
    try {
      await toggleReservationMutation.mutateAsync(displayItem.id);
    } catch (error) {
      console.error("Failed to toggle reservation:", error);
    }
  };

  const handleAddComment = () => {
    // Refetch comments after adding
    refetchComments();
  };

  const handleEdit = () => {
    if (displayItem && onEdit) {
      onEdit(displayItem);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-base-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Artikel-Details</h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Images */}
            <div className="lg:w-1/2">
              <ImageGallery
                images={displayItem.imageUrls || []}
                title={displayItem.title}
                isOwner={false}
                onDeleteImage={undefined}
                isDeleting={false}
              />
            </div>

            <div className="lg:w-1/2">
              <div className="mb-4">
                <h3 className="font-bold text-2xl mb-2">{displayItem.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  {displayItem.isReserved && (
                    <div className="badge">Reserviert</div>
                  )}
                  {displayItem.isMyItem && (
                    <div className="badge badge-secondary">Mein Artikel</div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{displayItem.location}</span>
                </div>

                <div className="flex items-center gap-2">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>{displayItem.category}</span>
                </div>

                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{displayItem.datePosted}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Zustand</h4>
                <p className="text-base-content/80">{displayItem.condition}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Beschreibung</h4>
                <p className="text-base-content/80">
                  {displayItem.description}
                </p>
              </div>

              <div className="mt-6">
                {displayItem.isMyItem ? (
                  <div className="space-y-3">
                    <button
                      className={`btn w-full ${displayItem.isReserved ? "btn-warning" : "btn-success"}`}
                      onClick={handleReserve}
                      disabled={toggleReservationMutation.isPending}
                    >
                      {toggleReservationMutation.isPending
                        ? "Wird aktualisiert..."
                        : displayItem.isReserved
                          ? "Reservierung entfernen"
                          : "Als reserviert markieren"}
                    </button>

                    <button
                      className="btn btn-info w-full"
                      onClick={handleEdit}
                    >
                      Artikel bearbeiten
                    </button>
                  </div>
                ) : displayItem.isReserved ? (
                  <button className="btn btn-neutral w-full" disabled>
                    Bereits reserviert
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <CommentSection
            itemId={displayItem.id}
            comments={comments}
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
}
