import { UserIcon } from "./icons";

export default function AuthorBio({ author }: { author: string }) {
  return (
    <div className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-white p-6">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
        <UserIcon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-[15px] font-bold text-navy">{author}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-body-text">
          Đội ngũ biên tập nội dung của MAX OFFICE — chia sẻ kiến thức thực tế về
          thành lập doanh nghiệp, kế toán thuế và vận hành văn phòng tại TP.HCM.
        </p>
      </div>
    </div>
  );
}
