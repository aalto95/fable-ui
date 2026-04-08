### Markdown in the schema
    
Use a **`markdown`** leaf with a `content` string (GFM: tables, lists, fenced code).

| Step | Action |
| --- | --- |
| 1 | Define `type: "markdown"` |
| 2 | Pass `content` |

```ts
{ "type": "markdown", "content": "## Hello" }
```
