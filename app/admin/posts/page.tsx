"use client";

import { useState } from "react";
import { PageTitle, Pill, Toast, coralBtn, dangerBtn, labelClass, primaryBtn, revealIfOffscreen } from "@/components/admin/ui";
import { useAdmin } from "@/lib/admin-store";
import { POST_CATEGORIES, type PostCategory } from "@/lib/data";
import { deletePostAction, savePostAction } from "../actions";

const CATEGORIES = POST_CATEGORIES;
const EMPTY = { title: "", category: "News" as PostCategory, body: "" };

export default function PostsPage() {
  const { posts, setPosts } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [missing, setMissing] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  function change(patch: Partial<typeof EMPTY>) {
    setDraft((d) => ({ ...d, ...patch }));
    setMissing(false);
    setToast("");
  }

  function save(status: "published" | "draft") {
    if (status === "published" && (!draft.title.trim() || !draft.body.trim())) {
      setMissing(true);
      return;
    }
    setBusy(true);
    savePostAction({ id: editingId ?? undefined, ...draft, status })
      .then((post) => {
        setPosts((ps) => (editingId ? ps.map((p) => (p.id === editingId ? post : p)) : [post, ...ps]));
        setEditingId(post.id);
        setToast(status === "published" ? "Published. It now shows on the News page." : "Draft saved. It's hidden from the News page.");
      })
      .catch(() => setToast("Couldn't save the post. Check your connection and try again."))
      .finally(() => setBusy(false));
  }

  return (
    <>
      <Toast message={toast} />
      <PageTitle
        title="Posts"
        intro="Share news, new drops and tips. Published posts appear on the News page."
        action={
          <button
            type="button"
            className={coralBtn}
            onClick={() => {
              setEditingId(null);
              setDraft(EMPTY);
              setMissing(false);
              setToast("");
              revealIfOffscreen("post-editor");
            }}
          >
            + New post
          </button>
        }
      />

      <div className="rise rise-2 flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[1_1_min(320px,100%)] flex-col gap-2.5">
          {posts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setEditingId(p.id);
                setDraft({ title: p.title, category: p.category, body: p.body });
                setMissing(false);
                setToast("");
                revealIfOffscreen("post-editor");
              }}
              className={`lift pop flex w-full flex-col gap-1.5 rounded-[22px] border-[3px] bg-white px-[18px] py-4 text-left ${p.id === editingId ? "border-navy" : "border-transparent"}`}
            >
              <span className="flex flex-wrap items-center gap-2">
                <Pill className={`py-0.5! text-xs! ${p.status === "published" ? "bg-[#D7F2E2] text-[#14663D]" : "bg-[#FFF1C7] text-[#7A5200]"}`}>
                  {p.status === "published" ? "Published" : "Draft"}
                </Pill>
                <span className="text-[13px] text-muted">
                  {p.category} · {p.date}
                </span>
              </span>
              <span className="text-[17px] font-bold">{p.title}</span>
            </button>
          ))}
        </div>

        <form id="post-editor" aria-label="Write a post" onSubmit={(e) => e.preventDefault()} className="flex min-w-0 flex-[999_1_min(460px,100%)] scroll-mt-4 flex-col gap-3.5 rounded-[28px] bg-white p-5 sm:rounded-[32px] sm:p-[26px]">
          <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em]">{editingId ? "Edit post" : "New post"}</h2>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="p-title" className={labelClass}>Title</label>
            <input id="p-title" value={draft.title} onChange={(e) => change({ title: e.target.value })} className="h-[50px] rounded-[14px] bg-ice px-3.5 text-base text-ink" />
          </div>
          <fieldset>
            <legend className={`${labelClass} mb-2`}>Type</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={draft.category === c}
                  onClick={() => change({ category: c })}
                  className={`bubbly h-11 rounded-full px-4 text-[15px] font-semibold ${draft.category === c ? "bg-ink text-white" : "bg-ice text-ink"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="p-body" className={labelClass}>Post</label>
            <textarea id="p-body" rows={7} value={draft.body} onChange={(e) => change({ body: e.target.value })} className="resize-y rounded-[14px] bg-ice px-3.5 py-3 text-base leading-relaxed text-ink" />
          </div>
          {missing && <p className="jelly text-sm font-semibold text-crimson">Add a title and some text before publishing.</p>}
          <div className="flex flex-wrap gap-2.5">
            <button type="button" disabled={busy} onClick={() => save("published")} className={`flex-[1_1_180px] disabled:opacity-60 ${primaryBtn}`}>
              Publish
            </button>
            <button type="button" disabled={busy} onClick={() => save("draft")} className="disabled:opacity-60 bubbly h-14 flex-[1_1_160px] rounded-[18px] bg-sky text-[17px] font-bold text-navy">
              Save as draft
            </button>
            {editingId && (
              <button
                type="button"
                className={dangerBtn}
                disabled={busy}
                onClick={() => {
                  const id = editingId;
                  if (!window.confirm("Delete this post? This can't be undone.")) return;
                  setBusy(true);
                  deletePostAction(id)
                    .then(() => {
                      setPosts((ps) => ps.filter((p) => p.id !== id));
                      setEditingId(null);
                      setDraft(EMPTY);
                      setToast("Post deleted.");
                    })
                    .catch(() => setToast("Couldn't delete the post. Try again."))
                    .finally(() => setBusy(false));
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
