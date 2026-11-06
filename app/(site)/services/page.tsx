import { PageShell } from "@/components/PageShell";
import { Services } from "@/components/Services";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("services");
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <PageShell>
      <Services services={services} headingLevel={1} />
    </PageShell>
  );
}
