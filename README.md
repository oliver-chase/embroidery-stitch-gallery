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

For `.pes` files, it also reads the embedded thread colors and uses those colors in the preview. `.dst` files do not contain color information, so each color block gets a stand-in thread color. Those colors are placeholders, not the real thread.

### Watch it sew

Open a design and press **Play** to watch it stitch in order, as the machine would. Drag the slider to jump to any point, and pick 1x to 20x speed. The finished color blocks dim, the current block stays bold with a dot at the needle, and a line under the slider tells you which color block and stitch you are on.

### Recolor a design

Open a design and click a colored dot under the slider to choose a color block. Then click a thread from the palette, or use **Custom** to pick any color. This is the quickest way to give a `.dst` design real colors. **Reset colours** puts the original colors back.

Tick **Show jumps** to draw the travel moves between stitch runs as dashed red lines. Recolors work during playback and are saved with the design, so the grid thumbnail and the preview show them after a reload.

Recoloring changes only how the gallery draws the design. Your `.dst` and `.pes` files are never modified, and the new colors are stored in your browser and in the tag export file. To get a recolored design into a stitch file, change the thread in your embroidery software.

### Tag and favorite designs

Click the star on a card to favorite it. Open a design and type in **Add tag…** to tag it. Press Enter to add the tag, or type a comma between several, such as `halloween, fall`. Tags show on the card, and search matches them.

The **Saved** list in the sidebar has Favorites and one row per tag, each with a count. Click a row to see those designs from every folder.

Tags, favorites and recolors are stored in your browser, keyed by file path and file size. **Clear cache** leaves them alone. A file replaced by one of a different size starts with no tags.

**Export tags** saves a JSON file with all of it. **Import tags** loads one, so you can move your tags to another computer that has the same folder layout.

### Check a design's details

Click a design to see its stitch count, color changes, number of thread colors, jumps, size in millimeters, thread length and an estimated run time.

* **Run time** is the stitch count at your machine speed, plus 20 seconds for each color change. The default is 1,000 stitches per minute. Change **Machine speed** under the preview and the gallery remembers it.
* **Thread length** counts only real stitches, not the travel between sections.
* `.dst` files have color-change codes but no thread colors, so Colors reads "not in file".
* Trims are not counted separately yet, so run time can read a few seconds short for designs with many trims.

### Find a design fast

Type in the search box (or press `/`) to search every folder at once. Every word you type must appear in the file name or its folder path. Each result shows its folder, and clicking the folder opens it. Press `Esc` to clear the search.

### Pick up where you left off

In Chrome and Edge, the gallery remembers the last folder you opened. Next time, click **Reopen** on the start screen and approve read access.

Each design's thumbnail and size are cached in your browser, so a folder you have already viewed appears without reading any files. The cache lives in your browser only. **Clear cache** in the header removes it and the remembered folder.

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
| `.dst` | Tajima commercial format. Stitch data is supported; the format does not contain thread colors, so previews use stand-in colors. |
| `.pes` | Brother / Babylock format. Embedded thread colors are read from the standard PEC thread palette.                             |

These formats are listed with a "preview not supported yet" note and can still be tagged and favorited, but not previewed: `.jef`, `.exp`, `.vp3`, `.hus`, `.xxx`, `.sew`, `.pec`, `.vip`, `.shv`, `.pcs` and `.emd`.

Unsupported files still appear in the gallery, but show a **can't preview** placeholder.

---

## How it works

Everything runs from a single HTML file with inline CSS and JavaScript. There is no server, build process, or external library.

* A hand-written binary parser reads DST and PEC/PES stitch data directly.
* A folder-tree model preserves the real folder structure.
* The File System Access API reads folder and file names without immediately reading every file's contents. Stitch data is read only when needed, which prevents cloud-backed folders from stalling during the initial scan.
* Each design is drawn to an HTML canvas, scaled to fit the preview, and colored using its embedded thread palette when one is available.
* Cards render only near the visible part of the page. Cards that scroll far away release their canvas, so a folder of thousands of designs stays light.
* Drag-and-drop provides a fallback when live folder access is unavailable.

---

## Known limits

* Only `.dst` and `.pes` files are currently parsed.
* Thread colors require a `.pes` file with an embedded color table.
* `.dst` colors are placeholders, because DST contains no color data.
* Folder selection works best in Chromium-based browsers such as Chrome and Edge.
* Firefox and Safari fall back to a standard file picker and do not provide the same live folder-tree access.

The result is a simple workflow: **point Stitch Gallery at an existing embroidery folder, and immediately see the designs inside it without changing, uploading, or reorganizing your files.**
