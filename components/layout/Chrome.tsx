import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { getViewerContext } from "@/lib/region";
import { tmdbApi, TmdbConfigError } from "@/lib/tmdb/client";

export async function Chrome({ children }: { children: React.ReactNode }) {
  const { region } = await getViewerContext();
  let countries: Array<{ iso_3166_1: string; english_name: string }> = [];
  try {
    countries = (await tmdbApi.countries()).sort((a, b) =>
      a.english_name.localeCompare(b.english_name),
    );
  } catch (e) {
    if (!(e instanceof TmdbConfigError)) {
      countries = [];
    }
  }

  return (
    <>
      <Header region={region} countries={countries} />
      <main id="main" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
