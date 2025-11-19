// Live test data for Experiment Monitoring tab
// Use this data to replace your LIVE_TESTS constant or filter TEST_DATA by stage === "Live"

export const LIVE_TESTS = [
  {
    id: 18,
    name: "Evaluating Galaxy S24 promotional banner effectiveness during Black Friday period",
    startDate: "11/15/25",
    endDate: "12/6/25",
    stage: "Live",
    platform: "Samsung.com",
    category: "BAU",
    lob: "Galaxy Phone",
    country: "United States, Canada, United Kingdom",
    pageType: "Homepage, Product Page",
    pageSection: "Promotional Banner, Discount Badge",
    pageElement: "Banner CTA, Countdown Timer, Shop Deals Button",
    product: "Galaxy S24, Galaxy S24+, Galaxy S24 Ultra",
    hypothesis: "Featuring time-limited Black Friday promotional banners with countdown timers and discount badges should create urgency and accelerate purchase decisions. We expect increased CTR on promotional elements and higher conversion rates during the promotional window."
  },
  {
    id: 19,
    name: "Testing Galaxy Buds bundle offer presentation on checkout flow",
    startDate: "11/18/25",
    endDate: "12/9/25",
    stage: "Live",
    platform: "Samsung.com",
    category: "BAU",
    lob: "Galaxy Buds",
    country: "Germany, France, Italy, Spain",
    pageType: "Checkout Flow",
    pageSection: "Bundle Recommendation Module",
    pageElement: "Add Bundle CTA, Remove Item Link, Bundle Savings Badge",
    product: "Galaxy Buds 3, Galaxy Buds 3 Pro",
    hypothesis: "Introducing bundle offers (Galaxy Buds with Galaxy Phone purchase) at the checkout stage should increase average order value. By presenting relevant accessories with dynamic pricing, we anticipate improved attachment rates and revenue per transaction."
  },
  {
    id: 20,
    name: "Analyzing mobile navigation menu structure optimization for Samsung.com",
    startDate: "11/12/25",
    endDate: "12/3/25",
    stage: "Live",
    platform: "Samsung.com",
    category: "Rome",
    lob: "Multi-Product",
    country: "Global",
    pageType: "Mobile Navigation",
    pageSection: "Hamburger Menu, Quick Access Icons",
    pageElement: "Menu Toggle Icon, Category Links, Search Bar",
    product: "All Products",
    hypothesis: "Restructuring mobile navigation to prioritize popular product categories and reduce menu depth should decrease bounce rates and improve mobile user experience. We expect faster product discovery and increased mobile conversion rates."
  },
  {
    id: 21,
    name: "Measuring Galaxy ecosystem benefits messaging on cross-sell pages",
    startDate: "11/10/25",
    endDate: "12/1/25",
    stage: "Live",
    platform: "Samsung.com",
    category: "BAU",
    lob: "Multi-Product",
    country: "United States, United Kingdom",
    pageType: "Cross-sell Page",
    pageSection: "Ecosystem Benefits Section, Product Pairing Examples",
    pageElement: "Explore Ecosystem CTA, Add to Cart Button, Bundle Builder Link",
    product: "Galaxy Phone, Galaxy Watch, Galaxy Buds, Galaxy Tab",
    hypothesis: "Highlighting ecosystem integration benefits (seamless device connectivity, shared features) on cross-sell pages should increase multi-product purchase intent. We hypothesize this will improve cross-category conversion rates and increase customer lifetime value."
  }
];
