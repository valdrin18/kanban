import guhrLogo from "../../images/guhrlogo.png";

export function Header() {
  return (
    <header className="border-b border-guhr-border/70 bg-guhr-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1800px] items-center px-4 py-2 sm:px-6 lg:px-8">
        <img
          src={guhrLogo}
          alt="Guhr Steuerberatungsgesellschaft mbH"
          className="h-14 w-auto max-w-[242px] object-contain sm:h-16 sm:max-w-[284px]"
        />
      </div>
    </header>
  );
}
