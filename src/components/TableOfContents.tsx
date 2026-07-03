import { ListIcon } from "./icons";

export type TocItem = { id: string; label: string };

export default function TableOfContents({ items = [] }: { items?: TocItem[] }) {
  return (
    <div className="mb-8 rounded-2xl border border-line bg-bg-tint p-6">
      <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold tracking-wide text-navy uppercase">
        <ListIcon className="h-4 w-4" />
        Mục lục
      </h2>
      {items.length === 0 ? (
        <p className="text-[13.5px] text-body-text">
          Mục lục sẽ tự động hiển thị khi bài viết được đăng tải đầy đủ nội dung.
        </p>
      ) : (
        <ol className="flex flex-col gap-2 text-[13.5px] text-body-text">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="transition-colors duration-200 hover:text-primary">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
