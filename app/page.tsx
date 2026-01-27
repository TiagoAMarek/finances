import { redirect } from "next/navigation";

// Server Component - uses server-side redirect
export default function Home() {
  redirect("/login");
}
