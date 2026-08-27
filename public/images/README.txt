PELAGIC MARINE — IMAGE ORGANIZATION
====================================

SOURCE IMAGE FOLDERS
--------------------

  stock/   Downloaded stock or externally licensed images.
  owned/   Images created by Pelagic Marine or supplied with confirmed
           ownership/permission. Team portraits belong in owned/team/.
  patterns/ Design patterns and other non-photographic decorative assets.

Keep licensing records outside this public folder:

  docs/image-licenses/

Create one Markdown record per source image. Include the creator, source URL,
license, license URL, download or capture date, original dimensions, intended
use, attribution requirements, and any edits or releases.

RESPONSIVE VARIANTS
-------------------

The source image and its generated JPEG, WebP, and AVIF variants stay together
in the same provenance folder. Variants use the naming pattern:

  image-name-320w.jpg
  image-name-640w.webp
  image-name-1280w.avif

Run the generator after adding, moving, or replacing a source image:

  npm run generate-images

Do not edit src/lib/image-manifest.generated.ts manually. Do not create
separate license files inside public/images/, and do not treat generated
variants as separate original images.
