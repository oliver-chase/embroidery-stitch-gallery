# Stitch Gallery

Embroidery files contain the actual stitch design, but your computer usually shows them as generic file icons. A folder with hundreds of `.dst` or `.pes` files gives you no way to see what each design looks like.

**Stitch Gallery turns that folder into a visual gallery.** It reads the stitch data directly in your browser and shows real previews, organized using the same folder structure already on your computer.

There is nothing to install, no server to run, and no file upload. The entire application is one HTML file, and embroidery files are parsed in memory on your computer.

## What you can do

### Browse your existing folders

The sidebar mirrors your actual folder structure. Expand and collapse folders, see how many designs each contains, and move through the hierarchy without reorganizing your files.

Click a folder in the sidebar or a folder tile in the grid to open it. Breadcrumbs let you jump back to any parent folder.

### See the actual designs

Stitch Gallery draws the **real needle path** from each embroidery file instead of showing a generic icon.

It handles jump and trim stitches so designs render as separate stitch paths instead of looking like tangled lines.

For `.pes` files, it also reads the embedded thread colors and uses those colors in the preview. `.dst` files do not contain color information, so they render in neutral gray.

### Keep everything local

Nothing is uploaded anywhere. Stitch data is read and rendered in your browser, in memory.

Stitch Gallery also handles cloud-backed folders. If a file in OneDrive, iCloud, or Dropbox has not been downloaded to your computer, it is marked **cloud-only** instead of causing the gallery to freeze.

The folder structure is scanned once when you open it, so moving between folders afterward is fast.

---

## Usage

1. Download `stitch-gallery.html`.
2. Open it in **Chrome or Edge**, which have the best folder support.
3. Click **Choose Folder…** and select your top-level embroidery folder, or drag the folder onto the page.
4. Browse the folder tree or folder tiles. Click a design to see a larger preview.

If your embroidery files are stored in the cloud, make the folder available offline first. For example, in OneDrive, right-click the folder and choose **Always keep on this device**.

---

## Supported formats

| Format | Support                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `.dst` | Tajima commercial format. Stitch data is supported; the format does not contain thread colors, so previews use neutral gray. |
| `.pes` | Brother / Babylock format. Embedded thread colors are read from the standard PEC thread palette.                             |

Other formats, including `.jef`, `.vp3`, and `.exp`, are not parsed yet.

Unsupported files still appear in the gallery, but show a **can't preview** placeholder.

---

## How it works

Everything runs from a single HTML file with inline CSS and JavaScript. There is no server, build process, or external library.

* A hand-written binary parser reads DST and PEC/PES stitch data directly.
* A folder-tree model preserves the real folder structure.
* The File System Access API reads folder and file names without immediately reading every file's contents. Stitch data is read only when needed, which prevents cloud-backed folders from stalling during the initial scan.
* Each design is drawn to an HTML canvas, scaled to fit the preview, and colored using its embedded thread palette when one is available.
* Drag-and-drop provides a fallback when live folder access is unavailable.

---

## Known limits

* Only `.dst` and `.pes` files are currently parsed.
* Thread colors require a `.pes` file with an embedded color table.
* `.dst` designs render in neutral gray because DST contains no color data.
* Folder selection works best in Chromium-based browsers such as Chrome and Edge.
* Firefox and Safari fall back to a standard file picker and do not provide the same live folder-tree access.

The result is a simple workflow: **point Stitch Gallery at an existing embroidery folder, and immediately see the designs inside it without changing, uploading, or reorganizing your files.**
