import { ReactNode } from "react";

type Props = { title: string; image: string; reverse?: boolean; children: ReactNode };

export default function AuthLayout({ title, image, reverse, children }: Props) {
  return (
    <main
      className={`flex min-h-screen flex-col gap-10 bg-[#EEF3EC] px-4 pt-10 md:flex-row md:px-20 md:pt-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex flex-1 flex-col">
        <img
          src="/images/logo.svg"
          alt="Stock.io"
          className={`h-10 w-fit ${reverse ? "md:self-center" : ""}`}
        />
        <div className="hidden flex-1 items-end justify-center md:flex">
          <img src={image} alt="" className="max-h-[72vh] w-auto" />
        </div>
      </div>

      <section className="flex w-full flex-col rounded-t-[48px] bg-[#14201B] px-6 pb-12 pt-16 md:mt-16 md:w-[538px] md:px-16 md:pt-24">
        <h1 className="mb-12 text-center text-3xl font-bold uppercase text-white">{title}</h1>
        {children}
      </section>
    </main>
  );
}
