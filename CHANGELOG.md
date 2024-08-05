# [1.12.0](https://github.com/yournextstore/yournextstore/compare/v1.11.1...v1.12.0) (2024-06-26)

### Bug Fixes

- btn margin ([bb55c4f](https://github.com/yournextstore/yournextstore/commit/bb55c4ff43a2b2eee7b376c7d7145567d51bab93))
- disable scroll-smooth for scroll restoration to work properly ([91ab9d7](https://github.com/yournextstore/yournextstore/commit/91ab9d7be4c02db6b15d2771fcfabff089570c0a))
- do not update url if user navigated away from the cart ([86542b8](https://github.com/yournextstore/yournextstore/commit/86542b8020673068d06c076847876c733934bbfe))
- do not update url if user navigated away from the cart ([2a36146](https://github.com/yournextstore/yournextstore/commit/2a361469e3b60e2bfd74d1c2fe85ac667e3858f9))
- **search:** add debounce to search ([fb796a9](https://github.com/yournextstore/yournextstore/commit/fb796a9b727f6fcc537580639d9b89197ae745bb))
- **search:** add suffix search ([3bba0db](https://github.com/yournextstore/yournextstore/commit/3bba0dbf6b7ff3cfb17ad3481864aad6cafdba35))
- **search:** bug in search input ([18710b3](https://github.com/yournextstore/yournextstore/commit/18710b3c67170d5585c7594bdf2f44df4ff08245))

### Features

- add optimistic cart ([8f70947](https://github.com/yournextstore/yournextstore/commit/8f70947e0138cbc11a70663758a66c1b535f3233))
- add speculative prerendering of cart page to speed-up full page nabvigation ([d00bed5](https://github.com/yournextstore/yournextstore/commit/d00bed5b1c0686d120d78307c994214678c84782))
- introduce custom in-memory search ([7e8eefe](https://github.com/yournextstore/yournextstore/commit/7e8eefe1d4d1d1a1e142ff2eceaaf8000669a5a2))
- reorganize routes structure for cart ([f9da53a](https://github.com/yournextstore/yournextstore/commit/f9da53ad1fd99d269d04620ce36b3f3f76e70776))
- **search:** make search input more responsive ([b69707f](https://github.com/yournextstore/yournextstore/commit/b69707f57c0215fe638132bb1ab3288991aff7d3))
- **search:** use in-memory search instead of Orama cloud ([0387fed](https://github.com/yournextstore/yournextstore/commit/0387feda44def68f5cbc0aba0203ebf40b0163ae))

## [1.11.1](https://github.com/yournextstore/yournextstore/compare/v1.11.0...v1.11.1) (2024-06-15)

### Bug Fixes

- add full support for MDX ([da9b932](https://github.com/yournextstore/yournextstore/commit/da9b9326fd107d5b1203cc4fa9c779b54ee71d44))
- fix inlang settings ([1769ed0](https://github.com/yournextstore/yournextstore/commit/1769ed024a18bcbd9f9f8188d4f111ea3dcac052))
- make language configurable through env variables ([aceaffc](https://github.com/yournextstore/yournextstore/commit/aceaffc694ea1d43a8b2e4bdb6f6846e83d38f8a))

# [1.11.0](https://github.com/yournextstore/yournextstore/compare/v1.10.0...v1.11.0) (2024-06-13)

### Bug Fixes

- build ([d3f4ddb](https://github.com/yournextstore/yournextstore/commit/d3f4ddb2203fd2ce13129c929441eb08456a94ef))
- cart removal bug ([e8e61b0](https://github.com/yournextstore/yournextstore/commit/e8e61b0ba0180a312d737ca5dd18dd3e9e77e4ca))
- do not recalculate taxes on adding to cart when not on cart page ([b811d17](https://github.com/yournextstore/yournextstore/commit/b811d17f0d6ecc0419010348da6f491a887e964c))
- fix logo margin ([7b98cf9](https://github.com/yournextstore/yournextstore/commit/7b98cf9627f060abc377fac1fb50d4ef67e2b8ab))
- override console.error about element.ref on client-side oto ([ea7a32c](https://github.com/yournextstore/yournextstore/commit/ea7a32c99cb98349906d3f736d9ae31b074d6adb))

### Features

- add debugger configuration for vscode ([e610068](https://github.com/yournextstore/yournextstore/commit/e610068da9018970484917bb43ed1816be48bfb9))
- **i18n:** add Sherlock VS Code extension configuration for i18n ([cf0b1a3](https://github.com/yournextstore/yournextstore/commit/cf0b1a3c54e061f637ba1abe2b32d57805655487))
- **i18n:** fixes ([8b5f7d7](https://github.com/yournextstore/yournextstore/commit/8b5f7d7c2c7b6a449a581a5804fc5c5125c7d059))
- **i18n:** implement source file for all texts ([64aa40a](https://github.com/yournextstore/yournextstore/commit/64aa40a160b148ba29c2c5a3bcc42a9f035f10ab))
- **i18n:** pass locale to currency formatting ([bef583f](https://github.com/yournextstore/yournextstore/commit/bef583f14d28ff1d4d23d82a50fa5ec9be2fb93d))
- **tax:** add feature flag for taxes ([5178b98](https://github.com/yournextstore/yournextstore/commit/5178b987f6d468edcc319407ea6c1b9ea56eba90))
- **tax:** automatic taxes calculation NEEDS OPTIMISATIONS ([f036d89](https://github.com/yournextstore/yournextstore/commit/f036d8978de0d14a5dbf4334c9ab6e148bbfbb80))
- **tax:** handle tax calculation expiration ([d4bffae](https://github.com/yournextstore/yournextstore/commit/d4bffae1a555b0207db2c67a400f208b84f842d4))
- **tax:** taxes calculation ([ea8f30a](https://github.com/yournextstore/yournextstore/commit/ea8f30ae64d27cb023e3c18e8944ffd78bc70e67))
- tweak quantity change buttons ([13404eb](https://github.com/yournextstore/yournextstore/commit/13404eb06d0e0d76c6ccbd603a9f954bb49e55e5))

# [1.10.0](https://github.com/yournextstore/yournextstore/compare/v1.9.0...v1.10.0) (2024-05-28)

### Bug Fixes

- bug where cart would be not revalidated after adding something ([2423407](https://github.com/yournextstore/yournextstore/commit/242340711d78b707399c521ae55254dbb0a37586))
- filtering by country name ([232dd92](https://github.com/yournextstore/yournextstore/commit/232dd9236077135dc12f07b6e931eb82ea47961c))
- improve shipping rates picker ([f4a60db](https://github.com/yournextstore/yournextstore/commit/f4a60db47286f3d7daff17544904352ec032d889))
- increase contrast and add accessible description to image ([eef2b12](https://github.com/yournextstore/yournextstore/commit/eef2b12aa691df502abcc6e54bcff9194d481d37))
- nav menu touch interactions on iOS ([df907ef](https://github.com/yournextstore/yournextstore/commit/df907efdb95d5e7672ceb6146f9b8024064c1fd1))
- update SEO and canonical urls ([a6e2134](https://github.com/yournextstore/yournextstore/commit/a6e213459ec5af6532c692ec95810e9e004c0add))

### Features

- add shipping cost to order summary ([df9edbd](https://github.com/yournextstore/yournextstore/commit/df9edbd7af56b79f130b77036f421eef7269f343))
- add tax ID to billing address ([94aa3a4](https://github.com/yournextstore/yournextstore/commit/94aa3a4dee7e2d5a219e938bcc3adfa8d2247b7a))
- batch cart update requests ([9691012](https://github.com/yournextstore/yournextstore/commit/9691012a26449802391b095e0753d5f121262e0d))
- billing address country select ([10ec5aa](https://github.com/yournextstore/yournextstore/commit/10ec5aa7f0d53153f5cfd433711fcdc6f2874445))
- email newsletter in footer ([eebc947](https://github.com/yournextstore/yournextstore/commit/eebc947870a4e0d2ec0458a30d516f02e4882350))
- enable eslint-plugin-react-compiler ([3c8ddf2](https://github.com/yournextstore/yournextstore/commit/3c8ddf2ef269755fc74ffb55db85775cb9c05532))
- enable React Compiler and Turbopack ([ba675c1](https://github.com/yournextstore/yournextstore/commit/ba675c117742144f54ca366008ae297764e0b338))
- event better footer ([7c506d4](https://github.com/yournextstore/yournextstore/commit/7c506d4775d2f7da32ca02312cf735ab2b6905e7))
- flat shipping rates ([a339f8e](https://github.com/yournextstore/yournextstore/commit/a339f8ec0df60a166cbb57dbd83726d4651969e2))
- implement opne-graph image for products ([1b5ba0e](https://github.com/yournextstore/yournextstore/commit/1b5ba0eab66372feba0edcdf4cad3a8575dee424))
- make cart summary sticky ([70a8cdf](https://github.com/yournextstore/yournextstore/commit/70a8cdf9d24aa0a259a1bfecef1e2d14928bac0c))
- make conditional prefetching work on mobile and with keyboard ([d09c786](https://github.com/yournextstore/yournextstore/commit/d09c7865f527ad4be65e1a55a0019d31d0c990f9))

# [1.9.0](https://github.com/yournextstore/yournextstore/compare/v1.8.0...v1.9.0) (2024-05-18)

### Bug Fixes

- cart aside animation ([129be4f](https://github.com/yournextstore/yournextstore/commit/129be4f49c19e733264ef255b361e774361881fe))
- cart overlay scrolling to bottom ([fc983cf](https://github.com/yournextstore/yournextstore/commit/fc983cf98d39c7fdf4d7667d39bab76353b1d757))
- fix scroll restoration by removing next-view-transitions ([7680f37](https://github.com/yournextstore/yournextstore/commit/7680f37ac65186b93d388d3edc54415d0f630483))
- mobile version fixes ([f124d5f](https://github.com/yournextstore/yournextstore/commit/f124d5f4166eb92a01d8ba1e3cf395a2cf78c34c))
- nav keyboard navigation ([28d9f0c](https://github.com/yournextstore/yournextstore/commit/28d9f0cf621d35e04fa0564745a3c06774a789fd))
- navbar click and hover in short period of time ([8b70d01](https://github.com/yournextstore/yournextstore/commit/8b70d01e5e965f3081e8507c6e6d7f184cc26b6f))
- prefetch dynamic pages on hover ([dbc3918](https://github.com/yournextstore/yournextstore/commit/dbc3918b05a608973f23d7c0e4eebf3ebe4a30ce))
- try fixing revalidation bug of cart ([29c3877](https://github.com/yournextstore/yournextstore/commit/29c3877766d4acfc4d4f1641bed7f20a3b1f6688))

### Features

- add categories boxes ([cfd1914](https://github.com/yournextstore/yournextstore/commit/cfd1914e6df7b74bde632a6365a4a1c0498c4c97))
- all products page ([3afab0b](https://github.com/yournextstore/yournextstore/commit/3afab0bcbe7450e5143ee39b9dfd47033faca662))
- change category images ([6b4bd15](https://github.com/yournextstore/yournextstore/commit/6b4bd153d39564cb665c36ae0d22a5a723d59ebe))
- enable Vercel Analytics and Speed Insights ([94221e5](https://github.com/yournextstore/yournextstore/commit/94221e5146c82910206527e52963e0f2fb5c97e6))
- footer improvements ([9e6226a](https://github.com/yournextstore/yournextstore/commit/9e6226a025a037a85c4aba6825ddc4d78541f0f9))
- improve the homepage ([fe6cc46](https://github.com/yournextstore/yournextstore/commit/fe6cc4697517638eb61ea6c6e1ec89b04178ba68))
- put more focus on checkout by hiding footer below the fold ([e6f003b](https://github.com/yournextstore/yournextstore/commit/e6f003b19314ad0d0eb9b8f79e3be2a71efa59ac))
- responsive web design improvements ([3c1c694](https://github.com/yournextstore/yournextstore/commit/3c1c694323b3ff0641e32debfd23b7fbfc0929e7))

# [1.8.0](https://github.com/yournextstore/yournextstore/compare/v1.7.0...v1.8.0) (2024-05-13)

### Bug Fixes

- clear cookie after purchase ([9621d01](https://github.com/yournextstore/yournextstore/commit/9621d01aa7ed96fb0dbfc55736c78aa66a7616fa))
- clear cookie after purchase ([9f518ee](https://github.com/yournextstore/yournextstore/commit/9f518ee13107e2c904a09d5ea297cfba2b021fe3))
- filter metadata on cart to only fetch products ([7dd2e54](https://github.com/yournextstore/yournextstore/commit/7dd2e5426d3e0632a2f207f74a17ae1684b8cb06))
- fix problem with cart cookie not being revalidated ([56dc26e](https://github.com/yournextstore/yournextstore/commit/56dc26ef4a28a0e6827ad0dfb3a7f0dd55839871))
- improve validation of billing address ([e5e5d33](https://github.com/yournextstore/yournextstore/commit/e5e5d33a9374e71a02a1e62bace792308f5422dd))

### Features

- add Link.com integration via Stripe Elements ([51c89f7](https://github.com/yournextstore/yournextstore/commit/51c89f733e9065d78bc66872696faae4308ddaea))
- support for different billing address ([02e446b](https://github.com/yournextstore/yournextstore/commit/02e446b6e97335cd7120d59c1078353850281c1f))

# [1.7.0](https://github.com/yournextstore/yournextstore/compare/v1.6.1...v1.7.0) (2024-05-08)

### Bug Fixes

- add ENABLE_EXPERIMENTAL_COREPACK for Vercel deployments ([8c45281](https://github.com/yournextstore/yournextstore/commit/8c452819e2bf361efc2744a14694bf6739e7e0a7))
- analytics ([209fe20](https://github.com/yournextstore/yournextstore/commit/209fe20cb759ba765be2842b0c8485fb04b17570))
- make sure variant name is used everywhere ([67c52a6](https://github.com/yournextstore/yournextstore/commit/67c52a633d3b4293fea57d80bca4df41262a829d))
- nav links ([6836497](https://github.com/yournextstore/yournextstore/commit/6836497388cfe53de6fd5d4bd0b21e15ef37259a))
- nav on mobile ([aabf34b](https://github.com/yournextstore/yournextstore/commit/aabf34bb4af13d965f211592a493ddaff22fd756))
- scroll to top on navigation ([f53b614](https://github.com/yournextstore/yournextstore/commit/f53b6144864612d0b72c37d128196759e82f4ae4))
- search input on mobile ([02fff87](https://github.com/yournextstore/yournextstore/commit/02fff873fc0ff2b0a3ad16aa8e0239a498e3efd9))

### Features

- add initial variant setup ([3c17db1](https://github.com/yournextstore/yournextstore/commit/3c17db111509c6ed0dc3347c9c07ad60c6b0b53f))
- add navigation menu ([6981c7e](https://github.com/yournextstore/yournextstore/commit/6981c7e05fe089b0340ea43fbb4e07e8588387fb))
- add order metadata field ([fe10b76](https://github.com/yournextstore/yournextstore/commit/fe10b763f24dae3291cae70c1f630e44809a5fcf))
- add sitemap.xml and robots.txt ([54a3f0d](https://github.com/yournextstore/yournextstore/commit/54a3f0dce5eaed55c8b8dfdc3044c810146c24dd))
- open cart when new products are added ([932156a](https://github.com/yournextstore/yournextstore/commit/932156a19a1472139c156cab292a2d84f39131d8))
- use YNS as placeholder ([28859ac](https://github.com/yournextstore/yournextstore/commit/28859ac8e7697cb8025995e2b9765914d775b633))
- validate product metadata ([9175cdf](https://github.com/yournextstore/yournextstore/commit/9175cdfa2852ecf5033a8039b13c428c534ac0dc))
- **variants:** fix jsonld and product title ([46ad5b0](https://github.com/yournextstore/yournextstore/commit/46ad5b000e8d699f90dd521649a2d5ee28398294))
- **variants:** single product page ([ecb2d0a](https://github.com/yournextstore/yournextstore/commit/ecb2d0aadf3bec927512f02826f0f551b8446cb3))

## [1.6.1](https://github.com/yournextstore/yournextstore/compare/v1.6.0...v1.6.1) (2024-05-04)

### Bug Fixes

- disable Orama telemetry to fix occasional 500ms delays in search ([93d6cb8](https://github.com/yournextstore/yournextstore/commit/93d6cb81a38ed8c2d62a1a6f582c259dc5bc14ae))
- remove duplicate video from readme ([ebb847e](https://github.com/yournextstore/yournextstore/commit/ebb847e5985c9f74ad01d29fca3147135d03d039))

# [1.6.0](https://github.com/yournextstore/yournextstore/compare/v1.5.0...v1.6.0) (2024-05-03)

### Bug Fixes

- add cart fallback for empty cart ([741131c](https://github.com/yournextstore/yournextstore/commit/741131cae0291b69cb37ff2240d5c9d38b5759e4))
- add image bg to products ([9c6546e](https://github.com/yournextstore/yournextstore/commit/9c6546e37f89e6d7ce3be79ca49d89855edd8d47))
- add priority ([905ed37](https://github.com/yournextstore/yournextstore/commit/905ed37417ec476a741a9526b20a2a738831fe80))
- breadcrumbs links ([0a3a2b3](https://github.com/yournextstore/yournextstore/commit/0a3a2b3535e9a089bcd7514d51ad80b16edff01c))
- cart ([38805d3](https://github.com/yournextstore/yournextstore/commit/38805d33c3d6412d6394b2c6378941c400155e85))
- cart preview images background ([fb0f771](https://github.com/yournextstore/yournextstore/commit/fb0f771b78b1db63edebb8c0802c53da0f103f09))
- change All to All Products ([56dc0e4](https://github.com/yournextstore/yournextstore/commit/56dc0e435e3aebd39c0a3b86724fd306d6ebc882))
- change All to All Products ([f43eaad](https://github.com/yournextstore/yournextstore/commit/f43eaad94f86720ae38f241fef4ea3c1f44c3b23))
- disable ppr again ([ad0100e](https://github.com/yournextstore/yournextstore/commit/ad0100e416b8c8ad3b6e85da0950a9b05683b371))
- disable ppr again ([d455453](https://github.com/yournextstore/yournextstore/commit/d4554535f435376cdbab26bd8e03c194d62fb6e7))
- empty cart view ([4076547](https://github.com/yournextstore/yournextstore/commit/4076547b3dad40ce462777b78f7f2b9a873fd743))
- make sure actions are not confused with other functions ([44676f6](https://github.com/yournextstore/yournextstore/commit/44676f6ddf56936da9851d15be95d0f5ac0d5abc))
- position of toast ([3bb4eba](https://github.com/yournextstore/yournextstore/commit/3bb4eba91a3efbf4cda092fc84a5f31f4b22005d))
- refresh router cache in cart ([d19a168](https://github.com/yournextstore/yournextstore/commit/d19a168247e9aa406c096928c14a39f15022b664))
- remove stripe warning ([352e483](https://github.com/yournextstore/yournextstore/commit/352e48337cd0d8a7b120e2341152f3d215558c7a))
- revalidate cart ([8d4e036](https://github.com/yournextstore/yournextstore/commit/8d4e036e95cde7f27f8cc27d1fd317426e28921d))
- search redirects ([4bc3d31](https://github.com/yournextstore/yournextstore/commit/4bc3d3128592248bf69d5909bb59f51bbfceae20))
- visual fixes ([120a77c](https://github.com/yournextstore/yournextstore/commit/120a77c21c26a4f4a7187e738173c228f3a80983))

### Features

- add better ProductNotFound page ([1f8e3f8](https://github.com/yournextstore/yournextstore/commit/1f8e3f80ef0b9981597acea576a5bf131aea3c29))
- add empty cart ([6bce445](https://github.com/yournextstore/yournextstore/commit/6bce445567b948b6ffa999ea60673865842fcda7))
- add force cache ([bf2997e](https://github.com/yournextstore/yournextstore/commit/bf2997e319090f15f10ab456ea43d9e892fa5895))
- add loading state to search ([796ce9c](https://github.com/yournextstore/yournextstore/commit/796ce9cb2a8d29474f592c66b437bb90a901fdce))
- add orama search ([30a8c85](https://github.com/yournextstore/yournextstore/commit/30a8c85408f7bd2db7b1cf09617b08ca4ba5df84))
- add view transitions ([fddc001](https://github.com/yournextstore/yournextstore/commit/fddc001f21d2bb9bdb17b1cacc47066dbfe03a43))
- better orama indexing ([9501501](https://github.com/yournextstore/yournextstore/commit/9501501f4027b8cc024daee44714ee47fcea5bf0))
- cart skeleton ([2c1731c](https://github.com/yournextstore/yournextstore/commit/2c1731c722c3d36400b7d353d40ac7a4a53513dc))
- loading fallback to search input ([7390d48](https://github.com/yournextstore/yournextstore/commit/7390d4815a8279fd3b683d1c39e93b925467ab24))
- make orama optional ([91a56e8](https://github.com/yournextstore/yournextstore/commit/91a56e8885ac2bbffd1658dbdbc073d2e51b9442))
- reenable PPR ([5f9c92f](https://github.com/yournextstore/yournextstore/commit/5f9c92f95bf47b1e11dc97743481338e64445772))
- refactor Orama integration ([aa7d01f](https://github.com/yournextstore/yournextstore/commit/aa7d01f3d378d3c968b973198ad32529740fe546))

# [1.5.0](https://github.com/yournextstore/yournextstore/compare/v1.4.0...v1.5.0) (2024-04-18)

### Features

- allow hiding the Stripe warning ([c2f0f03](https://github.com/yournextstore/yournextstore/commit/c2f0f03a6d758f80b0806b5090f568a26c709c97))

# [1.4.0](https://github.com/yournextstore/yournextstore/compare/v1.3.0...v1.4.0) (2024-04-15)

### Bug Fixes

- capitalize categories ([bfa1a31](https://github.com/yournextstore/yournextstore/commit/bfa1a31a127147cd1cc9322d26f2aea62cf64043))

### Features

- add simple category handling ([12e595e](https://github.com/yournextstore/yournextstore/commit/12e595e947698a796ea66b59447a2ba534654039))
- improve toaster message ([6828248](https://github.com/yournextstore/yournextstore/commit/682824881b652a60ee95a852983dfda22c26e35a))
- search products ([ffdec5a](https://github.com/yournextstore/yournextstore/commit/ffdec5a7983ad186771bc02291f9a4b63a7c0bbf))

# [1.3.0](https://github.com/yournextstore/yournextstore/compare/v1.2.0...v1.3.0) (2024-04-09)

### Bug Fixes

- add router.refresh() to cart ([a5bb6d7](https://github.com/yournextstore/yournextstore/commit/a5bb6d7a4702a3e8c3b9b41733d82d285b300b25))
- minor bugs in country selection ([c4c3eae](https://github.com/yournextstore/yournextstore/commit/c4c3eaefc315ace3878fd066d9d4c1cdffe16c3e))
- move stripe warning to bottom in DOM ([f995f44](https://github.com/yournextstore/yournextstore/commit/f995f44df214beca803f999b30a7ee34873fd22b))
- safari bugs ([6654ddb](https://github.com/yournextstore/yournextstore/commit/6654ddb88667bb92221ebd325790f335a41b7bf3))
- tweaks to the order details page ([bda17f1](https://github.com/yournextstore/yournextstore/commit/bda17f1d4aaf68451e1f83f0d9f3487e4418f4c9))

### Features

- add loading inidicator to cart summary table ([ffa49f3](https://github.com/yournextstore/yournextstore/commit/ffa49f38c779e321f6288104be9ce9ba6f2eaadb))
- add metadata ([3421f65](https://github.com/yournextstore/yournextstore/commit/3421f653ddf54d72936924fe4a23b8b3588b053c))
- add shipping and billing addresses to order details ([764e415](https://github.com/yournextstore/yournextstore/commit/764e415704cbd6b9c9f42eb0d64ac4fda9c46446))
- enable PPR ([00458ae](https://github.com/yournextstore/yournextstore/commit/00458aea958df9301d4c98156c4bc51e1b47181b))
- fix orders table ([ffac0c3](https://github.com/yournextstore/yournextstore/commit/ffac0c3c36e09d2ae34842348eba3d3de3a2e516))
- link products in cart to product page ([74592aa](https://github.com/yournextstore/yournextstore/commit/74592aa33e0d142222e7ba36d38b78ac3be1f171))
- order summary details part 1 ([0e23fa4](https://github.com/yournextstore/yournextstore/commit/0e23fa4d093ce28c45741008a5b22576402dbef3))
- use optimistic updates for cart quantity modifications ([738b1de](https://github.com/yournextstore/yournextstore/commit/738b1dec42f5aa8dcdb888af34ac1aa7ef0e0f18))

# [1.2.0](https://github.com/yournextstore/yournextstore/compare/v1.1.0...v1.2.0) (2024-04-05)

### Bug Fixes

- nav and cart ([7442e84](https://github.com/yournextstore/yournextstore/commit/7442e844e239e758ececdffb99900bf9da346817))
- wrap nav link with `<li>` ([b8ebe52](https://github.com/yournextstore/yournextstore/commit/b8ebe52be6402b3d4a4a5c7d57748497de13ecf5))

### Features

- add billing and shipping address forms ([c298356](https://github.com/yournextstore/yournextstore/commit/c2983561fd3194bddc701e1f14213f5f7f411e86))
- add cart preview in overlay ([9a946dc](https://github.com/yournextstore/yournextstore/commit/9a946dc798fd6a02b08349bb1d92982023a5e09a))
- add cart summary table ([9009adc](https://github.com/yournextstore/yournextstore/commit/9009adca5ff5b3d3b335f207565742c2aa67a634))
- add feedback when adding products to cart ([eade3f1](https://github.com/yournextstore/yournextstore/commit/eade3f149f811725da0b7fbc6361325d59018420))
- add shadcn/ui Alerty for errors messages ([9149a8c](https://github.com/yournextstore/yournextstore/commit/9149a8cc64c01b5b00bd68a35a8a4e3bbd7c01a4))
- add single view page ([4c8a074](https://github.com/yournextstore/yournextstore/commit/4c8a074be7f3098f039a1f270895566ee5a9e5aa))
- add the `/admin` page ([c1ab925](https://github.com/yournextstore/yournextstore/commit/c1ab925fb992602ac96eff9277b6fe8996467b09))
- billing address form ([bb6aff8](https://github.com/yournextstore/yournextstore/commit/bb6aff8613f0cd28a2ab05d28c37e01ec2f9cecd))
- checkout form ([65500da](https://github.com/yournextstore/yournextstore/commit/65500da6837ba0f974f5b211148360c7d6fa349e))
- display products in `/admin` ([8da8948](https://github.com/yournextstore/yournextstore/commit/8da8948be1c154c39da3f54dd5afd7e3f1d21094))
- payments wip ([12a73e9](https://github.com/yournextstore/yournextstore/commit/12a73e93d611f4ae8413703dab1cd8806f372044))
- reorganise the layout for main & `/admin` ([c6a7bea](https://github.com/yournextstore/yournextstore/commit/c6a7bea042790a97fd5fb37c2044bb1cc00846a9))
- save billing information in metadata ([8c3d470](https://github.com/yournextstore/yournextstore/commit/8c3d4704aa168469dafcfd0b12f1ab803ff56e86))
- stripe checkout ([8ed1671](https://github.com/yournextstore/yournextstore/commit/8ed1671d0159dd0fbe3b98582f147be2f245c95e))

# [1.1.0](https://github.com/yournextstore/yournextstore/compare/v1.0.0...v1.1.0) (2024-04-01)

### Features

- add cart tooltip ([8db7f19](https://github.com/yournextstore/yournextstore/commit/8db7f19f7eebf3994ff480307921b3ea3ef6d8c1))

# 1.0.0 (2024-03-30)

### Bug Fixes

- fix build ([49e9821](https://github.com/yournextstore/yournextstore/commit/49e982187aca5333c840144d48936b770b4bbc29))

### Features

- add basic single product page ([a9ece38](https://github.com/yournextstore/yournextstore/commit/a9ece38686551a7598858f9780381c6bd8fea77d))
- add cache management to products and cart ([4a2fc01](https://github.com/yournextstore/yournextstore/commit/4a2fc019ac23e07fa3a3ee17f83a6fda7194a4f0))
- add commitlint ([9a98ce9](https://github.com/yournextstore/yournextstore/commit/9a98ce90a31d5c634c3b73e3ce72a9b976690469))
- add currency formatting ([a9bb714](https://github.com/yournextstore/yournextstore/commit/a9bb714b42305724358ebb74356ac040d71a7076))
- add favicons ([7feb07b](https://github.com/yournextstore/yournextstore/commit/7feb07bd6ce46823cc879bac16eb746b8fd57c58))
- add markdown support to features and description ([d9723b1](https://github.com/yournextstore/yournextstore/commit/d9723b163120b9a68396fef57812c88794377b06))
- add nav ([c18fa9b](https://github.com/yournextstore/yournextstore/commit/c18fa9b570718283194a3d2b161c2001f02d90e7))
- add not-found page ([13ef093](https://github.com/yournextstore/yournextstore/commit/13ef0930a67929a9c8a3d7690edd8606721a48a4))
- add shadcn/ui and home page ([e5a1e93](https://github.com/yournextstore/yournextstore/commit/e5a1e938df62f191acff38c7d9c06ff46fad4bdc))
- add Stripe mode indicator bar ([86b5a14](https://github.com/yournextstore/yournextstore/commit/86b5a144baa3bb3052fe39a5897f360c18c3b347))
- add Stripe products images ([7da8d75](https://github.com/yournextstore/yournextstore/commit/7da8d755c28c00a12cbffd39548a2cd29dcf2660))
- implement cart based on Stripe Payment Intents ([2bd047e](https://github.com/yournextstore/yournextstore/commit/2bd047e45c5a40b27b1eb2df35300e63daa67cba))
- implement JSON LD ([c08b4e6](https://github.com/yournextstore/yournextstore/commit/c08b4e651450e27b49866475e7ce5d2339ce1e89))
- list product features ([3ba7a3e](https://github.com/yournextstore/yournextstore/commit/3ba7a3ed7c54609b5e1780167aef52ad67694137))
- make currency configurable ([368fa59](https://github.com/yournextstore/yournextstore/commit/368fa5939c2472901b024ddf7dccd469be792cf5))
- parse env variables ([e07942e](https://github.com/yournextstore/yournextstore/commit/e07942e670339fcfa58e8777d48f2b2022bde77c))
- recalculate cart total on change ([6367ecf](https://github.com/yournextstore/yournextstore/commit/6367ecff7008ab2c4393389c64225af149176b87))
