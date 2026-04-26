import Separator from "@/components/landing/ui/Separator";

export default function ImageSection() {
  return (
    <section className="w-full flex flex-col items-center relative z-10 pb-20">
      {/* LINE 1 */}
      <div className="w-full h-px bg-neutral-700/30"></div>

      {/* Image Box */}
      <div className="w-full max-w-300">
        <div className="h-[90vh] w-full bg-[#d9d9d9]"></div>
      </div>

      {/* LINE 2 */}
      <div className="w-full h-px bg-neutral-700/30"></div>

      <div className="w-full max-w-300">
        <Separator />
      </div>

      {/* LINE 3 */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </section>
  );
}
