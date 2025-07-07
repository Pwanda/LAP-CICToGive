import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
  isOwner?: boolean;
  onDeleteImage?: (imageUrl: string) => void;
  isDeleting?: boolean;
}

export default function ImageGallery({
  images,
  title,
  isOwner = false,
  onDeleteImage,
  isDeleting = false,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg bg-base-200 flex items-center justify-center h-96">
        <span className="text-base-content/50 text-xl">
          Kein Bild verfügbar
        </span>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteCurrent = () => {
    if (onDeleteImage && images[currentIndex]) {
      onDeleteImage(images[currentIndex]);
      // If we're deleting the last image, go to previous
      if (currentIndex === images.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div className="relative">
      {/* Main Image Display */}
      <div className="rounded-lg bg-base-200 overflow-hidden relative">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full max-h-96 object-contain"
        />

        {/* Delete Button - Simple X */}
        {isOwner && onDeleteImage && (
          <button
            className="btn btn-error btn-xs absolute top-2 right-2 z-10"
            onClick={handleDeleteCurrent}
            disabled={isDeleting}
            type="button"
          >
            ✕
          </button>
        )}

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-all duration-200"
              onClick={handlePrevious}
              type="button"
            >
              ❮
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-all duration-200"
              onClick={handleNext}
              type="button"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-base-300 hover:bg-base-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center mt-2 text-sm text-base-content/60">
          {currentIndex + 1} von {images.length}
        </div>
      )}
    </div>
  );
}
