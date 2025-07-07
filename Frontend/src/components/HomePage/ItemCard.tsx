import type { Item } from "../../types";

interface ItemCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
}

export default function ItemCard({ item, onItemClick }: ItemCardProps) {
  return (
    <div
      className="card bg-base-100 shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onItemClick(item)}
    >
      {/* Fixed: aspect ratio on figure, not img */}
      <figure className="aspect-[4/3] overflow-hidden">
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <img
            className="w-full h-full object-cover"
            src={item.imageUrls[0]}
            alt={item.title}
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <span className="text-base-content/50 text-lg">Kein Bild</span>
          </div>
        )}
      </figure>
      <div className="card-body prose text-xl">
        <h2 className="card-title flex-wrap">
          <span className="flex-1 text-2xl">{item.title}</span>
          <div className="flex gap-1 flex-wrap">
            {item.isReserved && (
              <div className="badge badge-lg badge-reserved">Reserviert</div>
            )}
            {item.isMyItem && (
              <div className="badge badge-lg badge-my-item">Mein Inserat</div>
            )}
          </div>
        </h2>
        <p>{item.description}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-lg badge-outline">{item.category}</div>
          <div className="badge badge-lg badge-outline">{item.location}</div>
        </div>
      </div>
    </div>
  );
}
