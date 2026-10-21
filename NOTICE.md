# Notice

This storefront theme is a derivative of the design of **ecommerce-react** by Julius Guevarra
(https://github.com/jgudo/ecommerce-react), licensed under the Apache License, Version 2.0,
ported onto the Your Next Store storefront. The original repository ships no NOTICE file;
its licence text is reproduced in full below, as section 4(a) of the licence requires.

## Changes made (Apache-2.0 section 4(b))

The original is a React 17 / Redux / Firebase single-page app. Nothing of its code runs
here: its visual design was re-implemented as Next.js App Router components and Tailwind
CSS on the Your Next Store commerce SDK. Ported: the Tajawal type, the #f9f9f9 / #f2f2f2 /
#e1e1e1 / #101010 palette and square bold buttons, the header (logo, link row with active
state, bordered search bar, basket with red count badge, Sign Up / Sign In buttons, white
mobile bar with a search row), the home banner layout, the
"Featured" and "Recommended" showcase grids with "See All" links, the bordered shop-grid
cards with the hover "Add to basket" bar, the filters modal, the product panel (thumbnail
column, picture well, size select, colour dots with a tick, price, "Add To Basket"), the
"My Basket" side panel with +/− control column, the banner-style Featured/Recommended pages
(used for collections and categories) and the three-part footer.

Not ported: Firebase authentication, the account/profile pages, the admin dashboard and
product CRUD, and the three-step checkout (shoppers sign in and pay on the platform's hosted
checkout and account area). The original's name and logo artwork are not used: the store's
own name is rendered as text beside a plain bag mark. No images from the original repository
are used: its banner model photographs carry no licence statement. Product cards, product pages
and the basket show the store's own product photos; the banners use the store's own eyewear
photographs unless the merchant set a collection or category image.

<!-- store-pipeline:generated -->
## Generated photographs

These files were generated for this template's store with an image model (bfl/flux-2-klein-9b through the Vercel AI Gateway).
They show no real products, people or brands and carry no third-party licence:

- `public/images/pexels/banner-hat-bag.jpg`
- `public/images/pexels/banner-vase.jpg`
- `public/images/pexels/banner-hanger.jpg`
<!-- /store-pipeline:generated -->
