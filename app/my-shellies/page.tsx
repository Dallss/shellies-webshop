import type { Metadata } from "next";
import { ShellieEditor } from "./ShellieEditor";

export const metadata: Metadata = { title: "My Shellies" };

export default function MyShelliesPage() {
  return <ShellieEditor />;
}
