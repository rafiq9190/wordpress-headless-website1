import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { logos } from "@/content/marketing";

/** Social proof strip. Wordmarks are set in type rather than shipped as images. */
export function LogoWall() {
  return (
    <section aria-labelledby="logo-wall-heading" className="py-10">
      <Container width="wide">
        <h2
          id="logo-wall-heading"
          className="text-center font-mono text-xs tracking-[0.2em] text-ink-faint uppercase"
        >
          Trusted by finance teams closing faster
        </h2>

        <Marquee className="mt-8">
          <ul className="flex items-center gap-14">
            {logos.map((logo) => (
              <li
                key={logo}
                className="font-display text-base font-semibold tracking-[0.14em] whitespace-nowrap text-ink-faint transition-colors duration-300 hover:text-ink-soft"
              >
                {logo}
              </li>
            ))}
          </ul>
        </Marquee>
      </Container>
    </section>
  );
}
