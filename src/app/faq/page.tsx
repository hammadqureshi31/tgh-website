import FAQSection from "@/components/sections/FAQ";
import MobileBookingButton from "@/components/MobileBookingButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | The Gentry House",
  description: "Frequently asked questions about The Gentry House barbershop, pricing, services, and booking.",
};

export default function FAQPage() {
  return (
    <main>
      <div className="pt-20"> {/* Add padding top to account for header */}
        <FAQSection />
      </div>
      <MobileBookingButton />
    </main>
  );
}
