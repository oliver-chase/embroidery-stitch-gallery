# Stitch Gallery

A single-file, local-only embroidery library browser. No install, no
server, no upload — open the HTML file in a browser and it renders
your whole design folder as a scrollable, navigable gallery.

## Why

Embroidery files (`.dst`, `.pes`, and similar) don't preview natively
on Windows or Mac, so a folder full of them just shows generic file
icons. This reads the stitch data directly and draws a real preview
for every design, organized the way your files already are on disk.

## Features

- **Folder tree navigation** — a sidebar mirrors your folder structure.
  Expand/collapse with the arrows, and each folder shows how many
  designs are inside it (including subfolders).
- **Click-through browsing** — click a folder in the sidebar or a
  folder tile in the grid to open it. Breadcrumbs at the top let you
  jump back to any parent level instantly.
- **Real stitch-level previews** — draws the actual needle path, not a
  generic icon, including proper handling of jump/trim stitches so
  designs don't look like tangled scribble.
- **True thread colors** — reads the color table embedded in `.pes`
  files and renders each color block in its real color, not a
  placeholder.
- **Fast after the first load** — the folder structure is scanned once
  up front; browsing between folders afterward is instant.
- **Cloud-storage aware** — if a file lives in OneDrive/iCloud/Dropbox
  and hasn't downloaded yet, it's flagged as "cloud-only" instead of
  freezing the whole app.
- **100% local** — nothing is uploaded anywhere. All parsing and
  rendering happens in your browser, in memory.

## Usage

1. Download `stitch-gallery.html`.
2. Open it in Chrome or Edge (best support for folder access).
3. Click **Choose Folder…** and select your top-level embroidery
   folder, or just drag the folder onto the page.
4. Browse the sidebar tree or click folder tiles in the grid to
   navigate. Click any design to see a larger preview.

If your files are in cloud storage, make the folder available
offline first (e.g. OneDrive: right-click → "Always keep on this
device") for the fastest, most complete previews.

## Supported formats

- `.dst` (Tajima) — universal commercial format, stitch data only, no
  embedded colors.
- `.pes` (Brother / Babylock) — includes embedded thread colors, read
  from the standard PEC thread palette.

Other formats (`.jef`, `.vp3`, `.exp`, etc.) aren't parsed yet. Files
in unsupported formats will still appear in the browser but show a
"can't preview" placeholder.

## How it works

Everything lives in one HTML file with inline CSS and JavaScript:

- A hand-written binary parser reads the DST and PEC/PES stitch
  formats directly (no libraries, no build step).
- A folder tree model groups files by their real path structure.
- Folder scanning uses the File System Access API (or a drag-and-drop
  fallback) to read file names without downloading file contents —
  actual stitch data is only read when you open the folder a design
  lives in, which is what keeps cloud-backed folders from stalling.
- Stitch paths are drawn to an HTML canvas per design, scaled to fit
  and colored using the design's real thread palette where available.

## Known limits

- Only reads `.dst` and `.pes`.
- Color data requires a `.pes` file with an embedded color table; DST
  designs render in a neutral gray since the format has no color data.
- Folder picking works best in Chromium-based browsers (Chrome, Edge).
  Firefox and Safari fall back to a flat file picker without live
  folder-tree access.
