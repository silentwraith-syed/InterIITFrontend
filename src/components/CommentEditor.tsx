import { useState } from "react";


export default function CommentEditor({ onSubmit, autoFocus }: { onSubmit: (text: string) => void; autoFocus?: boolean }) {
const [text, setText] = useState("");
return (
<div className="mt-2">
<textarea
className="input h-24 resize-y"
placeholder="Write a reply…"
value={text}
onChange={(e) => setText(e.target.value)}
autoFocus={autoFocus}
/>
<div className="mt-2 flex gap-2">
<button className="btn-primary" onClick={() => { if (text.trim()) { onSubmit(text.trim()); setText(""); } }}>Reply</button>
<button className="btn-ghost" onClick={() => setText("")}>Clear</button>
</div>
</div>
);
}