import {
  ChatBubbleLeftRightIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

function Welcome() {
  return (
    <section className="relative flex min-h-112 items-center justify-center overflow-hidden bg-[#fffdf9] px-6 py-14 sm:min-h-136 lg:min-h-[calc(100vh-8rem)]">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#f2d18b]/60 sm:size-64" />
      <div className="absolute -bottom-24 -left-20 size-64 rounded-full bg-[#a9c9c5]/25" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="relative mx-auto mb-9 h-48 w-64 sm:h-56 sm:w-72" aria-hidden="true">
          <div className="absolute left-0 top-8 h-32 w-52 -rotate-6 rounded-[1.75rem] rounded-bl-md border border-primary/10 bg-[#f9e5df] p-5 shadow-[0_18px_36px_rgba(232,80,58,0.12)] sm:h-36 sm:w-60">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span className="h-2 w-20 rounded-full bg-primary/25" />
            </div>
            <div className="mt-6 flex gap-1.5">
              <span className="size-2 rounded-full bg-primary/50" />
              <span className="size-2 rounded-full bg-primary/50" />
              <span className="size-2 rounded-full bg-primary/50" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-36 w-56 rotate-6 rounded-[1.75rem] rounded-br-md bg-slate-950 p-5 text-left shadow-[0_20px_38px_rgba(15,23,42,0.18)] sm:h-40 sm:w-64">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-full bg-[#a9c9c5] text-slate-950">
                <FaceSmileIcon className="size-5" />
              </span>
              <ChatBubbleLeftRightIcon className="size-5 text-[#f2d18b]" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-2 w-32 rounded-full bg-white/80" />
              <div className="h-2 w-20 rounded-full bg-white/25" />
            </div>
            <PaperAirplaneIcon className="absolute bottom-5 right-5 size-5 -rotate-12 text-primary" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          A little room to breathe
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          Your conversations start here.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Search for someone on the left, then choose a conversation to start chatting.
        </p>
        <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500 shadow-sm">
          <span className="size-2 rounded-full bg-[#72b6a7]" />
          Your inbox is ready
        </div>
      </div>
    </section>
  );
}

export default Welcome