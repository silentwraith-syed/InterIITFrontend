import { useComments } from "../store/comments";
import type { SortKey } from "../types";


const options: { key: SortKey; label: string }[] = [
{ key: "top", label: "Top" },
{ key: "new", label: "New" },
{ key: "replies", label: "Most Replies" },
];


export default function SortBar() {
const { sort, setSort } = useComments();
return (
<div className="flex items-center gap-2 text-sm">
<span className="text-base-mute">Sort:</span>
<div className="flex gap-1">
{options.map((o) => (
<button
key={o.key}
onClick={() => setSort(o.key)}
className={`badge ${sort === o.key ? "ring-2 ring-brand-primary/50" : "opacity-80"}`}
>
{o.label}
</button>
))}
</div>
</div>
);
}