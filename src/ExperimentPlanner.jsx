import React, { useMemo, useState } from "react";
import { Calculator, Users, TrendingUp, Info, CheckCircle2, XCircle, AlertTriangle, Calendar, Settings, BarChart3, BookOpen, FlaskConical, Target, LineChart, Grid3x3, Download, Search, Filter, Eye, Clock, Play, Pause, CheckSquare, Upload, Trash2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
// import ResultsAnalysisTab from './ResultsAnalysisTab';
// import ResultsAnalysisTab from './ResultsAnalysisTab_Improved';
import ResultsAnalysisComplete from './ResultsAnalysisComplete';
import ExperimentMonitoring from './ExperimentMonitoring';

// ===== TEST DATA =====
const INITIAL_TEST_DATA = [
  {
    "Test Launch Date": "2025-04-14",
    "Test End Date": "2025-04-21",
    "Test Stage": "Completed",
    "Summary": "Evaluating homepage content hierarchy modifications for April launch (P1)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone, Galaxy Book, Galaxy Tab",
    "Country or Countries": "France",
    "Page Type(s)": "Homepage",
    "Page Section(s)": "Hero Banner 2, Hero Banner 3, Promo Tile 1, Promo Tile 2",
    "Page Element(s)": "Promo Tile CTA, Hero Banner Image Link",
    "Product": "Galaxy Book Pro, Galaxy Book Air, Galaxy S18 Pro, Galaxy S18 Pro Max",
    "Hypothesis": "Moving Galaxy phones upward from hero sections to promotional tiles is expected to drive increased phone engagement while potentially reducing clicks on Galaxy Book and Tab products. Prioritizing Galaxy devices should encourage visitors to interact more with S18 series offerings. We anticipate this approach will generate higher relative downstream traffic and could yield approximately 35.1% improvement in add-to-bag activity.",
    "Optimization Result": "The increase in Galaxy Book progression rates occurred exclusively through promotional tiles. While Galaxy Book showed a 22.5% improvement, this was counterbalanced by Galaxy phone's -13% performance in the purchase funnel. Overall, the test registered a FLAT result at -5% versus control. Galaxy phone conversion showed slight negative movement compared to baseline, while Galaxy Tab flow demonstrated a +13% uptick. Based on these mixed signals, we're discontinuing Galaxy phone prioritization on homepage for conversion optimization."
  },
  {
    "Test Launch Date": "2025-01-21",
    "Test End Date": "2025-02-18",
    "Test Stage": "Completed",
    "Summary": "Measuring Welcome FP video removal effects on conversion metrics (Rome)",
    "Platform": "Samsung.com",
    "Category": "Rome",
    "LOB(s)": "Galaxy Phone, Galaxy Watch",
    "Country or Countries": "United States",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Welcome Moment, Consider Moment, Select Moment",
    "Page Element(s)": "Video Player, Skip Video CTA, Continue CTA",
    "Product": "Galaxy S18 Pro, Galaxy S14, Galaxy SE, Galaxy S14, Galaxy S15, Watch Ultra 2",
    "Hypothesis": "Removing the Welcome video is projected to accelerate user pathways to key information by reducing scroll depth requirements. This streamlined approach should enable faster access to product details while potentially simplifying the Galaxy Watch conversion journey through more direct navigation.",
    "Optimization Result": "The Welcome Video removal produced mixed results across product lines. For Galaxy phones, friction decreased notably with a 9% increase in Add-to-Bag rate and 4% growth in Flow rate. However, Galaxy Watch showed contrasting behavior with a -0.6% change in Phone Add to Buy rate after video removal. Testing Variation 4 (Welcome Cards removal) negatively impacted progression metrics for both Galaxy phones and Galaxy Watch across all measured dimensions, ultimately suggesting this approach reduced conversion effectiveness."
  },
  {
    "Test Launch Date": "2025-03-10",
    "Test End Date": "2025-04-07",
    "Test Stage": "Completed",
    "Summary": "Analyzing Welcome video elimination's effect on Family Page engagement (CN)",
    "Platform": "Samsung.com",
    "Category": "Rome",
    "LOB(s)": "Galaxy Phone, Galaxy Watch",
    "Country or Countries": "China",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Welcome Moment, Consider Moment, Select Moment",
    "Page Element(s)": "Welcome Video Player, Auto-play Toggle, Skip Button",
    "Product": "Galaxy S18 Pro, Galaxy S18 Pro, Galaxy SE 10, Watch Ultra",
    "Hypothesis": "Video removal from the Welcome experience aims to create more efficient information pathways, potentially increasing CTR and scroll engagement by streamlining the user journey.",
    "Optimization Result": "Results demonstrated varied performance patterns. Variation 3 (video removal) revealed that the Welcome Video actually reduced customer friction overall, generating a 6% improvement in Galaxy phone Add-to-Buy rate and 3% increase in Watch purchase progression. Variation 4 testing (Watch Ultra 2 prominence) significantly enhanced homepage engagement and product visibility, even among non-buyers. This positioning strategy elevated the entire product portfolio's perceived value. Specific Variation 4 metrics: +13.4% increase in Watch Family Page Visits, +14.2% growth in Any Watch Product Visits, +22.7% improvement in Watch See 1 Buy Flow Page, +13.8% boost in Any Watch See 1 Buy Flow Visits, +24.3% rise in Watch 1 Bag Adds."
  },
  {
    "Test Launch Date": "2025-03-25",
    "Test End Date": "2025-04-14",
    "Test Stage": "Completed",
    "Summary": "Testing Homepage and Watch Family hero banner product positioning strategy",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Watch",
    "Country or Countries": "Canada, Mexico, United States",
    "Page Type(s)": "Homepage",
    "Page Section(s)": "Hero Banner 3",
    "Page Element(s)": "Learn More CTA, Product Browser Navigation",
    "Product": "Watch Series 10, Watch Ultra 2, Galaxy Watch",
    "Hypothesis": "By featuring a Galaxy Watch Family product browser within Homepage hero sections rather than separate product banners, we expect improved Watch LOR engagement and conversion rates. This consolidated approach should maximize hero banner real estate while showcasing the complete Watch portfolio more effectively.",
    "Optimization Result": "Emphasizing Watch Ultra 2 (Variation 4) delivered substantial Card Engagement improvements: +19.4% increase in Watch Family Page Visits, +14.2% growth in Any Watch Product Visits, +14.8% rise in Watch 1 Buy Flow Visits, +13.8% improvement in Any Watch See 1 Buy Flow Visits, +24.3% surge in Watch 1 Bag Adds. When testing DM campaign timing for Valentine's Day Launch and Last Chance messaging, early morning send times underperformed expectations. CTR and Conversion declined during early hours due to reduced customer purchase activity. However, when promoting the Galaxy S16a to price-conscious upgraders through DM, we observed increased conversion rates. This validated our hypothesis regarding pricing sensitivity among the upgrade segment."
  },
  {
    "Test Launch Date": "2025-01-30",
    "Test End Date": "2025-02-07",
    "Test Stage": "Completed",
    "Summary": "Examining DM campaign timing optimization for Valentine's Day (UK, DE)",
    "Platform": "DM",
    "Category": "BAU",
    "LOB(s)": "Multi-OR",
    "Country or Countries": "United Kingdom, Germany",
    "Page Type(s)": "DM",
    "Page Section(s)": "Email Body",
    "Page Element(s)": "Primary CTA Button, Shop Now Link",
    "Product": "Galaxy Phone, Galaxy Watch, Galaxy Buds",
    "Hypothesis": "Testing alternative send time strategies for Valentine's Day Launch and Last Chance Mile campaigns to determine optimal customer engagement windows. We hypothesize that adjusting from early morning sends will improve DM CTR and Conversion during peak purchase activity periods.",
    "Optimization Result": "Results validated timing matters significantly. Testing across multiple time zones revealed 10:00 AM UK (EST equivalent) generated optimal CTR and Conversion performance. These findings reinforce the value of strategic send time optimization, particularly avoiding early morning dispatches when customer purchase intent is lower."
  },
  {
    "Test Launch Date": "2025-04-14",
    "Test End Date": "2025-04-24",
    "Test Stage": "Completed",
    "Summary": "Optimizing Galaxy phone upgrader messaging in DM campaigns (FR, IT, ES)",
    "Platform": "DM",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone",
    "Country or Countries": "France, Italy, Spain",
    "Page Type(s)": "DM",
    "Page Section(s)": "Email Body, Product Card",
    "Page Element(s)": "Upgrade Now CTA, View Offers Link",
    "Product": "Galaxy S16a",
    "Hypothesis": "Featuring the Galaxy S16a model prominently in DM campaigns targeting price-sensitive upgrade customers should drive higher conversion and CTR. By emphasizing the more affordable option, we expect to resonate better with cost-conscious upgraders.",
    "Optimization Result": "Galaxy phone campaigns in France, Italy, and Spain showed improved results when highlighting the Galaxy S16a. The more accessible price point resonated particularly well with price-sensitive upgrade audiences, confirming our hypothesis about value-driven decision-making in this customer segment."
  },
  {
    "Test Launch Date": "2025-02-28",
    "Test End Date": "2025-03-10",
    "Test Stage": "Completed",
    "Summary": "Evaluating Galaxy S16e financing ribbon messaging impact in DM (Partnering Ribbon EU)",
    "Platform": "DM",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone",
    "Country or Countries": "France, Germany",
    "Page Type(s)": "DM",
    "Page Section(s)": "Email Header",
    "Page Element(s)": "Financing Ribbon Banner, Learn More CTA",
    "Product": "Galaxy S16a",
    "Hypothesis": "Implementing a 50% financing ribbon presentation (both with and without promotional discount) aims to enhance DM CTR and Conversion from households responsive to affordability messaging, ultimately improving Galaxy S16a purchase funnel entry.",
    "Optimization Result": "The EU 50% financing ribbon effectively communicated affordability regardless of CTA variation. Both messaging approaches successfully positioned the Galaxy S16a as more financially accessible, resulting in positive improvements in messaging effectiveness and customer engagement."
  },
  {
    "Test Launch Date": "2025-01-30",
    "Test End Date": "2025-04-01",
    "Test Stage": "Completed",
    "Summary": "Analyzing Galaxy for Students campaign page elements (FAQ and Comparison sections)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Book",
    "Country or Countries": "Japan",
    "Page Type(s)": "Galaxy For Student Landing Page",
    "Page Section(s)": "FAQ Section, Compare Section",
    "Page Element(s)": "FAQ Expand/Collapse Toggle, Compare Product CTA",
    "Product": "Galaxy Book Air 13\" and 15\", Galaxy Book Pro and 16\", Desktop options, Mini models, Studio models, Pro Display A2R",
    "Hypothesis": "By elevating the Education Store page prominence and enhancing critical capabilities on the Galaxy for Students landing page, we aim to create a more effective entry pathway to the edu store experience.",
    "Optimization Result": "The variation resulted in decreased click-through rates from the Galaxy for Students Page to the JP Education Store. Removing certain page elements also reduced overall engagement metrics in the JP Education Store, including standalone page interaction measures."
  },
  {
    "Test Launch Date": "2025-01-07",
    "Test End Date": "2025-01-20",
    "Test Stage": "Completed",
    "Summary": "Testing Homepage dynamic content strategy with Hero Banner and Promo Tile variations (P2)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone, Galaxy Book, Galaxy Tab",
    "Country or Countries": "India, Japan",
    "Page Type(s)": "Homepage",
    "Page Section(s)": "Hero Banner 1, Hero Banner 2, Hero Banner 3, Promo Tile 1, Promo Tile 2",
    "Page Element(s)": "Hero Banner Image Link, Promo Tile CTA, Learn More Button",
    "Product": "Galaxy S18, Galaxy Book 4, Galaxy Tab S9",
    "Hypothesis": "Examining how Hero Banner placement variations influence traffic patterns and conversion metrics across Galaxy Phone, Galaxy Book, and Galaxy Tab product lines.",
    "Optimization Result": "Homepage placement testing revealed mixed outcomes. Optimal content positioning doesn't always guarantee ideal conversion results. Specifically, neither generation number inclusion nor Pro model prioritization proved beneficial. Adding Generation Numbers produced a 2.1% decline in Galaxy Book product pageviews and 0.31% decrease in Buy Flow visitation. Leading with Pro Models caused a 1.4% reduction in Chapter flow CTR with no meaningful Buy Flow impact. Combining both approaches (Generation Numbers + Pro Model Priority) resulted in a 2.3% decline in Product Page visitation and 0.5% drop in Buy Flow Visits. These findings suggest neither strategy effectively improves customer engagement."
  },
  {
    "Test Launch Date": "2025-01-21",
    "Test End Date": "2025-03-03",
    "Test Stage": "Completed",
    "Summary": "Examining dynamic Galaxy Buds content ordering strategy (FP Ordering P1/02A/02+1/)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Buds",
    "Country or Countries": "France, Germany, United Arab Emirates, United Kingdom, Thailand",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Product Browse, Chapter Nav",
    "Page Element(s)": "Product Card CTA, Chapter Navigation Link, Learn More Button",
    "Product": "Galaxy Buds 4, Galaxy Buds Pro",
    "Hypothesis": "Testing product ordering within Global Nav to determine if prioritizing Galaxy Buds 4 and Galaxy Buds Pro in different sequences affects Family Page CTR and add-to-bag rates.",
    "Optimization Result": "Pro Model prioritization testing showed a 1.4% decline in Chapter flow CTR and 2.9% reduction in Buy Flow visitation, with negligible Buy Flow impact. Digital Mail campaigns featuring N- Model Priority demonstrated poor performance: -1.1% in Galaxy Phone N- Buy Flow Visitation Rate, -2.2% in Buy Flow CTR, -0.1% in add-to-bag rates, -0.1% decline in Buy Flow Visits, +3.5% increase in Add-to-Bag Rates. Generation Number incorporation led to 2.1% Galaxy Book decline and 0.31% Buy Flow visitation decrease. Overall, neither generation numbers nor Pro model leading strategies delivered beneficial results."
  },
  {
    "Test Launch Date": "2025-01-21",
    "Test End Date": "2025-03-03",
    "Test Stage": "Completed",
    "Summary": "Testing Galaxy Buds product ordering approach (FP Chapter Nav Product Ordering 02L/04/L/05)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Buds",
    "Country or Countries": "France, United Arab Emirates, United Kingdom",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Product Browse, Chapter Nav",
    "Page Element(s)": "Navigation Tab, Product Tile Click Area, Buy Now CTA",
    "Product": "Galaxy Buds 4, Galaxy Buds Pro",
    "Hypothesis": "Evaluating whether alternative product ordering sequences within Family Page Chapter Navigation impacts customer engagement and purchase funnel entry for Galaxy Buds products.",
    "Optimization Result": "Pro Model emphasis produced a 1.4% Chapter flow CTR decline, 2.9% Product Pagevisitation reduction, and 0.5% Buy Flow Visits decrease. Digital Mail N- Model positioning underperformed across metrics: -1.1% Galaxy Phone N- Buy Flow Visitation Rate, -2.2% Buy Flow CTR, -0.1% Buy Flow Visits decline, +3.5% Add-to-Bag Rates increase. Generation Number implementation caused 2.1% Galaxy Book decline and 0.31% Buy Flow visitation drop. Evidence consistently shows neither generation numbers nor Pro model prioritization strategies yield positive outcomes."
  },
  {
    "Test Launch Date": "2025-01-24",
    "Test End Date": "2025-03-07",
    "Test Stage": "Completed",
    "Summary": "Analyzing Galaxy Phone FP Select Moment content strategy (Select Moment: Galaxy N- Models - Liam Video + CTA Suppression 07K-P7L-OS)",
    "Platform": "Samsung.com",
    "Category": "Rome",
    "LOB(s)": "Galaxy Phone",
    "Country or Countries": "France, Germany, United Kingdom",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Select Moment",
    "Page Element(s)": "Product Image Link, Learn More CTA, Video Thumbnail",
    "Product": "Galaxy S15",
    "Hypothesis": "In Family Page Select Moment testing, we're evaluating whether directing customers to Type3 'Select Moment' experiences helps users identify optimal linking approaches. Focus is on measuring Galaxy N- Buy Flow Visitation Rate and CTA effectiveness.",
    "Optimization Result": "Testing on Samsung.com Homepage navigation to Galaxy Book Pro Product Page showed that Upgrade-Focused routing (versus FAQ section routing) resulted in lower engagement metrics. Upgrade messaging produced reduced performance compared to control: -2.9% in Buy Flow progression, -3.1% in Add-to-Bag rate, -2.2% in Buy Flow rate. Trade-In Page Visitation showed unusual behavior. These results contradict initial expectations about upgrade messaging effectiveness."
  },
  {
    "Test Launch Date": "2025-02-04",
    "Test End Date": "2025-03-05",
    "Test Stage": "Completed",
    "Summary": "Testing Galaxy Book Pro PP upgrade-focused messaging variations (Upgrade Page Customization 04)",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Book",
    "Country or Countries": "United States",
    "Page Type(s)": "Product Page",
    "Page Section(s)": "Headline of 'Hero' Section: Why Upgrade",
    "Page Element(s)": "Trade-In Calculator Widget, Upgrade Now CTA, Compare Models Link",
    "Product": "Galaxy Book Pro",
    "Hypothesis": "For users navigating Samsung.com Homepage to Galaxy Book Pro Product Page, routing through Upgrade-Focused version (versus FAQ section path) should improve engagement through targeted messaging that addresses upgrade considerations. We expect this customization will increase engagement metrics and Buy Flow progression.",
    "Optimization Result": "Counter to expectations, Upgrade-Focused messaging underperformed the control group. Upgrade messaging generated lower engagement across key metrics: Trade-In Page Visitation rate showed unusual spike at +235%, while Buy Flow progression declined -2.9%, Add-to-Bag rate dropped -3.1%, and Buy Flow rate decreased -2.2%. These results suggest upgrade-specific messaging may not be the optimal approach for this customer segment."
  },
  {
    "Test Launch Date": "2025-11-25",
    "Test End Date": null,
    "Test Stage": "Intake",
    "Summary": "Exploring Galaxy Z Fold homepage hero placement strategy for holiday season",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Z Fold",
    "Country or Countries": "United States, Canada",
    "Page Type(s)": "Homepage",
    "Page Section(s)": "Hero Banner 1, Promo Tile 3",
    "Page Element(s)": "Hero Image Link, Shop Now CTA, Learn More Button",
    "Product": "Galaxy Z Fold 6, Galaxy Z Flip 6",
    "Hypothesis": "Positioning foldable devices prominently during the holiday shopping period may drive increased awareness and consideration among premium smartphone shoppers. We anticipate this visibility boost could improve engagement metrics and add-to-cart rates for the foldable product line.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-20",
    "Test End Date": null,
    "Test Stage": "Intake",
    "Summary": "Investigating Galaxy Tab product comparison tool effectiveness on Family Page",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Tab",
    "Country or Countries": "United Kingdom, Germany, France",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Compare Section, Product Selector",
    "Page Element(s)": "Compare Toggle Button, Specification Table, Add to Compare CTA",
    "Product": "Galaxy Tab S9, Galaxy Tab S9+, Galaxy Tab S9 Ultra",
    "Hypothesis": "Adding an interactive comparison tool allowing customers to view specifications side-by-side should reduce decision friction and accelerate the purchase journey. We expect this will improve conversion rates for customers evaluating multiple Tab models.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-12-05",
    "Test End Date": "2025-12-26",
    "Test Stage": "Proposal",
    "Summary": "Testing Galaxy Watch trade-in messaging prominence on Product Detail Page",
    "Platform": "Samsung.com",
    "Category": "Rome",
    "LOB(s)": "Galaxy Watch",
    "Country or Countries": "United States",
    "Page Type(s)": "Product Page",
    "Page Section(s)": "Trade-in Calculator Widget, CTA Section",
    "Page Element(s)": "Trade-In Value Display, Get Estimate CTA, Apply Trade-In Button",
    "Product": "Galaxy Watch 7, Galaxy Watch 7 Pro",
    "Hypothesis": "Elevating trade-in value messaging earlier in the product page experience (above the fold versus current mid-page placement) should increase trade-in program awareness. We hypothesize this will drive higher trade-in participation rates and overall conversion by reducing perceived purchase cost.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-28",
    "Test End Date": "2025-12-19",
    "Test Stage": "Dev",
    "Summary": "Analyzing Galaxy Book personalized recommendation engine on landing pages",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Book",
    "Country or Countries": "Japan, South Korea",
    "Page Type(s)": "Landing Page",
    "Page Section(s)": "Personalized Product Recommendations Module",
    "Page Element(s)": "Recommended for You Section, Product Card CTA, View Details Link",
    "Product": "Galaxy Book 4, Galaxy Book 4 Pro, Galaxy Book 4 Ultra",
    "Hypothesis": "Implementing AI-driven product recommendations based on browsing behavior and device preferences should improve product discovery relevance. This personalized approach is expected to increase engagement with recommended products and boost overall Galaxy Book conversion rates.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-15",
    "Test End Date": "2025-12-06",
    "Test Stage": "Live",
    "Summary": "Evaluating Galaxy S24 promotional banner effectiveness during Black Friday period",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone",
    "Country or Countries": "United States, Canada, United Kingdom",
    "Page Type(s)": "Homepage, Product Page",
    "Page Section(s)": "Promotional Banner, Discount Badge",
    "Page Element(s)": "Banner CTA, Countdown Timer, Shop Deals Button",
    "Product": "Galaxy S24, Galaxy S24+, Galaxy S24 Ultra",
    "Hypothesis": "Featuring time-limited Black Friday promotional banners with countdown timers and discount badges should create urgency and accelerate purchase decisions. We expect increased CTR on promotional elements and higher conversion rates during the promotional window.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-18",
    "Test End Date": "2025-12-09",
    "Test Stage": "Live",
    "Summary": "Testing Galaxy Buds bundle offer presentation on checkout flow",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Buds",
    "Country or Countries": "Germany, France, Italy, Spain",
    "Page Type(s)": "Checkout Flow",
    "Page Section(s)": "Bundle Recommendation Module",
    "Page Element(s)": "Add Bundle CTA, Remove Item Link, Bundle Savings Badge",
    "Product": "Galaxy Buds 3, Galaxy Buds 3 Pro",
    "Hypothesis": "Introducing bundle offers (Galaxy Buds with Galaxy Phone purchase) at the checkout stage should increase average order value. By presenting relevant accessories with dynamic pricing, we anticipate improved attachment rates and revenue per transaction.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-12",
    "Test End Date": "2025-12-03",
    "Test Stage": "Live",
    "Summary": "Analyzing mobile navigation menu structure optimization for Samsung.com",
    "Platform": "Samsung.com",
    "Category": "Rome",
    "LOB(s)": "Multi-Product",
    "Country or Countries": "Global",
    "Page Type(s)": "Mobile Navigation",
    "Page Section(s)": "Hamburger Menu, Quick Access Icons",
    "Page Element(s)": "Menu Toggle Icon, Category Links, Search Bar",
    "Product": "All Products",
    "Hypothesis": "Restructuring mobile navigation to prioritize popular product categories and reduce menu depth should decrease bounce rates and improve mobile user experience. We expect faster product discovery and increased mobile conversion rates.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-11-10",
    "Test End Date": "2025-12-01",
    "Test Stage": "Live",
    "Summary": "Measuring Galaxy ecosystem benefits messaging on cross-sell pages",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Multi-Product",
    "Country or Countries": "United States, United Kingdom",
    "Page Type(s)": "Cross-sell Page",
    "Page Section(s)": "Ecosystem Benefits Section, Product Pairing Examples",
    "Page Element(s)": "Explore Ecosystem CTA, Add to Cart Button, Bundle Builder Link",
    "Product": "Galaxy Phone, Galaxy Watch, Galaxy Buds, Galaxy Tab",
    "Hypothesis": "Highlighting ecosystem integration benefits (seamless device connectivity, shared features) on cross-sell pages should increase multi-product purchase intent. We hypothesize this will improve cross-category conversion rates and increase customer lifetime value.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-10-28",
    "Test End Date": "2025-11-18",
    "Test Stage": "Result Analysis",
    "Summary": "Examining Galaxy S24 financing options display hierarchy on Product Page",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Phone",
    "Country or Countries": "United States",
    "Page Type(s)": "Product Page",
    "Page Section(s)": "Financing Options Section, Payment Calculator",
    "Page Element(s)": "Calculate Payment CTA, Monthly Payment Display, Apply Now Button",
    "Product": "Galaxy S24, Galaxy S24+, Galaxy S24 Ultra",
    "Hypothesis": "Repositioning financing options higher on the product page (near price display versus current lower placement) should increase financing option awareness among price-sensitive customers. We expect this will improve financing program adoption rates and overall conversion by making premium devices more accessible.",
    "Optimization Result": null
  },
  {
    "Test Launch Date": "2025-10-15",
    "Test End Date": "2025-11-05",
    "Test Stage": "Result Implementation",
    "Summary": "Implementing optimized Galaxy Tab educational content layout on Family Page",
    "Platform": "Samsung.com",
    "Category": "BAU",
    "LOB(s)": "Galaxy Tab",
    "Country or Countries": "United States, Canada, Australia",
    "Page Type(s)": "Family Page",
    "Page Section(s)": "Use Case Section, Feature Highlights",
    "Page Element(s)": "Explore Use Cases Link, Feature Demo Video, Compare Models CTA",
    "Product": "Galaxy Tab S9, Galaxy Tab S9 FE",
    "Hypothesis": "Restructuring educational content to feature use-case-driven narratives (productivity, creativity, entertainment) rather than technical specifications should better resonate with customer needs. Testing showed this approach improved engagement and conversion, now being implemented globally.",
    "Optimization Result": null
  }
];


// ===== Helpers: Normal CDF inverse (Acklam approximation) =====
function normSInv(p) {
  const _p = Math.min(Math.max(p, 1e-12), 1 - 1e-12);
  const a = [
    -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
    1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00,
  ];
  const b = [
    -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
    6.680131188771972e+01, -1.328068155288572e+01,
  ];
  const c = [
    -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
    -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00,
  ];
  const d = [
    7.784695709041462e-03, 3.224671290700398e-01,
    2.445134137142996e+00, 3.754408661907416e+00,
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q, r;

  if (_p < plow) {
    q = Math.sqrt(-2 * Math.log(_p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (phigh < _p) {
    q = Math.sqrt(-2 * Math.log(1 - _p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  q = _p - 0.5;
  r = q * q;
  return (
    (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

function zFromAlpha(alpha, tails) {
  return tails === 2 ? normSInv(1 - alpha / 2) : normSInv(1 - alpha);
}

function ceilPositive(x) {
  return Math.max(0, Math.ceil(x));
}

function normCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

// ===== Core math =====
function nProportions({ pA, pB, alpha, power, tails, ratio }) {
  const delta = Math.abs(pB - pA);
  if (delta <= 0) return { nA: 0, nB: 0, total: 0 };
  const zAlpha = zFromAlpha(alpha, tails);
  const zBeta = normSInv(power);
  const qA = 1 - pA;
  const qB = 1 - pB;
  const r = ratio;

  const termAlpha = zAlpha * Math.sqrt(pA * qA * (1 + 1 / r));
  const termBeta = zBeta * Math.sqrt(pA * qA + (pB * qB) / r);
  const nA = ((termAlpha + termBeta) ** 2) / (delta ** 2);
  const nB = r * nA;
  return { nA, nB, total: nA + nB };
}

function nMeans({ sdA, sdB, delta, alpha, power, tails, ratio }) {
  const zAlpha = zFromAlpha(alpha, tails);
  const zBeta = normSInv(power);
  const r = ratio;
  const nA = ((zAlpha + zBeta) ** 2) * (sdA ** 2 + (sdB ** 2) / r) / (delta ** 2);
  const nB = r * nA;
  return { nA, nB, total: nA + nB };
}

function NumberInput({ label, value, onChange, step = 0.01, min, max, suffix, helpText, isPercentage = false }) {
  const displayValue = isPercentage ? (value * 100) : value;
  const displayStep = isPercentage ? (step * 100) : step;
  const displayMin = isPercentage && min !== undefined ? (min * 100) : min;
  const displayMax = isPercentage && max !== undefined ? (max * 100) : max;
  
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
          value={Number.isFinite(displayValue) ? (isPercentage ? displayValue.toFixed(1) : displayValue) : 0}
          step={displayStep}
          min={displayMin}
          max={displayMax}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            const actualValue = isPercentage ? v / 100 : v;
            onChange(Number.isFinite(actualValue) ? actualValue : 0);
          }}
        />
        {suffix && <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{suffix}</span>}
      </div>
      {helpText && <span className="text-xs text-gray-500 leading-relaxed">{helpText}</span>}
    </label>
  );
}

function TestBadge({ pass, msg }) {
  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
      pass ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
    }`}>
      {pass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {msg}
    </div>
  );
}

function runTests() {
  const alpha = 0.05;
  const power = 0.8;
  const tailsTwo = 2;
  const tailsOne = 1;
  const results = [];

  const base = 0.05;
  const r1 = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
  const r2 = nProportions({ pA: base, pB: base + 0.02, alpha, power, tails: tailsTwo, ratio: 1 });
  results.push({ pass: r2.total < r1.total, msg: "Larger MDE → smaller sample" });

  const rTwo = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
  const rOne = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsOne, ratio: 1 });
  results.push({ pass: rOne.total < rTwo.total, msg: "One-tailed < two-tailed" });

  const rEq = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
  const rSkew = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 2 });
  results.push({ pass: rSkew.nA < rEq.nA && rSkew.nB > rEq.nB, msg: "Allocation affects group sizes" });

  return results;
}

function SectionDivider({ icon: Icon, title }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-2 border-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 px-6 py-2 rounded-full border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg">
              <Icon size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">{title}</span>
          </div>
        </span>
      </div>
    </div>
  );
}

// ===== Sample Size Calculator (Single Scenario) =====
function SingleScenarioCalculator() {
  const [mode, setMode] = useState("two-prop");
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [tails, setTails] = useState(2);
  const ratio = 1;
  const [baselineRate, setBaselineRate] = useState(0.05);
  const [effectType, setEffectType] = useState("relative");
  const [mdeValue, setMdeValue] = useState(0.05);
  const [meanA, setMeanA] = useState(100);
  const [meanB, setMeanB] = useState(105);
  const [sdA, setSdA] = useState(15);
  const [sdB, setSdB] = useState(15);
  const [numVariations, setNumVariations] = useState(2);
  const [useBonferroni, setUseBonferroni] = useState(true);
  const [dropoffRate, setDropoffRate] = useState(0);
  const [avgDailyTraffic, setAvgDailyTraffic] = useState(100000);

  const { pA, pB } = useMemo(() => {
    if (mode === "two-prop") {
      const pA = baselineRate;
      let pB;
      if (effectType === "relative") {
        pB = pA * (1 + mdeValue);
      } else {
        pB = pA + mdeValue;
      }
      return { pA, pB };
    }
    return { pA: 0, pB: 0 };
  }, [mode, baselineRate, effectType, mdeValue]);

  const computed = useMemo(() => {
    const numComparisons = numVariations;
    const alphaBonf = useBonferroni ? alpha / numComparisons : alpha;

    let baseResult;
    if (mode === "two-prop") {
      baseResult = nProportions({ pA, pB, alpha: alphaBonf, power, tails, ratio });
    } else {
      const delta = Math.abs(meanB - meanA);
      baseResult = nMeans({ sdA, sdB, delta, alpha: alphaBonf, power, tails, ratio });
    }

    const nControl = ceilPositive(baseResult.nA);
    const nPerVariation = ceilPositive(baseResult.nB);
    const subtotal = nControl + nPerVariation * numVariations;

    const nControlWithDropoff = dropoffRate > 0 ? ceilPositive(nControl / (1 - dropoffRate)) : nControl;
    const nPerVariationWithDropoff = dropoffRate > 0 ? ceilPositive(nPerVariation / (1 - dropoffRate)) : nPerVariation;
    const totalWithDropoff = nControlWithDropoff + nPerVariationWithDropoff * numVariations;

    const finalTotal = dropoffRate > 0 ? totalWithDropoff : subtotal;
    const daysNeeded = avgDailyTraffic > 0 ? finalTotal / avgDailyTraffic : 0;
    const weeksNeeded = daysNeeded / 7;

    return {
      nControl,
      nPerVariation,
      subtotal,
      nControlWithDropoff,
      nPerVariationWithDropoff,
      totalWithDropoff,
      numVariations,
      daysNeeded,
      weeksNeeded,
    };
  }, [mode, pA, pB, meanA, meanB, sdA, sdB, alpha, power, tails, ratio, numVariations, useBonferroni, dropoffRate, avgDailyTraffic]);

  const displayMDE = mode === "two-prop" ? Math.abs(pB - pA) : Math.abs(meanB - meanA);

  return (
    <div className="space-y-8">
      <SectionDivider icon={Settings} title="Input Parameters" />

      <div className="grid grid-cols-2 gap-6">
        {/* Test Configuration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
              <Target size={20} className="text-indigo-600" />
            </div>
            Test Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Metric Type</label>
              <div className="space-y-2">
                <button
                  onClick={() => setMode("two-prop")}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    mode === "two-prop"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Proportions (Conversion Rate)
                </button>
                <button
                  onClick={() => setMode("two-means")}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    mode === "two-means"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Means (Average Value)
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Test Type</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTails(2)}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    tails === 2
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Two-tailed (detects ↑ or ↓)
                </button>
                <button
                  onClick={() => setTails(1)}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    tails === 1
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  One-tailed (detects ↑ only)
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use two-tailed unless you have strong directional hypothesis</p>
            </div>
          </div>
        </div>

        {/* Statistical Parameters Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
              <BarChart3 size={20} className="text-indigo-600" />
            </div>
            Statistical Parameters
          </h3>
          <div className="space-y-4">
            <NumberInput
              label="Significance Level (α)"
              value={alpha}
              onChange={setAlpha}
              step={0.01}
              min={0.01}
              max={0.2}
              isPercentage={true}
              suffix="%"
              helpText="Probability of false positive (Type I error). Common: 5%"
            />
            <NumberInput
              label="Statistical Power (1-β)"
              value={power}
              onChange={setPower}
              step={0.05}
              min={0.5}
              max={0.99}
              isPercentage={true}
              suffix="%"
              helpText="Probability of detecting a true effect. Common: 80%"
            />
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Bonferroni Correction</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseBonferroni(!useBonferroni)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    useBonferroni ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      useBonferroni ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {useBonferroni ? "Enabled" : "Disabled"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {useBonferroni 
                  ? "Adjusts α for multiple comparisons to control family-wise error rate"
                  : "No adjustment for multiple variations (increases Type I error risk)"
                }
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Metric Values Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-indigo-600" />
          </div>
          {mode === "two-prop" ? "Conversion Rate Configuration" : "Mean Values Configuration"}
        </h3>
        
        {mode === "two-prop" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Effect Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEffectType("relative");
                    setMdeValue(0.05);
                  }}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    effectType === "relative"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Relative Lift
                </button>
                <button
                  onClick={() => {
                    setEffectType("absolute");
                    setMdeValue(0.005);
                  }}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    effectType === "absolute"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Absolute Lift
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Baseline Rate (Control)"
                value={baselineRate}
                onChange={setBaselineRate}
                step={0.01}
                min={0.01}
                max={0.99}
                isPercentage={true}
                suffix="%"
                helpText="Current conversion rate in control group"
              />

              <NumberInput
                label={effectType === "relative" ? "Minimum Detectable Effect (Relative)" : "Minimum Detectable Effect (Absolute)"}
                value={mdeValue}
                onChange={setMdeValue}
                step={effectType === "relative" ? 0.01 : 0.001}
                min={effectType === "relative" ? 0.01 : 0.001}
                max={effectType === "relative" ? 2 : 0.5}
                isPercentage={true}
                suffix="%"
                helpText={
                  effectType === "relative"
                    ? `Relative change from baseline (e.g., 5% means ${(baselineRate * 100).toFixed(1)}% → ${(baselineRate * (1 + mdeValue) * 100).toFixed(2)}%)`
                    : `Absolute change in percentage points (e.g., 0.5pp means ${(baselineRate * 100).toFixed(1)}% → ${((baselineRate + mdeValue) * 100).toFixed(2)}%)`
                }
              />
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-left">
                  <div className="text-gray-600 font-medium mb-1">Control Rate</div>
                  <div className="text-2xl font-bold text-gray-900">{(pA * 100).toFixed(2)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 font-medium mb-1">Variation Rate</div>
                  <div className="text-2xl font-bold text-indigo-700">{(pB * 100).toFixed(2)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-600 font-medium mb-1">Effect Size</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {effectType === "relative" 
                      ? `${(mdeValue * 100).toFixed(1)}%`
                      : `${(Math.abs(pB - pA) * 100).toFixed(2)}pp`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Control Mean"
                value={meanA}
                onChange={setMeanA}
                step={1}
                helpText="Average value in control group"
              />
              <NumberInput
                label="Variation Mean"
                value={meanB}
                onChange={setMeanB}
                step={1}
                helpText="Expected average in variation"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Control Std Dev (σ)"
                value={sdA}
                onChange={setSdA}
                step={1}
                min={0.1}
                helpText="Standard deviation in control"
              />
              <NumberInput
                label="Variation Std Dev (σ)"
                value={sdB}
                onChange={setSdB}
                step={1}
                min={0.1}
                helpText="Standard deviation in variation"
              />
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Minimum Detectable Effect (MDE):</span>
                <span className="text-2xl font-bold text-indigo-700">
                  {displayMDE.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Variations & Traffic Settings Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <Users size={20} className="text-indigo-600" />
          </div>
          Test Variations & Traffic
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <NumberInput
            label="Number of Variations"
            value={numVariations}
            onChange={setNumVariations}
            step={1}
            min={1}
            max={10}
            helpText={`Testing ${numVariations} variation${numVariations > 1 ? 's' : ''} against control${useBonferroni && numVariations > 1 ? ' (Bonferroni corrected)' : ''}`}
          />
          <NumberInput
            label="Average Daily Traffic"
            value={avgDailyTraffic}
            onChange={setAvgDailyTraffic}
            step={100}
            min={0}
            helpText="Average number of users per day"
          />
          <NumberInput
            label="Expected Drop-off Rate"
            value={dropoffRate}
            onChange={setDropoffRate}
            step={0.01}
            min={0}
            max={0.5}
            isPercentage={true}
            suffix="%"
            helpText="Users who drop out before test completion"
          />
        </div>
      </div>

      {/* SECTION 2: RESULTS */}
      <SectionDivider icon={Calculator} title="Sample Size Results" />

      <div className="grid grid-cols-2 gap-6">
        {/* Sample Size Results Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white border-4 border-indigo-400">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users size={28} />
            Required Sample Size
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-5 border border-white/30">
              <div className="text-sm text-indigo-100 mb-3 uppercase tracking-wide font-semibold">Total Sample Needed</div>
              <div className="text-5xl font-bold mb-2">
                {dropoffRate > 0 ? computed.totalWithDropoff.toLocaleString() : computed.subtotal.toLocaleString()}
              </div>
              <div className="text-xs text-indigo-100">
                {computed.numVariations === 1 ? '1 control + 1 variation' : `1 control + ${computed.numVariations} variations`}
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="text-xs uppercase tracking-wide font-semibold mb-3 text-indigo-50">Group Breakdown</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                  <span className="text-indigo-100">Control</span>
                  <span className="font-semibold">{dropoffRate > 0 ? computed.nControlWithDropoff.toLocaleString() : computed.nControl.toLocaleString()}</span>
                </div>
                {Array.from({ length: numVariations }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-indigo-100">Variation {String.fromCharCode(66 + i)}</span>
                    <span className="font-semibold">{dropoffRate > 0 ? computed.nPerVariationWithDropoff.toLocaleString() : computed.nPerVariation.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t-2 border-white/30 pt-2 mt-2 flex justify-between items-center font-bold text-base">
                  <span>Total</span>
                  <span>{dropoffRate > 0 ? computed.totalWithDropoff.toLocaleString() : computed.subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div className="text-xs text-indigo-50">
                <p className="font-semibold mb-1">Methodology:</p>
                <p>Normal-theory formulas with unpooled variance. Multiple variations use Bonferroni correction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Duration Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-emerald-400">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar size={28} />
            Test Duration
          </h2>
          
          {avgDailyTraffic > 0 && (
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur rounded-xl p-5 border border-white/30">
                <div className="text-sm text-emerald-100 mb-3 uppercase tracking-wide">Duration Required</div>
                <div className="flex items-baseline gap-4">
                  <div>
                    <div className="text-5xl font-bold">{Math.ceil(computed.daysNeeded)}</div>
                    <div className="text-sm text-emerald-100 mt-1">days</div>
                  </div>
                  <div className="text-3xl text-emerald-200">≈</div>
                  <div>
                    <div className="text-4xl font-bold">{computed.weeksNeeded.toFixed(1)}</div>
                    <div className="text-sm text-emerald-100 mt-1">weeks</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-sm text-emerald-50 border border-white/20">
                <div className="flex justify-between mb-2">
                  <span>Daily traffic:</span>
                  <span className="font-semibold">{avgDailyTraffic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total sample needed:</span>
                  <span className="font-semibold">{(dropoffRate > 0 ? computed.totalWithDropoff : computed.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20">
                  <span>Days to reach sample:</span>
                  <span className="font-semibold">{computed.daysNeeded.toFixed(1)} days</span>
                </div>
              </div>
              
              {computed.daysNeeded < 7 && (
                <div className="bg-yellow-400/20 backdrop-blur rounded-lg p-3 text-xs text-yellow-50 border border-yellow-300/30">
                  <strong>⚠️ Short test duration:</strong> Tests under 1 week may not capture weekly patterns or be affected by day-of-week variations.
                </div>
              )}
              
              {computed.daysNeeded > 28 && (
                <div className="bg-blue-400/20 backdrop-blur rounded-lg p-3 text-xs text-blue-50 border border-blue-300/30">
                  <strong>ℹ️ Long test duration:</strong> Consider increasing traffic allocation or reducing MDE if a {Math.ceil(computed.daysNeeded)}-day test is too long.
                </div>
              )}
            </div>
          )}

          {avgDailyTraffic === 0 && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-sm text-emerald-50">
                Enter your average daily traffic in the "Test Variations & Traffic" section to calculate test duration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Multiple Scenarios Calculator =====
function MultipleScenarios() {
  const [mode, setMode] = useState("two-prop");
  const [alphaValues, setAlphaValues] = useState("1, 5, 10");
  const [power, setPower] = useState(0.8);
  const [tails, setTails] = useState(2);
  const ratio = 1;
  const [baselineRate, setBaselineRate] = useState(0.05);
  const [effectType, setEffectType] = useState("relative");
  const [mdeValues, setMdeValues] = useState("1, 3, 5, 8");
  const [meanA, setMeanA] = useState(100);
  const [meanB, setMeanB] = useState(105);
  const [sdA, setSdA] = useState(15);
  const [sdB, setSdB] = useState(15);
  const [numVariations, setNumVariations] = useState(2);
  const [useBonferroni, setUseBonferroni] = useState(true);
  const [dropoffRate, setDropoffRate] = useState(0);
  const [avgDailyTraffic, setAvgDailyTraffic] = useState(100000);

  const scenarios = useMemo(() => {
    const alphas = alphaValues.split(',').map(v => parseFloat(v.trim()) / 100).filter(v => !isNaN(v) && v > 0 && v < 1);
    const mdes = mdeValues.split(',').map(v => parseFloat(v.trim()) / 100).filter(v => !isNaN(v) && v > 0);
    
    const results = [];
    
    for (const alpha of alphas) {
      for (const mdeValue of mdes) {
        const alphaBonf = useBonferroni ? alpha / numVariations : alpha;
        
        let pA, pB;
        if (mode === "two-prop") {
          if (effectType === "relative") {
            pA = baselineRate;
            pB = pA * (1 + mdeValue);
          } else {
            pA = baselineRate;
            pB = pA + mdeValue;
          }
          
          const baseResult = nProportions({ pA, pB, alpha: alphaBonf, power, tails, ratio });
          const nControl = ceilPositive(baseResult.nA);
          const nPerVariation = ceilPositive(baseResult.nB);
          const subtotal = nControl + nPerVariation * numVariations;
          
          const nControlWithDropoff = dropoffRate > 0 ? ceilPositive(nControl / (1 - dropoffRate)) : nControl;
          const nPerVariationWithDropoff = dropoffRate > 0 ? ceilPositive(nPerVariation / (1 - dropoffRate)) : nPerVariation;
          const totalWithDropoff = nControlWithDropoff + nPerVariationWithDropoff * numVariations;
          
          const finalTotal = dropoffRate > 0 ? totalWithDropoff : subtotal;
          const daysNeeded = avgDailyTraffic > 0 ? finalTotal / avgDailyTraffic : 0;
          
          results.push({
            alpha: alpha * 100,
            mde: mdeValue * 100,
            controlRate: pA * 100,
            variationRate: pB * 100,
            numVariations: numVariations,
            nControl: dropoffRate > 0 ? nControlWithDropoff : nControl,
            nPerVariation: dropoffRate > 0 ? nPerVariationWithDropoff : nPerVariation,
            totalSample: finalTotal,
            daysNeeded: Math.ceil(daysNeeded),
            weeksNeeded: (daysNeeded / 7).toFixed(1)
          });
        }
      }
    }
    
    return results;
  }, [alphaValues, mdeValues, mode, power, tails, baselineRate, effectType, numVariations, useBonferroni, dropoffRate, avgDailyTraffic]);

  return (
    <div className="space-y-8">
      <SectionDivider icon={Settings} title="Input Parameters" />

      <div className="grid grid-cols-2 gap-6">
        {/* Test Configuration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
              <Target size={20} className="text-indigo-600" />
            </div>
            Test Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Metric Type</label>
              <div className="space-y-2">
                <button
                  onClick={() => setMode("two-prop")}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    mode === "two-prop"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Proportions (Conversion Rate)
                </button>
                <button
                  onClick={() => setMode("two-means")}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    mode === "two-means"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Means (Average Value)
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Test Type</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTails(2)}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    tails === 2
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Two-tailed (detects ↑ or ↓)
                </button>
                <button
                  onClick={() => setTails(1)}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    tails === 1
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  One-tailed (detects ↑ only)
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use two-tailed unless you have strong directional hypothesis</p>
            </div>
          </div>
        </div>

        {/* Statistical Parameters Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
              <BarChart3 size={20} className="text-indigo-600" />
            </div>
            Statistical Parameters
          </h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Significance Levels (α) - comma separated</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                  value={alphaValues}
                  onChange={(e) => setAlphaValues(e.target.value)}
                  placeholder="1, 5, 10"
                />
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">%</span>
              </div>
              <span className="text-xs text-gray-500">Enter multiple values (e.g., "1, 5, 10" for 1%, 5%, 10%)</span>
            </label>

            <NumberInput
              label="Statistical Power (1-β)"
              value={power}
              onChange={setPower}
              step={0.05}
              min={0.5}
              max={0.99}
              isPercentage={true}
              suffix="%"
              helpText="Probability of detecting a true effect. Common: 80%"
            />
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Bonferroni Correction</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseBonferroni(!useBonferroni)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    useBonferroni ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      useBonferroni ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {useBonferroni ? "Enabled" : "Disabled"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {useBonferroni 
                  ? "Adjusts α for multiple comparisons to control family-wise error rate"
                  : "No adjustment for multiple variations (increases Type I error risk)"
                }
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Metric Values Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-indigo-600" />
          </div>
          {mode === "two-prop" ? "Conversion Rate Configuration" : "Mean Values Configuration"}
        </h3>
        
        {mode === "two-prop" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Effect Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEffectType("relative");
                    setMdeValues("1, 3, 5, 8");
                  }}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    effectType === "relative"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Relative Lift
                </button>
                <button
                  onClick={() => {
                    setEffectType("absolute");
                    setMdeValues("0.5, 1, 1.5, 2");
                  }}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    effectType === "absolute"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Absolute Lift
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Baseline Rate (Control)"
                value={baselineRate}
                onChange={setBaselineRate}
                step={0.01}
                min={0.01}
                max={0.99}
                isPercentage={true}
                suffix="%"
                helpText="Current conversion rate in control group"
              />

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {effectType === "relative" ? "MDE (Relative) - comma separated" : "MDE (Absolute) - comma separated"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                    value={mdeValues}
                    onChange={(e) => setMdeValues(e.target.value)}
                    placeholder={effectType === "relative" ? "1, 3, 5, 8" : "0.5, 1, 1.5, 2"}
                  />
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">%</span>
                </div>
                <span className="text-xs text-gray-500">
                  {effectType === "relative"
                    ? "Relative lift values (e.g., \"1, 3, 5\" for 1%, 3%, 5% lifts)"
                    : "Absolute lift values (e.g., \"0.5, 1\" for 0.5pp, 1pp lifts)"
                  }
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Control Mean"
                value={meanA}
                onChange={setMeanA}
                step={1}
                helpText="Average value in control group"
              />
              <NumberInput
                label="Variation Mean"
                value={meanB}
                onChange={setMeanB}
                step={1}
                helpText="Expected average in variation"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <NumberInput
                label="Control Std Dev (σ)"
                value={sdA}
                onChange={setSdA}
                step={1}
                min={0.1}
                helpText="Standard deviation in control"
              />
              <NumberInput
                label="Variation Std Dev (σ)"
                value={sdB}
                onChange={setSdB}
                step={1}
                min={0.1}
                helpText="Standard deviation in variation"
              />
            </div>
          </div>
        )}
      </div>

      {/* Test Variations & Traffic Settings Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <Users size={20} className="text-indigo-600" />
          </div>
          Test Variations & Traffic
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <NumberInput
            label="Number of Variations"
            value={numVariations}
            onChange={setNumVariations}
            step={1}
            min={1}
            max={10}
            helpText={`Testing ${numVariations} variation${numVariations > 1 ? 's' : ''} against control${useBonferroni && numVariations > 1 ? ' (Bonferroni corrected)' : ''}`}
          />
          <NumberInput
            label="Average Daily Traffic"
            value={avgDailyTraffic}
            onChange={setAvgDailyTraffic}
            step={100}
            min={0}
            helpText="Average number of users per day"
          />
          <NumberInput
            label="Expected Drop-off Rate"
            value={dropoffRate}
            onChange={setDropoffRate}
            step={0.01}
            min={0}
            max={0.5}
            isPercentage={true}
            suffix="%"
            helpText="Users who drop out before test completion"
          />
        </div>
      </div>

      {/* Results Table */}
      <SectionDivider icon={BarChart3} title={`Scenario Results (${scenarios.length} scenarios)`} />

      {scenarios.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              // Prepare data for Excel
              const excelData = scenarios.map(s => ({
                'Significance Level (%)': s.alpha.toFixed(1),
                'MDE (%)': s.mde.toFixed(1),
                'Control Rate (%)': s.controlRate.toFixed(2),
                'Variation Rate (%)': s.variationRate.toFixed(2),
                'Number of Variations': s.numVariations,
                'n (Control)': s.nControl,
                'n (per Variation)': s.nPerVariation,
                'Total Sample Size': s.totalSample,
                'Duration (Days)': s.daysNeeded,
                'Duration (Weeks)': s.weeksNeeded
              }));

              // Create workbook and worksheet
              const ws = XLSX.utils.json_to_sheet(excelData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sample Size Scenarios");

              // Set column widths
              ws['!cols'] = [
                { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 17 }, 
                { wch: 20 }, { wch: 12 }, { wch: 18 }, 
                { wch: 18 }, { wch: 15 }, { wch: 16 }
              ];

              // Download
              XLSX.writeFile(wb, "sample_size_scenarios.xlsx");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
          >
            <Download size={18} />
            Export to Excel
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Significance Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">MDE (%)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Control</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Variation</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide"># Variations</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">n (Control)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">n (per Var)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Total Sample</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Days</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Weeks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scenarios.map((scenario, idx) => {
                // Color coding based on alpha level
                let bgColor = "bg-white";
                if (scenario.alpha <= 1) {
                  bgColor = idx % 2 === 0 ? "bg-red-50" : "bg-red-100/50";
                } else if (scenario.alpha <= 5) {
                  bgColor = idx % 2 === 0 ? "bg-amber-50" : "bg-amber-100/50";
                } else {
                  bgColor = idx % 2 === 0 ? "bg-blue-50" : "bg-blue-100/50";
                }

                return (
                  <tr key={idx} className={bgColor}>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{scenario.alpha.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm font-semibold text-indigo-700">{scenario.mde.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{scenario.controlRate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{scenario.variationRate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{scenario.numVariations}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.nControl.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.nPerVariation.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-indigo-700">{scenario.totalSample.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.daysNeeded}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{scenario.weeksNeeded}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Color Legend */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-6 text-xs">
            <span className="font-semibold text-gray-700">Color Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-gray-600">α ≤ 1% (Very Conservative)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-amber-50 border border-amber-200 rounded"></div>
              <span className="text-gray-600">α ≤ 5% (Standard)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-gray-600">α > 5% (Liberal)</span>
            </div>
          </div>
        </div>
      </div>

      {scenarios.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-800">
            No valid scenarios generated. Please check your input values.
          </p>
        </div>
      )}
    </div>
  );
}

// ===== Documentation Component =====
// function Documentation() {
//   const tests = useMemo(() => runTests(), []);

//   return (
//     <div className="space-y-8">
//       <SectionDivider icon={BookOpen} title="Documentation & Reference" />

//       {/* Validation Tests */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//           <div className="p-2 bg-emerald-100 rounded-lg">
//             <CheckCircle2 size={18} className="text-emerald-600" />
//           </div>
//           Built-in Validation Tests
//         </h4>
//         <div className="flex flex-wrap gap-2 mb-3">
//           {tests.map((t, i) => (
//             <TestBadge key={i} pass={t.pass} msg={t.msg} />
//           ))}
//         </div>
//         <p className="text-sm text-gray-600">
//           These automated tests verify expected statistical relationships (e.g., larger effect sizes require smaller samples).
//         </p>
//       </div>

//       {/* Formula Reference */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h4 className="text-lg font-semibold text-gray-900 mb-5">Statistical Formulas</h4>
//         <div className="space-y-4 text-sm text-gray-700">
//           <div>
//             <p className="font-semibold text-gray-900 mb-2">Two-sample Proportions (unpooled variance):</p>
//             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
//               n<sub>A</sub> = (z<sub>α</sub> · √[p<sub>A</sub>(1−p<sub>A</sub>)(1+1/r)] + z<sub>β</sub> · √[p<sub>A</sub>(1−p<sub>A</sub>) + p<sub>B</sub>(1−p<sub>B</sub>)/r])² / (p<sub>B</sub>−p<sub>A</sub>)²
//               <br />
//               n<sub>B</sub> = r · n<sub>A</sub>
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-900 mb-2">Two-sample Means:</p>
//             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
//               n<sub>A</sub> = (z<sub>α</sub> + z<sub>β</sub>)² · (σ<sub>A</sub>² + σ<sub>B</sub>²/r) / Δ²
//               <br />
//               n<sub>B</sub> = r · n<sub>A</sub>
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-900 mb-2">Multiple Variations (Bonferroni correction):</p>
//             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
//               α<sub>adjusted</sub> = α / k, where k = number of variations
//               <br />
//               Total = n<sub>control</sub> + (n<sub>per_variation</sub> × k)
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-900 mb-2">Drop-off Adjustment & Duration:</p>
//             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
//               n<sub>recruit</sub> = n<sub>required</sub> / (1 - dropout_rate)
//               <br />
//               days_needed = n<sub>recruit</sub> / avg_daily_traffic
//             </div>
//           </div>
//           <p className="text-xs text-gray-600 pt-2">
//             Where z<sub>α</sub> = Φ⁻¹(1 − α/2) for two-tailed or Φ⁻¹(1 − α) for one-tailed, 
//             z<sub>β</sub> = Φ⁻¹(power), r = allocation ratio
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// ===== Documentation Component =====
function Documentation() {
  const [openSection, setOpenSection] = useState("getting-started");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const CollapsibleSection = ({ id, title, icon: Icon, children, defaultOpen = false }) => {
    const isOpen = openSection === id;
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={20} className="text-indigo-600" />}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {isOpen && (
          <div className="px-6 py-4 bg-white">
            {children}
          </div>
        )}
      </div>
    );
  };

  const ChevronDown = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Calculator size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sample Size Calculator Documentation</h1>
            <p className="text-indigo-100 mt-1">Complete guide to determining how many users you need for your A/B test</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Info size={18} />
          Quick Navigation
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button onClick={() => setOpenSection("getting-started")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Getting Started</button>
          <button onClick={() => setOpenSection("parameters")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Understanding Parameters</button>
          <button onClick={() => setOpenSection("interpreting")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Interpreting Results</button>
          <button onClick={() => setOpenSection("examples")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Practical Examples</button>
          <button onClick={() => setOpenSection("best-practices")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Best Practices</button>
          <button onClick={() => setOpenSection("common-mistakes")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Common Mistakes</button>
        </div>
      </div>

      {/* Getting Started */}
      <CollapsibleSection id="getting-started" title="Getting Started" icon={Target} defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700">
            The Sample Size Calculator helps you determine how many users you need in your A/B test to detect 
            a meaningful difference. Running a test with too few users wastes time, while too many wastes resources.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
            <h4 className="font-bold text-indigo-900 mb-2">Why Sample Size Matters</h4>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1 ml-4">
              <li><strong>Too small:</strong> You might miss a real improvement (low statistical power)</li>
              <li><strong>Too large:</strong> You waste time and resources testing longer than needed</li>
              <li><strong>Just right:</strong> You can confidently detect meaningful improvements efficiently</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">Quick Start Guide</h4>
            
            <div className="bg-gray-50 border-l-4 border-green-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">Enter Your Baseline Rate</h5>
                  <p className="text-sm text-gray-700">This is your current conversion rate (e.g., 8.5% of visitors convert)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">Set Your Minimum Detectable Effect</h5>
                  <p className="text-sm text-gray-700">The smallest improvement you care about detecting (e.g., 10% relative improvement)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">Choose Power and Significance</h5>
                  <p className="text-sm text-gray-700">Use defaults (80% power, 95% confidence) unless you have specific requirements</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">Get Your Sample Size</h5>
                  <p className="text-sm text-gray-700">The calculator tells you how many users you need per variation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Understanding Parameters */}
      <CollapsibleSection id="parameters" title="Understanding Parameters" icon={Settings}>
        <div className="space-y-6">
          
          {/* Baseline Rate */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              Baseline Conversion Rate
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Your current conversion rate before making any changes. This is the control group's expected performance.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>E-commerce:</strong> 2.5% of visitors make a purchase</li>
                <li><strong>SaaS signup:</strong> 8% of visitors create an account</li>
                <li><strong>Add-to-cart:</strong> 12% of visitors add items to cart</li>
                <li><strong>Email click:</strong> 15% of recipients click a link</li>
              </ul>
            </div>

            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <strong className="text-yellow-900">⚠️ Important:</strong>
              <span className="text-yellow-800"> Use a realistic baseline! Use a representative average from the past 2-4 weeks.</span>
            </div>
          </div>

          {/* Minimum Detectable Effect */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Target size={16} className="text-indigo-600" />
              Minimum Detectable Effect (MDE)
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              The smallest improvement you want to be able to detect. This is expressed as a <strong>relative</strong> change 
              from your baseline, not an absolute change.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
              <h5 className="font-semibold text-green-900 mb-2 text-sm">Understanding Relative vs Absolute:</h5>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>Baseline: 5%</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>10% relative increase</strong> = 5% → 5.5% (absolute +0.5%)</li>
                  <li><strong>20% relative increase</strong> = 5% → 6.0% (absolute +1.0%)</li>
                  <li><strong>50% relative increase</strong> = 5% → 7.5% (absolute +2.5%)</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Typical MDEs by Industry:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>E-commerce checkout:</strong> 5-15% (already optimized, looking for tweaks)</li>
                <li><strong>Landing pages:</strong> 15-25% (room for bigger wins)</li>
                <li><strong>New features:</strong> 20-50% (expect larger impact)</li>
                <li><strong>Email campaigns:</strong> 10-20% (moderate improvements expected)</li>
              </ul>
            </div>
          </div>

          {/* Statistical Power */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Statistical Power (1 - β)</h4>
            <p className="text-sm text-gray-700 mb-3">
              The probability of detecting a real effect when it exists. Standard is 80%, meaning if there's a 
              real improvement, you have an 80% chance of detecting it.
            </p>

            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                <strong>80% power (β = 0.20)</strong> - Industry standard, good balance
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                <strong>90% power (β = 0.10)</strong> - More conservative, requires more samples
              </div>
            </div>
          </div>

          {/* Significance Level */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Significance Level (α)</h4>
            <p className="text-sm text-gray-700 mb-3">
              The probability of declaring a difference when there isn't one (false positive). Standard is 0.05 
              (5%), meaning 5% chance of incorrectly calling a winner.
            </p>

            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                <strong>α = 0.05 (95% confidence)</strong> - Industry standard
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                <strong>α = 0.01 (99% confidence)</strong> - More stringent, for critical decisions
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Interpreting Results */}
      <CollapsibleSection id="interpreting" title="Interpreting Results" icon={LineChart}>
        <div className="space-y-6">
          
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Understanding the Output</h4>
            
            <div className="space-y-3">
              <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4">
                <h5 className="font-bold text-indigo-900 mb-2">Sample Size Per Variation</h5>
                <p className="text-sm text-indigo-800 mb-2">
                  The number of users you need in EACH group (control and variation).
                </p>
                <div className="bg-indigo-100 rounded p-3 text-sm">
                  <p className="font-mono text-indigo-900"><strong>Example:</strong> 15,683 per variation</p>
                  <p className="text-indigo-800 mt-1">For an A/B test: <strong>15,683 × 2 = 31,366 total users</strong></p>
                  <p className="text-indigo-800">For an A/B/C test: <strong>15,683 × 3 = 47,049 total users</strong></p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <h5 className="font-bold text-green-900 mb-2">Test Duration</h5>
                <p className="text-sm text-green-800 mb-2">
                  How long you need to run the test based on your daily traffic.
                </p>
                <div className="bg-green-100 rounded p-3 text-sm">
                  <p className="text-green-800">With 31,366 total needed and 5,000 daily visitors: <strong>~6.3 days</strong></p>
                  <p className="text-green-700 mt-1 text-xs">Always round UP to full business cycles (weeks)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">What If My Sample Size Is Too Large?</h4>
            
            <div className="space-y-2">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg text-sm">
                <strong className="text-blue-900">Option 1: Increase MDE</strong>
                <p className="text-blue-800">Accept that you can only detect larger improvements. Change MDE from 5% to 10% or 15%.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg text-sm">
                <strong className="text-green-900">Option 2: Run Longer</strong>
                <p className="text-green-800">Let the test run for more weeks. Make sure to run in full business cycles.</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg text-sm">
                <strong className="text-purple-900">Option 3: Test Different Metric</strong>
                <p className="text-purple-800">Use a higher-volume metric (e.g., add-to-cart instead of purchase) as a proxy.</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Practical Examples */}
      <CollapsibleSection id="examples" title="Practical Examples" icon={BarChart3}>
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">Example 1: E-commerce Product Page</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded p-3">
                <p className="text-gray-900"><strong>Scenario:</strong> Testing a new product image layout</p>
                <p className="text-gray-700 mt-1"><strong>Baseline:</strong> 2.5% purchase rate</p>
                <p className="text-gray-700"><strong>MDE:</strong> 20% relative improvement (2.5% → 3.0%)</p>
                <p className="text-gray-700"><strong>Power:</strong> 80%, <strong>Significance:</strong> 95%</p>
              </div>
              <div className="bg-blue-100 rounded p-3">
                <p className="font-bold text-blue-900">Results:</p>
                <p className="text-blue-800"><strong>Sample size:</strong> ~6,200 per variation (12,400 total)</p>
                <p className="text-blue-800"><strong>With 5,000 daily visitors:</strong> ~2.5 days → Run for 1 week</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
            <h4 className="font-bold text-green-900 mb-3 text-lg">Example 2: SaaS Signup Flow</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded p-3">
                <p className="text-gray-900"><strong>Scenario:</strong> Simplifying the signup form</p>
                <p className="text-gray-700 mt-1"><strong>Baseline:</strong> 8% signup rate</p>
                <p className="text-gray-700"><strong>MDE:</strong> 10% relative improvement (8% → 8.8%)</p>
              </div>
              <div className="bg-green-100 rounded p-3">
                <p className="font-bold text-green-900">Results:</p>
                <p className="text-green-800"><strong>Sample size:</strong> ~22,000 per variation (44,000 total)</p>
                <p className="text-green-800"><strong>With 2,000 daily visitors:</strong> ~22 days → Run for 3-4 weeks</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Best Practices */}
      <CollapsibleSection id="best-practices" title="Best Practices" icon={CheckCircle2}>
        <div className="space-y-4">
          
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
            <h5 className="font-bold text-green-900 mb-2">✅ Always Calculate Before Testing</h5>
            <p className="text-sm text-green-800">
              Never start a test without knowing your required sample size. Running underpowered tests wastes time.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h5 className="font-bold text-blue-900 mb-2">✅ Run Tests in Full Business Cycles</h5>
            <p className="text-sm text-blue-800 mb-2">
              Always run tests for complete weeks (Monday-Sunday) to account for day-of-week effects.
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 ml-4 space-y-1">
              <li>Weekend behavior often differs from weekday</li>
              <li>Run at least 1 full week, preferably 2 weeks</li>
              <li>Avoid major holidays or unusual events</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
            <h5 className="font-bold text-purple-900 mb-2">✅ Be Realistic About MDE</h5>
            <p className="text-sm text-purple-800 mb-2">
              Don't chase tiny effects unless you have massive traffic. For most sites, 10-20% MDE is practical.
            </p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
            <h5 className="font-bold text-orange-900 mb-2">✅ Don't Stop Early</h5>
            <p className="text-sm text-orange-800 mb-2">
              Even if you see "significance" after 2 days, wait for your planned sample size!
            </p>
            <ul className="list-disc list-inside text-sm text-orange-700 ml-4 space-y-1">
              <li>Early results are often misleading</li>
              <li>P-values fluctuate wildly with small samples</li>
              <li>Stick to your predetermined sample size</li>
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      {/* Common Mistakes */}
      <CollapsibleSection id="common-mistakes" title="Common Mistakes to Avoid" icon={AlertTriangle}>
        <div className="space-y-4">
          
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Mistake #1: Using Absolute Instead of Relative MDE
            </h4>
            <div className="text-sm text-red-800 space-y-2">
              <p><strong>Wrong:</strong> "I want to detect a 1% improvement" (absolute)</p>
              <p><strong>Right:</strong> "I want to detect a 20% improvement" (relative to baseline)</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Mistake #2: Stopping When You See Significance
            </h4>
            <div className="text-sm text-orange-800 space-y-2">
              <p><strong>The trap:</strong> "We hit p &lt; 0.05 after 3 days, let's stop!"</p>
              <p><strong>The problem:</strong> This inflates false positives</p>
              <p className="text-orange-700 bg-orange-100 rounded p-2 mt-2">
                <strong>Solution:</strong> Run until you hit your predetermined sample size
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Mistake #3: Forgetting About Total Sample Size
            </h4>
            <div className="text-sm text-yellow-800 space-y-2">
              <p><strong>Remember:</strong> Sample size per variation × number of variations = total needed</p>
              <p>Example: 15,000 per variation × 2 groups = 30,000 total</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Mistake #4: Using an Outdated Baseline
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Best practice:</strong> Use the most recent 2-4 weeks of data for your baseline.</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-indigo-900 mb-4 text-lg">Quick Reference Guide</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recommended Defaults</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li><strong>Power:</strong> 80% (β = 0.20)</li>
              <li><strong>Significance:</strong> 95% (α = 0.05)</li>
              <li><strong>MDE:</strong> 10-20% for most cases</li>
              <li><strong>Duration:</strong> Min 1 week, prefer 2+</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Common MDEs</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li><strong>Mature product:</strong> 5-10%</li>
              <li><strong>Standard optimization:</strong> 10-20%</li>
              <li><strong>Major redesign:</strong> 20-50%</li>
              <li><strong>Low traffic site:</strong> 25-50%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// ===== Sample Size Tab with Nested Tabs =====
function SampleSizeTab() {
  const [activeSubTab, setActiveSubTab] = useState("single");

  const subTabs = [
    { id: "single", label: "Sample Size Calculator", icon: Calculator },
    { id: "multiple", label: "Multiple Scenarios", icon: Grid3x3 },
    { id: "docs", label: "Documentation", icon: BookOpen },
  ];

  return (
    <div>
      {/* Sub-tab Navigation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 mb-6 -mt-2">
        <div className="flex gap-1 px-2 pt-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all rounded-t-xl ${
                  activeSubTab === tab.id
                    ? "bg-white text-indigo-700 shadow-sm border-t-2 border-x-2 border-indigo-500"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab Content */}
      <div>
        {activeSubTab === "single" && <SingleScenarioCalculator />}
        {activeSubTab === "multiple" && <MultipleScenarios />}
        {activeSubTab === "docs" && <Documentation />}
      </div>
    </div>
  );
}

// ===== Test Monitoring Tab =====
function TestMonitoringTab({ testData }) {
  return <ExperimentMonitoring testData={testData} />;
}

// ===== Test Repository Tab =====
function TestRepositoryTab({ testData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTests = useMemo(() => {
    return testData.filter(test => {
      const matchesSearch = 
        test.Summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.Hypothesis.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === "All" || test["Test Stage"] === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [searchTerm, stageFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedTest(null);
  }, [searchTerm, stageFilter]);

  const stageStats = useMemo(() => {
    const stats = {
      Total: testData.length,
      Completed: 0,
      Intake: 0,
      Proposal: 0,
      Development: 0,
      Live: 0,
      "Result Analysis": 0,
      "Result Implementation": 0
    };
    
    testData.forEach(test => {
      const stage = test["Test Stage"];
      if (stage === "Completed") stats.Completed++;
      else if (stage === "Intake") stats.Intake++;
      else if (stage === "Proposal") stats.Proposal++;
      else if (stage === "Dev") stats.Development++;
      else if (stage === "Live") stats.Live++;
      else if (stage === "Result Analysis") stats["Result Analysis"]++;
      else if (stage === "Result Implementation") stats["Result Implementation"]++;
    });
    
    return stats;
  }, []);

  // Timeline data - group completed tests by month-year (by end date)
  const completedTimelineData = useMemo(() => {
    const monthCounts = {};
    const monthDates = {}; // Store actual date for sorting
    
    // Filter only completed tests
    const completedTests = testData.filter(test => test["Test Stage"] === "Completed");
    
    completedTests.forEach(test => {
      const date = new Date(test["Test End Date"]);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM for sorting
      
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      monthDates[monthYear] = sortKey;
    });
    
    // Sort by actual date using the sortKey
    const sorted = Object.entries(monthCounts).sort((a, b) => {
      const dateA = monthDates[a[0]];
      const dateB = monthDates[b[0]];
      return dateA.localeCompare(dateB);
    });
    
    return sorted;
  }, []);

  const completedMaxCount = Math.max(...completedTimelineData.map(([_, count]) => count), 1);

  const getStageColor = (stage) => {
    if (stage === "Completed") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    const colors = {
      "Live": "bg-blue-100 text-blue-800 border-blue-300",
      "Result Analysis": "bg-purple-100 text-purple-800 border-purple-300",
      "Result Implementation": "bg-indigo-100 text-indigo-800 border-indigo-300",
      "Development": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Intake": "bg-orange-100 text-orange-800 border-orange-300",
      "Proposal": "bg-gray-100 text-gray-800 border-gray-300"
    };
    return colors[stage] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const scorecards = {
    total: { 
      label: "Total A/B Tests", 
      value: stageStats.Total, 
      icon: FlaskConical, 
      gradient: "from-indigo-600 to-purple-700",
      border: "border-indigo-400"
    },
    others: [
      { 
        label: "Completed", 
        value: stageStats.Completed, 
        icon: CheckCircle2, 
        gradient: "from-emerald-500 to-teal-600",
        border: "border-emerald-400"
      },
      { 
        label: "Intake", 
        value: stageStats.Intake, 
        icon: Clock, 
        gradient: "from-orange-500 to-amber-600",
        border: "border-orange-400"
      },
      { 
        label: "Proposal", 
        value: stageStats.Proposal, 
        icon: BookOpen, 
        gradient: "from-gray-500 to-slate-600",
        border: "border-gray-400"
      },
      { 
        label: "Live Tests", 
        value: stageStats.Live, 
        icon: Play, 
        gradient: "from-blue-500 to-cyan-600",
        border: "border-blue-400"
      },
      { 
        label: "Development", 
        value: stageStats.Development, 
        icon: Settings, 
        gradient: "from-yellow-500 to-orange-600",
        border: "border-yellow-400"
      },
      { 
        label: "Analysis/Impl", 
        value: stageStats["Result Analysis"] + stageStats["Result Implementation"], 
        icon: BarChart3, 
        gradient: "from-purple-500 to-pink-600",
        border: "border-purple-400"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-3">
        {/* Large Total Card - Spans 2 columns and 2 rows */}
        <div 
          className={`col-span-2 row-span-2 bg-gradient-to-br ${scorecards.total.gradient} rounded-2xl shadow-xl p-4 text-white border-2 ${scorecards.total.border} hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-center items-center`}
        >
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl mb-3">
            <FlaskConical size={32} />
          </div>
          <span className="text-sm font-bold opacity-90 mb-2">{scorecards.total.label}</span>
          <div className="text-5xl font-bold">{scorecards.total.value}</div>
        </div>

        {/* Other Cards - 3x2 Grid */}
        {scorecards.others.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg p-2.5 text-white border-2 ${card.border} hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="p-1 bg-white/20 backdrop-blur rounded-lg">
                  <Icon size={14} />
                </div>
                <span className="text-xs font-semibold opacity-90 leading-tight">{card.label}</span>
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Completed Tests Timeline Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
            <BarChart3 size={18} className="text-emerald-600" />
          </div>
          Completed Tests Timeline (by Completion Month)
        </h3>
        
        {completedTimelineData.length > 0 ? (
          <div className="relative">
            {/* Column chart */}
            <div className="flex items-end justify-around gap-3 h-28 border-b-2 border-gray-300 pb-2 px-4 relative">
              {/* Bars container */}
              <div className="flex items-end justify-around gap-3 flex-1">
                {completedTimelineData.map(([monthYear, count], idx) => {
                  // Calculate exact pixel height based on chart area
                  const chartHeight = 90; // Reduced from 130
                  const barHeight = (count / completedMaxCount) * chartHeight;
                  
                  return (
                    <div key={monthYear} className="flex flex-col items-center flex-1 max-w-[100px]">
                      {/* Count label on top */}
                      <div className="text-xs font-bold text-gray-800 mb-1 h-4">
                        {count}
                      </div>
                      
                      {/* Bar with emerald/teal gradient for completed tests */}
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg hover:from-emerald-700 hover:to-teal-600 transition-all cursor-pointer shadow-md hover:shadow-xl group relative"
                        style={{ 
                          height: `${barHeight}px`
                        }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {monthYear}: {count} {count === 1 ? 'test' : 'tests'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-around gap-3 px-4 mt-2">
              {completedTimelineData.map(([monthYear], idx) => (
                <div key={idx} className="flex-1 max-w-[100px] text-center">
                  <div className="text-xs font-semibold text-gray-700">
                    {monthYear}
                  </div>
                </div>
              ))}
            </div>
            
            {/* X-axis label */}
            <div className="text-center mt-2">
              <span className="text-xs font-semibold text-gray-600">Completion Month</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No completed tests to display</p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by summary, product, or hypothesis..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all appearance-none"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option>All</option>
                <option>Completed</option>
                <option>Live</option>
                <option>Result Analysis</option>
                <option>Result Implementation</option>
                <option>Development</option>
                <option>Intake</option>
                <option>Proposal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Test Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Experiment Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Launch Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">End Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Countries</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTests.map((test, idx) => (
                <React.Fragment key={idx}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{test.Summary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStageColor(test["Test Stage"])} inline-block`}>
                        {test["Test Stage"]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test["Test Launch Date"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test["Test End Date"]}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{test.Product}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test["Country or Countries"]}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedTest(selectedTest === idx ? null : idx)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto text-xs"
                      >
                        <Eye size={14} />
                        {selectedTest === idx ? "Hide" : "View"} Details
                      </button>
                    </td>
                  </tr>
                  {selectedTest === idx && (
                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                      <td colSpan="7" className="px-6 py-6">
                        <div className="space-y-6">
                          {/* Hypothesis Section */}
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200">
                            <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                              <Target size={16} className="text-indigo-600" />
                              Hypothesis
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {test.Hypothesis}
                            </p>
                          </div>

                          {/* Optimization Results Section */}
                          {test["Optimization Result"] && (
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200">
                              <h4 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                Optimization Results
                              </h4>
                              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {test["Optimization Result"]}
                              </div>
                            </div>
                          )}

                          {/* Metadata Grid */}
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Info size={16} className="text-gray-600" />
                              Test Metadata
                            </h4>
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platform</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test.Platform}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test.Category}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">LOB(s)</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test["LOB(s)"]}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Type(s)</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Type(s)"]}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Section(s)</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Section(s)"]}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Element(s)</span>
                                <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Element(s)"]}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTests.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No experiments found matching your criteria.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredTests.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-6 py-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            {/* Results Info */}
            <div className="text-sm text-gray-700">
              Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-gray-900">{Math.min(endIndex, filteredTests.length)}</span> of{' '}
              <span className="font-bold text-gray-900">{filteredTests.length}</span> results
            </div>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    setSelectedTest(null);
                  }}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                    // Show ellipsis
                    const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          setSelectedTest(null);
                        }}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    setSelectedTest(null);
                  }}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Placeholder Tab Component =====
function PlaceholderTab({ title, description, icon: Icon }) {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center max-w-md">
        <div className="inline-flex p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
          <Icon size={64} className="text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 text-lg">{description}</p>
        <div className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">
          Coming Soon
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN TAB COMPONENT =====
function AdminTab({ testData, setTestData }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewData, setPreviewData] = useState(null);

  // Handle Excel file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate required columns
        const requiredColumns = [
          "Test Launch Date", "Test End Date", "Test Stage", "Summary",
          "Platform", "Category", "LOB(s)", "Country or Countries",
          "Page Type(s)", "Page Section(s)", "Page Element(s)", "Product",
          "Hypothesis", "Optimization Result"
        ];

        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          const missingColumns = requiredColumns.filter(col => !columns.includes(col));
          
          if (missingColumns.length > 0) {
            setUploadStatus(`Error: Missing columns: ${missingColumns.join(", ")}`);
            return;
          }

          setPreviewData(jsonData);
          setUploadStatus(`Preview: ${jsonData.length} experiments loaded. Review and confirm to import.`);
        }
      } catch (error) {
        setUploadStatus(`Error: ${error.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmImport = () => {
    if (previewData) {
      setTestData(previewData);
      setUploadStatus(`Success: ${previewData.length} experiments imported!`);
      setPreviewData(null);
    }
  };

  const cancelImport = () => {
    setPreviewData(null);
    setUploadStatus("");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(testData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Experiments");
    XLSX.writeFile(workbook, `experiments_${new Date().toISOString().split('T')[0]}.xlsx`);
    setUploadStatus("Success: Experiments exported to Excel!");
  };

  const deleteExperiment = (index) => {
    if (window.confirm("Are you sure you want to delete this experiment?")) {
      const newData = testData.filter((_, i) => i !== index);
      setTestData(newData);
      setUploadStatus("Experiment deleted successfully.");
    }
  };

  const downloadTemplate = () => {
    const template = [{
      "Test Launch Date": "2025-01-01",
      "Test End Date": "2025-01-15",
      "Test Stage": "Completed",
      "Summary": "Example Experiment",
      "Platform": "Platform Name",
      "Category": "BAU",
      "LOB(s)": "Multi-LOB",
      "Country or Countries": "United States",
      "Page Type(s)": "Homepage",
      "Page Section(s)": "Hero Banner",
      "Page Element(s)": "CTA",
      "Product": "Product Name",
      "Hypothesis": "Your hypothesis here...",
      "Optimization Result": "Your results here..."
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "experiment_template.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-purple-100 mt-1">Manage your experiment data - Upload, edit, and export</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div className={`p-4 rounded-xl border-2 ${
          uploadStatus.includes("Error") 
            ? "bg-red-50 border-red-400 text-red-800"
            : uploadStatus.includes("Success")
            ? "bg-green-50 border-green-400 text-green-800"
            : "bg-blue-50 border-blue-400 text-blue-800"
        }`}>
          <p className="font-semibold">{uploadStatus}</p>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Upload Excel */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Upload size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upload Excel</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Import experiments from Excel file. File must match the required format.
          </p>
          <label className="block">
            <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-all text-center">
              Choose File
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Download Template */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileSpreadsheet size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Get Template</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download Excel template with correct column format for easy data entry.
          </p>
          <button
            onClick={downloadTemplate}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            Download Template
          </button>
        </div>

        {/* Export Data */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Download size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Export current experiments to Excel for backup or sharing.
          </p>
          <button
            onClick={exportToExcel}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Preview Data Table */}
      {previewData && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Preview Import Data</h3>
            <div className="flex gap-3">
              <button
                onClick={confirmImport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                Confirm Import
              </button>
              <button
                onClick={cancelImport}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <XCircle size={18} />
                Cancel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Summary</th>
                  <th className="px-4 py-2 text-left font-semibold">Stage</th>
                  <th className="px-4 py-2 text-left font-semibold">Launch Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previewData.slice(0, 10).map((exp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{exp.Summary}</td>
                    <td className="px-4 py-2">{exp["Test Stage"]}</td>
                    <td className="px-4 py-2">{exp["Test Launch Date"]}</td>
                    <td className="px-4 py-2">{exp.Product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {previewData.length - 10} more experiments
              </p>
            )}
          </div>
        </div>
      )}

      {/* Current Data Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Current Experiments ({testData.length})</h3>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Summary</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Launch Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testData.map((exp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-600">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{exp.Summary}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {exp["Test Stage"]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exp["Test Launch Date"]}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{exp.Product}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteExperiment(idx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2 mx-auto text-xs"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Info size={20} />
          Excel Format Requirements
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Required Columns:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Test Launch Date, Test End Date, Test Stage</li>
            <li>Summary, Platform, Category, LOB(s)</li>
            <li>Country or Countries, Page Type(s), Page Section(s), Page Element(s)</li>
            <li>Product, Hypothesis, Optimization Result</li>
          </ul>
          <p className="mt-3"><strong>Tips:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Use the template for correct format</li>
            <li>Dates should be in YYYY-MM-DD format</li>
            <li>Test Stage: Completed, Live, Development, Intake, Proposal, Result Analysis, Result Implementation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== Main App Component =====
export default function ExperimentationApp() {
  const [activeTab, setActiveTab] = useState("repository");
  const [testData, setTestData] = useState(INITIAL_TEST_DATA);

  const tabs = [
    { id: "repository", label: "Experiment Overview", icon: BookOpen },
    { id: "sample-size", label: "Sample Size", icon: Calculator },
    { id: "monitoring", label: "Experiment Monitoring", icon: BarChart3 },
    { id: "analysis", label: "Results Analysis", icon: LineChart },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl border-b-4 border-indigo-400">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-2xl border-2 border-white/30">
              <FlaskConical size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                E2E Experimentation Platform
              </h1>
              <p className="text-indigo-100 text-sm mt-1">
                Complete toolkit for planning, running, and analyzing A/B tests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative ${
                    activeTab === tab.id
                      ? "text-indigo-700 bg-gradient-to-b from-purple-50 to-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === "sample-size" && <SampleSizeTab />}
        {activeTab === "analysis" && <ResultsAnalysisComplete />}
        {activeTab === "monitoring" && <TestMonitoringTab testData={testData} />}
        {activeTab === "repository" && <TestRepositoryTab testData={testData} />}
        {activeTab === "admin" && <AdminTab testData={testData} setTestData={setTestData} />}
      </div>
    </div>
  );
}


// import React, { useMemo, useState } from "react";
// import { Calculator, Users, TrendingUp, Info, CheckCircle2, XCircle, AlertTriangle, Calendar, Settings, BarChart3, BookOpen, FlaskConical, Target, LineChart, Grid3x3, Download, Search, Filter, Eye, Clock, Play, Pause, CheckSquare, Upload, Trash2, FileSpreadsheet } from "lucide-react";
// import * as XLSX from "xlsx";
// // import ResultsAnalysisTab from './ResultsAnalysisTab';
// // import ResultsAnalysisTab from './ResultsAnalysisTab_Improved';
// import ResultsAnalysisComplete from './ResultsAnalysisComplete';
// import ExperimentMonitoring from './ExperimentMonitoring';

// import { TEST_DATA } from './allTestsData';
// import { LIVE_TESTS } from './liveTestsData';

// // ===== TEST DATA =====
// const INITIAL_TEST_DATA = [
//   {
//     "Test Launch Date": "2025-02-02",
//     "Test End Date": "2025-02-24",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 1: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z1",
//     "Hypothesis": "ON the Homepage… IF we reposition iPhone assets from Hero Banners into Promo Tiles… THEN overall engagement patterns will shift without hurting downstream KPIs… DUE TO Mac content being more sensitive to high-visibility placements.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-03-03",
//     "Test End Date": "2025-03-08",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 2: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z2",
//     "Hypothesis": "ON Family Page navigation… IF Chapter Nav product ordering is changed from Pro → Consumer… THEN engagement will improve… DUE TO better alignment with shopper browsing expectations.",
//     "Optimization Result": "• Reordering of elements shifted traffic patterns as expected, with meaningful changes in scroll depth and visitation patterns.\n• Engagement lifted in several areas, though downstream metrics remained mixed.\n• Behavioral data suggests strong interaction with the prioritized content.\n• Provides directional insights for future optimization cycles."
//   },
//   {
//     "Test Launch Date": "2025-04-04",
//     "Test End Date": "2025-04-15",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 3: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z3",
//     "Hypothesis": "ON the Family Page… IF Select Moment content is surfaced earlier in the funnel… THEN Add-to-Bag and Buy Flow engagement will increase… DUE TO clearer wayfinding and simplified product comparison.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-05-05",
//     "Test End Date": "2025-05-11",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 4: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z4",
//     "Hypothesis": "ON Landing Pages… IF we elevate Compare before FAQ… THEN progression to product discovery will improve… DUE TO Compare sections providing higher-intent entry pathways.",
//     "Optimization Result": "• Premium-first layout created strong halo effects.\n• Notable increases in detail page traffic and product exploration.\n• Add‑to‑Bag lifts were modest but meaningful.\n• Explore additional messaging variants around flagship heroing."
//   },
//   {
//     "Test Launch Date": "2025-06-06",
//     "Test End Date": "2025-06-21",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 5: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z5",
//     "Hypothesis": "ON Landing Pages… IF we elevate Compare before FAQ… THEN progression to product discovery will improve… DUE TO Compare sections providing higher-intent entry pathways.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-07-07",
//     "Test End Date": "2025-07-16",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 6: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z6",
//     "Hypothesis": "ON the Homepage… IF we reposition iPhone assets from Hero Banners into Promo Tiles… THEN overall engagement patterns will shift without hurting downstream KPIs… DUE TO Mac content being more sensitive to high-visibility placements.",
//     "Optimization Result": "• Removing friction produced smoother navigation flows.\n• Variation showed mixed performance by LOB but strong early-funnel improvements.\n• Cognitive load reduction appears to benefit high-consideration products.\n• Recommended for selective rollout."
//   },
//   {
//     "Test Launch Date": "2025-08-08",
//     "Test End Date": "2025-08-10",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 7: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z7",
//     "Hypothesis": "ON the Homepage… IF we prioritize a premium flagship model in the Hero sequence… THEN overall LOB engagement will rise… DUE TO halo effects created when leading with the highest-end product.",
//     "Optimization Result": "• Reordering of elements shifted traffic patterns as expected, with meaningful changes in scroll depth and visitation patterns.\n• Engagement lifted in several areas, though downstream metrics remained mixed.\n• Behavioral data suggests strong interaction with the prioritized content.\n• Provides directional insights for future optimization cycles."
//   },
//   {
//     "Test Launch Date": "2025-09-09",
//     "Test End Date": "2025-09-16",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 8: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z8",
//     "Hypothesis": "ON DMs… IF we showcase upfront financing options including 0% APR… THEN affordability perception will improve and engagement will rise… DUE TO users receiving early cost-related reassurance.",
//     "Optimization Result": "• Removing friction produced smoother navigation flows.\n• Variation showed mixed performance by LOB but strong early-funnel improvements.\n• Cognitive load reduction appears to benefit high-consideration products.\n• Recommended for selective rollout."
//   },
//   {
//     "Test Launch Date": "2025-10-10",
//     "Test End Date": "2025-10-15",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 9: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z9",
//     "Hypothesis": "ON the Family Page… IF we remove the Welcome Video and elevate key decision-making tiles… THEN users will reach relevant product details faster… DUE TO reduced friction and faster access to structured information.",
//     "Optimization Result": "• Premium-first layout created strong halo effects.\n• Notable increases in detail page traffic and product exploration.\n• Add‑to‑Bag lifts were modest but meaningful.\n• Explore additional messaging variants around flagship heroing."
//   },
//   {
//     "Test Launch Date": "2025-11-11",
//     "Test End Date": "2025-11-27",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 10: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z10",
//     "Hypothesis": "ON the Homepage… IF we prioritize a premium flagship model in the Hero sequence… THEN overall LOB engagement will rise… DUE TO halo effects created when leading with the highest-end product.",
//     "Optimization Result": "• Reordering of elements shifted traffic patterns as expected, with meaningful changes in scroll depth and visitation patterns.\n• Engagement lifted in several areas, though downstream metrics remained mixed.\n• Behavioral data suggests strong interaction with the prioritized content.\n• Provides directional insights for future optimization cycles."
//   },
//   {
//     "Test Launch Date": "2025-12-12",
//     "Test End Date": "2025-12-19",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 11: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z11",
//     "Hypothesis": "ON DMs… IF we showcase upfront financing options including 0% APR… THEN affordability perception will improve and engagement will rise… DUE TO users receiving early cost-related reassurance.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-01-13",
//     "Test End Date": "2025-01-17",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 12: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z12",
//     "Hypothesis": "ON Landing Pages… IF we elevate Compare before FAQ… THEN progression to product discovery will improve… DUE TO Compare sections providing higher-intent entry pathways.",
//     "Optimization Result": "• Removing friction produced smoother navigation flows.\n• Variation showed mixed performance by LOB but strong early-funnel improvements.\n• Cognitive load reduction appears to benefit high-consideration products.\n• Recommended for selective rollout."
//   },
//   {
//     "Test Launch Date": "2025-02-14",
//     "Test End Date": "2025-02-28",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 13: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z13",
//     "Hypothesis": "ON Family Page navigation… IF Chapter Nav product ordering is changed from Pro → Consumer… THEN engagement will improve… DUE TO better alignment with shopper browsing expectations.",
//     "Optimization Result": "• Premium-first layout created strong halo effects.\n• Notable increases in detail page traffic and product exploration.\n• Add‑to‑Bag lifts were modest but meaningful.\n• Explore additional messaging variants around flagship heroing."
//   },
//   {
//     "Test Launch Date": "2025-03-15",
//     "Test End Date": "2025-03-29",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 14: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z14",
//     "Hypothesis": "ON Email DMs… IF launch communications are sent at the time users are most active… THEN CTR and conversions will increase… DUE TO improved alignment with customer daily purchase intent.",
//     "Optimization Result": "• Removing friction produced smoother navigation flows.\n• Variation showed mixed performance by LOB but strong early-funnel improvements.\n• Cognitive load reduction appears to benefit high-consideration products.\n• Recommended for selective rollout."
//   },
//   {
//     "Test Launch Date": "2025-04-16",
//     "Test End Date": "2025-04-24",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 15: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z15",
//     "Hypothesis": "ON the Homepage… IF we reposition iPhone assets from Hero Banners into Promo Tiles… THEN overall engagement patterns will shift without hurting downstream KPIs… DUE TO Mac content being more sensitive to high-visibility placements.",
//     "Optimization Result": "• Premium-first layout created strong halo effects.\n• Notable increases in detail page traffic and product exploration.\n• Add‑to‑Bag lifts were modest but meaningful.\n• Explore additional messaging variants around flagship heroing."
//   },
//   {
//     "Test Launch Date": "2025-05-17",
//     "Test End Date": "2025-05-22",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 16: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z16",
//     "Hypothesis": "ON DMs… IF we showcase upfront financing options including 0% APR… THEN affordability perception will improve and engagement will rise… DUE TO users receiving early cost-related reassurance.",
//     "Optimization Result": "• Reordering of elements shifted traffic patterns as expected, with meaningful changes in scroll depth and visitation patterns.\n• Engagement lifted in several areas, though downstream metrics remained mixed.\n• Behavioral data suggests strong interaction with the prioritized content.\n• Provides directional insights for future optimization cycles."
//   },
//   {
//     "Test Launch Date": "2025-06-18",
//     "Test End Date": "2025-06-25",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 17: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z17",
//     "Hypothesis": "ON the Family Page… IF Select Moment content is surfaced earlier in the funnel… THEN Add-to-Bag and Buy Flow engagement will increase… DUE TO clearer wayfinding and simplified product comparison.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-07-19",
//     "Test End Date": "2025-07-30",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 18: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 1, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z18",
//     "Hypothesis": "ON Email DMs… IF launch communications are sent at the time users are most active… THEN CTR and conversions will increase… DUE TO improved alignment with customer daily purchase intent.",
//     "Optimization Result": "• Select Moment elevation improved early-to-mid funnel KPIs.\n• Buy Flow, ATB, and click depth metrics showed consistent uplift.\n• Performance stable across geography.\n• Strong candidate for broader deployment."
//   },
//   {
//     "Test Launch Date": "2025-08-20",
//     "Test End Date": "2025-08-28",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 19: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 2, Promo Tile 2, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z19",
//     "Hypothesis": "ON Landing Pages… IF we elevate Compare before FAQ… THEN progression to product discovery will improve… DUE TO Compare sections providing higher-intent entry pathways.",
//     "Optimization Result": "• Premium-first layout created strong halo effects.\n• Notable increases in detail page traffic and product exploration.\n• Add‑to‑Bag lifts were modest but meaningful.\n• Explore additional messaging variants around flagship heroing."
//   },
//   {
//     "Test Launch Date": "2025-09-21",
//     "Test End Date": "2025-09-27",
//     "Test Stage": "Completed",
//     "Summary": "Experiment Variation 20: Page Optimization Test",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Multi-LOB",
//     "Country or Countries": "United States, France, Japan",
//     "Page Type(s)": "Homepage / Family Page",
//     "Page Section(s)": "Hero Banner 3, Promo Tile 1, Select Moment",
//     "Page Element(s)": "CTA, Image Link, Product Card",
//     "Product": "Product Model Z20",
//     "Hypothesis": "ON the Homepage… IF we prioritize a premium flagship model in the Hero sequence… THEN overall LOB engagement will rise… DUE TO halo effects created when leading with the highest-end product.",
//     "Optimization Result": "• Removing friction produced smoother navigation flows.\n• Variation showed mixed performance by LOB but strong early-funnel improvements.\n• Cognitive load reduction appears to benefit high-consideration products.\n• Recommended for selective rollout."
//   },
//   {
//     "Test Launch Date": "2025-10-22",
//     "Test End Date": "2025-11-05",
//     "Test Stage": "Live",
//     "Summary": "In‑Progress Experiment 21: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 1, Explore Tile 2",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q21",
//     "Hypothesis": "ON the Family Page… IF we remove the Welcome Video and elevate key decision-making tiles… THEN users will reach relevant product details faster… DUE TO reduced friction and faster access to structured information.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-11-23",
//     "Test End Date": "2025-12-12",
//     "Test Stage": "Result Implementation",
//     "Summary": "In‑Progress Experiment 22: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 2, Explore Tile 3",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q22",
//     "Hypothesis": "ON Homepage content hierarchy… IF we rearrange Hero Banner and Promo Tile ordering… THEN cross-LOB visitation will rebalance… DUE TO different elasticity across product categories.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-12-24",
//     "Test End Date": "2026-01-13",
//     "Test Stage": "Intake",
//     "Summary": "In‑Progress Experiment 23: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 3, Explore Tile 4",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q23",
//     "Hypothesis": "ON Family Page navigation… IF Chapter Nav product ordering is changed from Pro → Consumer… THEN engagement will improve… DUE TO better alignment with shopper browsing expectations.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-01-25",
//     "Test End Date": "2025-02-18",
//     "Test Stage": "Development",
//     "Summary": "In‑Progress Experiment 24: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 1, Explore Tile 1",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q24",
//     "Hypothesis": "ON the Homepage… IF we reposition iPhone assets from Hero Banners into Promo Tiles… THEN overall engagement patterns will shift without hurting downstream KPIs… DUE TO Mac content being more sensitive to high-visibility placements.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-02-26",
//     "Test End Date": "2025-03-08",
//     "Test Stage": "Result Analysis",
//     "Summary": "In‑Progress Experiment 25: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 2, Explore Tile 2",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q25",
//     "Hypothesis": "ON the Homepage… IF we prioritize a premium flagship model in the Hero sequence… THEN overall LOB engagement will rise… DUE TO halo effects created when leading with the highest-end product.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-03-27",
//     "Test End Date": "2025-04-19",
//     "Test Stage": "Result Analysis",
//     "Summary": "In‑Progress Experiment 26: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 3, Explore Tile 3",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q26",
//     "Hypothesis": "ON the Family Page… IF Select Moment content is surfaced earlier in the funnel… THEN Add-to-Bag and Buy Flow engagement will increase… DUE TO clearer wayfinding and simplified product comparison.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-04-01",
//     "Test End Date": "2025-04-10",
//     "Test Stage": "Intake",
//     "Summary": "In‑Progress Experiment 27: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 1, Explore Tile 4",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q27",
//     "Hypothesis": "ON the Family Page… IF we remove the Welcome Video and elevate key decision-making tiles… THEN users will reach relevant product details faster… DUE TO reduced friction and faster access to structured information.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-05-02",
//     "Test End Date": "2025-05-17",
//     "Test Stage": "Proposal",
//     "Summary": "In‑Progress Experiment 28: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 2, Explore Tile 1",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q28",
//     "Hypothesis": "ON Family Page navigation… IF Chapter Nav product ordering is changed from Pro → Consumer… THEN engagement will improve… DUE TO better alignment with shopper browsing expectations.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-06-03",
//     "Test End Date": "2025-06-25",
//     "Test Stage": "Result Implementation",
//     "Summary": "In‑Progress Experiment 29: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 3, Explore Tile 2",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q29",
//     "Hypothesis": "ON Family Page navigation… IF Chapter Nav product ordering is changed from Pro → Consumer… THEN engagement will improve… DUE TO better alignment with shopper browsing expectations.",
//     "Optimization Result": null
//   },
//   {
//     "Test Launch Date": "2025-07-04",
//     "Test End Date": "2025-07-23",
//     "Test Stage": "Live",
//     "Summary": "In‑Progress Experiment 30: Funnel Optimization Study",
//     "Platform": "ShopNow.com",
//     "Category": "BAU",
//     "LOB(s)": "Electronics, MultiLOB",
//     "Country or Countries": "Germany, Canada",
//     "Page Type(s)": "Homepage",
//     "Page Section(s)": "Hero Banner 1, Explore Tile 3",
//     "Page Element(s)": "CTA, Product Card",
//     "Product": "Product Variant Q30",
//     "Hypothesis": "ON Email DMs… IF launch communications are sent at the time users are most active… THEN CTR and conversions will increase… DUE TO improved alignment with customer daily purchase intent.",
//     "Optimization Result": null
//   }
// ];

// // ===== Helpers: Normal CDF inverse (Acklam approximation) =====
// function normSInv(p) {
//   const _p = Math.min(Math.max(p, 1e-12), 1 - 1e-12);
//   const a = [
//     -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
//     1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00,
//   ];
//   const b = [
//     -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
//     6.680131188771972e+01, -1.328068155288572e+01,
//   ];
//   const c = [
//     -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
//     -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00,
//   ];
//   const d = [
//     7.784695709041462e-03, 3.224671290700398e-01,
//     2.445134137142996e+00, 3.754408661907416e+00,
//   ];

//   const plow = 0.02425;
//   const phigh = 1 - plow;
//   let q, r;

//   if (_p < plow) {
//     q = Math.sqrt(-2 * Math.log(_p));
//     return (
//       (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
//       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
//     );
//   }
//   if (phigh < _p) {
//     q = Math.sqrt(-2 * Math.log(1 - _p));
//     return -(
//       (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
//       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
//     );
//   }
//   q = _p - 0.5;
//   r = q * q;
//   return (
//     (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
//     (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
//   );
// }

// function zFromAlpha(alpha, tails) {
//   return tails === 2 ? normSInv(1 - alpha / 2) : normSInv(1 - alpha);
// }

// function ceilPositive(x) {
//   return Math.max(0, Math.ceil(x));
// }

// function normCDF(z) {
//   const t = 1 / (1 + 0.2316419 * Math.abs(z));
//   const d = 0.3989423 * Math.exp(-z * z / 2);
//   const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
//   return z > 0 ? 1 - prob : prob;
// }

// // ===== Core math =====
// function nProportions({ pA, pB, alpha, power, tails, ratio }) {
//   const delta = Math.abs(pB - pA);
//   if (delta <= 0) return { nA: 0, nB: 0, total: 0 };
//   const zAlpha = zFromAlpha(alpha, tails);
//   const zBeta = normSInv(power);
//   const qA = 1 - pA;
//   const qB = 1 - pB;
//   const r = ratio;

//   const termAlpha = zAlpha * Math.sqrt(pA * qA * (1 + 1 / r));
//   const termBeta = zBeta * Math.sqrt(pA * qA + (pB * qB) / r);
//   const nA = ((termAlpha + termBeta) ** 2) / (delta ** 2);
//   const nB = r * nA;
//   return { nA, nB, total: nA + nB };
// }

// function nMeans({ sdA, sdB, delta, alpha, power, tails, ratio }) {
//   const zAlpha = zFromAlpha(alpha, tails);
//   const zBeta = normSInv(power);
//   const r = ratio;
//   const nA = ((zAlpha + zBeta) ** 2) * (sdA ** 2 + (sdB ** 2) / r) / (delta ** 2);
//   const nB = r * nA;
//   return { nA, nB, total: nA + nB };
// }

// function NumberInput({ label, value, onChange, step = 0.01, min, max, suffix, helpText, isPercentage = false }) {
//   const displayValue = isPercentage ? (value * 100) : value;
//   const displayStep = isPercentage ? (step * 100) : step;
//   const displayMin = isPercentage && min !== undefined ? (min * 100) : min;
//   const displayMax = isPercentage && max !== undefined ? (max * 100) : max;
  
//   return (
//     <label className="flex flex-col gap-2">
//       <span className="text-sm font-semibold text-gray-700">{label}</span>
//       <div className="flex items-center gap-2">
//         <input
//           type="number"
//           className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
//           value={Number.isFinite(displayValue) ? (isPercentage ? displayValue.toFixed(1) : displayValue) : 0}
//           step={displayStep}
//           min={displayMin}
//           max={displayMax}
//           onChange={(e) => {
//             const v = parseFloat(e.target.value);
//             const actualValue = isPercentage ? v / 100 : v;
//             onChange(Number.isFinite(actualValue) ? actualValue : 0);
//           }}
//         />
//         {suffix && <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{suffix}</span>}
//       </div>
//       {helpText && <span className="text-xs text-gray-500 leading-relaxed">{helpText}</span>}
//     </label>
//   );
// }

// function TestBadge({ pass, msg }) {
//   return (
//     <div className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
//       pass ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
//     }`}>
//       {pass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
//       {msg}
//     </div>
//   );
// }

// function runTests() {
//   const alpha = 0.05;
//   const power = 0.8;
//   const tailsTwo = 2;
//   const tailsOne = 1;
//   const results = [];

//   const base = 0.05;
//   const r1 = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
//   const r2 = nProportions({ pA: base, pB: base + 0.02, alpha, power, tails: tailsTwo, ratio: 1 });
//   results.push({ pass: r2.total < r1.total, msg: "Larger MDE → smaller sample" });

//   const rTwo = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
//   const rOne = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsOne, ratio: 1 });
//   results.push({ pass: rOne.total < rTwo.total, msg: "One-tailed < two-tailed" });

//   const rEq = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 1 });
//   const rSkew = nProportions({ pA: base, pB: base + 0.01, alpha, power, tails: tailsTwo, ratio: 2 });
//   results.push({ pass: rSkew.nA < rEq.nA && rSkew.nB > rEq.nB, msg: "Allocation affects group sizes" });

//   return results;
// }

// function SectionDivider({ icon: Icon, title }) {
//   return (
//     <div className="relative my-6">
//       <div className="absolute inset-0 flex items-center" aria-hidden="true">
//         <div className="w-full border-t-2 border-gray-300"></div>
//       </div>
//       <div className="relative flex justify-center">
//         <span className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 px-6 py-2 rounded-full border-2 border-gray-300 shadow-lg">
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg">
//               <Icon size={18} className="text-white" />
//             </div>
//             <span className="text-lg font-bold text-gray-800">{title}</span>
//           </div>
//         </span>
//       </div>
//     </div>
//   );
// }

// // ===== Sample Size Calculator (Single Scenario) =====
// function SingleScenarioCalculator() {
//   const [mode, setMode] = useState("two-prop");
//   const [alpha, setAlpha] = useState(0.05);
//   const [power, setPower] = useState(0.8);
//   const [tails, setTails] = useState(2);
//   const ratio = 1;
//   const [baselineRate, setBaselineRate] = useState(0.05);
//   const [effectType, setEffectType] = useState("relative");
//   const [mdeValue, setMdeValue] = useState(0.05);
//   const [meanA, setMeanA] = useState(100);
//   const [meanB, setMeanB] = useState(105);
//   const [sdA, setSdA] = useState(15);
//   const [sdB, setSdB] = useState(15);
//   const [numVariations, setNumVariations] = useState(2);
//   const [useBonferroni, setUseBonferroni] = useState(true);
//   const [dropoffRate, setDropoffRate] = useState(0);
//   const [avgDailyTraffic, setAvgDailyTraffic] = useState(100000);

//   const { pA, pB } = useMemo(() => {
//     if (mode === "two-prop") {
//       const pA = baselineRate;
//       let pB;
//       if (effectType === "relative") {
//         pB = pA * (1 + mdeValue);
//       } else {
//         pB = pA + mdeValue;
//       }
//       return { pA, pB };
//     }
//     return { pA: 0, pB: 0 };
//   }, [mode, baselineRate, effectType, mdeValue]);

//   const computed = useMemo(() => {
//     const numComparisons = numVariations;
//     const alphaBonf = useBonferroni ? alpha / numComparisons : alpha;

//     let baseResult;
//     if (mode === "two-prop") {
//       baseResult = nProportions({ pA, pB, alpha: alphaBonf, power, tails, ratio });
//     } else {
//       const delta = Math.abs(meanB - meanA);
//       baseResult = nMeans({ sdA, sdB, delta, alpha: alphaBonf, power, tails, ratio });
//     }

//     const nControl = ceilPositive(baseResult.nA);
//     const nPerVariation = ceilPositive(baseResult.nB);
//     const subtotal = nControl + nPerVariation * numVariations;

//     const nControlWithDropoff = dropoffRate > 0 ? ceilPositive(nControl / (1 - dropoffRate)) : nControl;
//     const nPerVariationWithDropoff = dropoffRate > 0 ? ceilPositive(nPerVariation / (1 - dropoffRate)) : nPerVariation;
//     const totalWithDropoff = nControlWithDropoff + nPerVariationWithDropoff * numVariations;

//     const finalTotal = dropoffRate > 0 ? totalWithDropoff : subtotal;
//     const daysNeeded = avgDailyTraffic > 0 ? finalTotal / avgDailyTraffic : 0;
//     const weeksNeeded = daysNeeded / 7;

//     return {
//       nControl,
//       nPerVariation,
//       subtotal,
//       nControlWithDropoff,
//       nPerVariationWithDropoff,
//       totalWithDropoff,
//       numVariations,
//       daysNeeded,
//       weeksNeeded,
//     };
//   }, [mode, pA, pB, meanA, meanB, sdA, sdB, alpha, power, tails, ratio, numVariations, useBonferroni, dropoffRate, avgDailyTraffic]);

//   const displayMDE = mode === "two-prop" ? Math.abs(pB - pA) : Math.abs(meanB - meanA);

//   return (
//     <div className="space-y-8">
//       <SectionDivider icon={Settings} title="Input Parameters" />

//       <div className="grid grid-cols-2 gap-6">
//         {/* Test Configuration Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//               <Target size={20} className="text-indigo-600" />
//             </div>
//             Test Configuration
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Metric Type</label>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setMode("two-prop")}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     mode === "two-prop"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Proportions (Conversion Rate)
//                 </button>
//                 <button
//                   onClick={() => setMode("two-means")}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     mode === "two-means"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Means (Average Value)
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Test Type</label>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setTails(2)}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     tails === 2
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Two-tailed (detects ↑ or ↓)
//                 </button>
//                 <button
//                   onClick={() => setTails(1)}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     tails === 1
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   One-tailed (detects ↑ only)
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Use two-tailed unless you have strong directional hypothesis</p>
//             </div>
//           </div>
//         </div>

//         {/* Statistical Parameters Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//               <BarChart3 size={20} className="text-indigo-600" />
//             </div>
//             Statistical Parameters
//           </h3>
//           <div className="space-y-4">
//             <NumberInput
//               label="Significance Level (α)"
//               value={alpha}
//               onChange={setAlpha}
//               step={0.01}
//               min={0.01}
//               max={0.2}
//               isPercentage={true}
//               suffix="%"
//               helpText="Probability of false positive (Type I error). Common: 5%"
//             />
//             <NumberInput
//               label="Statistical Power (1-β)"
//               value={power}
//               onChange={setPower}
//               step={0.05}
//               min={0.5}
//               max={0.99}
//               isPercentage={true}
//               suffix="%"
//               helpText="Probability of detecting a true effect. Common: 80%"
//             />
//             <label className="flex flex-col gap-2">
//               <span className="text-sm font-semibold text-gray-700">Bonferroni Correction</span>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setUseBonferroni(!useBonferroni)}
//                   className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
//                     useBonferroni ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
//                       useBonferroni ? "translate-x-6" : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//                 <span className="text-sm text-gray-700 font-medium">
//                   {useBonferroni ? "Enabled" : "Disabled"}
//                 </span>
//               </div>
//               <span className="text-xs text-gray-500">
//                 {useBonferroni 
//                   ? "Adjusts α for multiple comparisons to control family-wise error rate"
//                   : "No adjustment for multiple variations (increases Type I error risk)"
//                 }
//               </span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Metric Values Card */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//             <TrendingUp size={20} className="text-indigo-600" />
//           </div>
//           {mode === "two-prop" ? "Conversion Rate Configuration" : "Mean Values Configuration"}
//         </h3>
        
//         {mode === "two-prop" ? (
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Effect Type</label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => {
//                     setEffectType("relative");
//                     setMdeValue(0.05);
//                   }}
//                   className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     effectType === "relative"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Relative Lift
//                 </button>
//                 <button
//                   onClick={() => {
//                     setEffectType("absolute");
//                     setMdeValue(0.005);
//                   }}
//                   className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     effectType === "absolute"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Absolute Lift
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Baseline Rate (Control)"
//                 value={baselineRate}
//                 onChange={setBaselineRate}
//                 step={0.01}
//                 min={0.01}
//                 max={0.99}
//                 isPercentage={true}
//                 suffix="%"
//                 helpText="Current conversion rate in control group"
//               />

//               <NumberInput
//                 label={effectType === "relative" ? "Minimum Detectable Effect (Relative)" : "Minimum Detectable Effect (Absolute)"}
//                 value={mdeValue}
//                 onChange={setMdeValue}
//                 step={effectType === "relative" ? 0.01 : 0.001}
//                 min={effectType === "relative" ? 0.01 : 0.001}
//                 max={effectType === "relative" ? 2 : 0.5}
//                 isPercentage={true}
//                 suffix="%"
//                 helpText={
//                   effectType === "relative"
//                     ? `Relative change from baseline (e.g., 5% means ${(baselineRate * 100).toFixed(1)}% → ${(baselineRate * (1 + mdeValue) * 100).toFixed(2)}%)`
//                     : `Absolute change in percentage points (e.g., 0.5pp means ${(baselineRate * 100).toFixed(1)}% → ${((baselineRate + mdeValue) * 100).toFixed(2)}%)`
//                 }
//               />
//             </div>

//             <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div className="text-left">
//                   <div className="text-gray-600 font-medium mb-1">Control Rate</div>
//                   <div className="text-2xl font-bold text-gray-900">{(pA * 100).toFixed(2)}%</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-gray-600 font-medium mb-1">Variation Rate</div>
//                   <div className="text-2xl font-bold text-indigo-700">{(pB * 100).toFixed(2)}%</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-gray-600 font-medium mb-1">Effect Size</div>
//                   <div className="text-2xl font-bold text-purple-700">
//                     {effectType === "relative" 
//                       ? `${(mdeValue * 100).toFixed(1)}%`
//                       : `${(Math.abs(pB - pA) * 100).toFixed(2)}pp`
//                     }
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Control Mean"
//                 value={meanA}
//                 onChange={setMeanA}
//                 step={1}
//                 helpText="Average value in control group"
//               />
//               <NumberInput
//                 label="Variation Mean"
//                 value={meanB}
//                 onChange={setMeanB}
//                 step={1}
//                 helpText="Expected average in variation"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Control Std Dev (σ)"
//                 value={sdA}
//                 onChange={setSdA}
//                 step={1}
//                 min={0.1}
//                 helpText="Standard deviation in control"
//               />
//               <NumberInput
//                 label="Variation Std Dev (σ)"
//                 value={sdB}
//                 onChange={setSdB}
//                 step={1}
//                 min={0.1}
//                 helpText="Standard deviation in variation"
//               />
//             </div>
//             <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-semibold text-gray-700">Minimum Detectable Effect (MDE):</span>
//                 <span className="text-2xl font-bold text-indigo-700">
//                   {displayMDE.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Test Variations & Traffic Settings Card */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//             <Users size={20} className="text-indigo-600" />
//           </div>
//           Test Variations & Traffic
//         </h3>
//         <div className="grid grid-cols-3 gap-6">
//           <NumberInput
//             label="Number of Variations"
//             value={numVariations}
//             onChange={setNumVariations}
//             step={1}
//             min={1}
//             max={10}
//             helpText={`Testing ${numVariations} variation${numVariations > 1 ? 's' : ''} against control${useBonferroni && numVariations > 1 ? ' (Bonferroni corrected)' : ''}`}
//           />
//           <NumberInput
//             label="Average Daily Traffic"
//             value={avgDailyTraffic}
//             onChange={setAvgDailyTraffic}
//             step={100}
//             min={0}
//             helpText="Average number of users per day"
//           />
//           <NumberInput
//             label="Expected Drop-off Rate"
//             value={dropoffRate}
//             onChange={setDropoffRate}
//             step={0.01}
//             min={0}
//             max={0.5}
//             isPercentage={true}
//             suffix="%"
//             helpText="Users who drop out before test completion"
//           />
//         </div>
//       </div>

//       {/* SECTION 2: RESULTS */}
//       <SectionDivider icon={Calculator} title="Sample Size Results" />

//       <div className="grid grid-cols-2 gap-6">
//         {/* Sample Size Results Card */}
//         <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white border-4 border-indigo-400">
//           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//             <Users size={28} />
//             Required Sample Size
//           </h2>
          
//           <div className="space-y-4">
//             <div className="bg-white/20 backdrop-blur rounded-xl p-5 border border-white/30">
//               <div className="text-sm text-indigo-100 mb-3 uppercase tracking-wide font-semibold">Total Sample Needed</div>
//               <div className="text-5xl font-bold mb-2">
//                 {dropoffRate > 0 ? computed.totalWithDropoff.toLocaleString() : computed.subtotal.toLocaleString()}
//               </div>
//               <div className="text-xs text-indigo-100">
//                 {computed.numVariations === 1 ? '1 control + 1 variation' : `1 control + ${computed.numVariations} variations`}
//               </div>
//             </div>

//             {/* Breakdown */}
//             <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
//               <div className="text-xs uppercase tracking-wide font-semibold mb-3 text-indigo-50">Group Breakdown</div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between items-center pb-2 border-b border-white/20">
//                   <span className="text-indigo-100">Control</span>
//                   <span className="font-semibold">{dropoffRate > 0 ? computed.nControlWithDropoff.toLocaleString() : computed.nControl.toLocaleString()}</span>
//                 </div>
//                 {Array.from({ length: numVariations }).map((_, i) => (
//                   <div key={i} className="flex justify-between items-center">
//                     <span className="text-indigo-100">Variation {String.fromCharCode(66 + i)}</span>
//                     <span className="font-semibold">{dropoffRate > 0 ? computed.nPerVariationWithDropoff.toLocaleString() : computed.nPerVariation.toLocaleString()}</span>
//                   </div>
//                 ))}
//                 <div className="border-t-2 border-white/30 pt-2 mt-2 flex justify-between items-center font-bold text-base">
//                   <span>Total</span>
//                   <span>{dropoffRate > 0 ? computed.totalWithDropoff.toLocaleString() : computed.subtotal.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20">
//             <div className="flex items-start gap-2">
//               <Info size={16} className="mt-0.5 flex-shrink-0" />
//               <div className="text-xs text-indigo-50">
//                 <p className="font-semibold mb-1">Methodology:</p>
//                 <p>Normal-theory formulas with unpooled variance. Multiple variations use Bonferroni correction.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Test Duration Card */}
//         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-emerald-400">
//           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//             <Calendar size={28} />
//             Test Duration
//           </h2>
          
//           {avgDailyTraffic > 0 && (
//             <div className="space-y-3">
//               <div className="bg-white/20 backdrop-blur rounded-xl p-5 border border-white/30">
//                 <div className="text-sm text-emerald-100 mb-3 uppercase tracking-wide">Duration Required</div>
//                 <div className="flex items-baseline gap-4">
//                   <div>
//                     <div className="text-5xl font-bold">{Math.ceil(computed.daysNeeded)}</div>
//                     <div className="text-sm text-emerald-100 mt-1">days</div>
//                   </div>
//                   <div className="text-3xl text-emerald-200">≈</div>
//                   <div>
//                     <div className="text-4xl font-bold">{computed.weeksNeeded.toFixed(1)}</div>
//                     <div className="text-sm text-emerald-100 mt-1">weeks</div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-sm text-emerald-50 border border-white/20">
//                 <div className="flex justify-between mb-2">
//                   <span>Daily traffic:</span>
//                   <span className="font-semibold">{avgDailyTraffic.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Total sample needed:</span>
//                   <span className="font-semibold">{(dropoffRate > 0 ? computed.totalWithDropoff : computed.subtotal).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t border-white/20">
//                   <span>Days to reach sample:</span>
//                   <span className="font-semibold">{computed.daysNeeded.toFixed(1)} days</span>
//                 </div>
//               </div>
              
//               {computed.daysNeeded < 7 && (
//                 <div className="bg-yellow-400/20 backdrop-blur rounded-lg p-3 text-xs text-yellow-50 border border-yellow-300/30">
//                   <strong>⚠️ Short test duration:</strong> Tests under 1 week may not capture weekly patterns or be affected by day-of-week variations.
//                 </div>
//               )}
              
//               {computed.daysNeeded > 28 && (
//                 <div className="bg-blue-400/20 backdrop-blur rounded-lg p-3 text-xs text-blue-50 border border-blue-300/30">
//                   <strong>ℹ️ Long test duration:</strong> Consider increasing traffic allocation or reducing MDE if a {Math.ceil(computed.daysNeeded)}-day test is too long.
//                 </div>
//               )}
//             </div>
//           )}

//           {avgDailyTraffic === 0 && (
//             <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
//               <p className="text-sm text-emerald-50">
//                 Enter your average daily traffic in the "Test Variations & Traffic" section to calculate test duration.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== Multiple Scenarios Calculator =====
// function MultipleScenarios() {
//   const [mode, setMode] = useState("two-prop");
//   const [alphaValues, setAlphaValues] = useState("1, 5, 10");
//   const [power, setPower] = useState(0.8);
//   const [tails, setTails] = useState(2);
//   const ratio = 1;
//   const [baselineRate, setBaselineRate] = useState(0.05);
//   const [effectType, setEffectType] = useState("relative");
//   const [mdeValues, setMdeValues] = useState("1, 3, 5, 8");
//   const [meanA, setMeanA] = useState(100);
//   const [meanB, setMeanB] = useState(105);
//   const [sdA, setSdA] = useState(15);
//   const [sdB, setSdB] = useState(15);
//   const [numVariations, setNumVariations] = useState(2);
//   const [useBonferroni, setUseBonferroni] = useState(true);
//   const [dropoffRate, setDropoffRate] = useState(0);
//   const [avgDailyTraffic, setAvgDailyTraffic] = useState(100000);

//   const scenarios = useMemo(() => {
//     const alphas = alphaValues.split(',').map(v => parseFloat(v.trim()) / 100).filter(v => !isNaN(v) && v > 0 && v < 1);
//     const mdes = mdeValues.split(',').map(v => parseFloat(v.trim()) / 100).filter(v => !isNaN(v) && v > 0);
    
//     const results = [];
    
//     for (const alpha of alphas) {
//       for (const mdeValue of mdes) {
//         const alphaBonf = useBonferroni ? alpha / numVariations : alpha;
        
//         let pA, pB;
//         if (mode === "two-prop") {
//           if (effectType === "relative") {
//             pA = baselineRate;
//             pB = pA * (1 + mdeValue);
//           } else {
//             pA = baselineRate;
//             pB = pA + mdeValue;
//           }
          
//           const baseResult = nProportions({ pA, pB, alpha: alphaBonf, power, tails, ratio });
//           const nControl = ceilPositive(baseResult.nA);
//           const nPerVariation = ceilPositive(baseResult.nB);
//           const subtotal = nControl + nPerVariation * numVariations;
          
//           const nControlWithDropoff = dropoffRate > 0 ? ceilPositive(nControl / (1 - dropoffRate)) : nControl;
//           const nPerVariationWithDropoff = dropoffRate > 0 ? ceilPositive(nPerVariation / (1 - dropoffRate)) : nPerVariation;
//           const totalWithDropoff = nControlWithDropoff + nPerVariationWithDropoff * numVariations;
          
//           const finalTotal = dropoffRate > 0 ? totalWithDropoff : subtotal;
//           const daysNeeded = avgDailyTraffic > 0 ? finalTotal / avgDailyTraffic : 0;
          
//           results.push({
//             alpha: alpha * 100,
//             mde: mdeValue * 100,
//             controlRate: pA * 100,
//             variationRate: pB * 100,
//             numVariations: numVariations,
//             nControl: dropoffRate > 0 ? nControlWithDropoff : nControl,
//             nPerVariation: dropoffRate > 0 ? nPerVariationWithDropoff : nPerVariation,
//             totalSample: finalTotal,
//             daysNeeded: Math.ceil(daysNeeded),
//             weeksNeeded: (daysNeeded / 7).toFixed(1)
//           });
//         }
//       }
//     }
    
//     return results;
//   }, [alphaValues, mdeValues, mode, power, tails, baselineRate, effectType, numVariations, useBonferroni, dropoffRate, avgDailyTraffic]);

//   return (
//     <div className="space-y-8">
//       <SectionDivider icon={Settings} title="Input Parameters" />

//       <div className="grid grid-cols-2 gap-6">
//         {/* Test Configuration Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//               <Target size={20} className="text-indigo-600" />
//             </div>
//             Test Configuration
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Metric Type</label>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setMode("two-prop")}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     mode === "two-prop"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Proportions (Conversion Rate)
//                 </button>
//                 <button
//                   onClick={() => setMode("two-means")}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     mode === "two-means"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Means (Average Value)
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Test Type</label>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setTails(2)}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     tails === 2
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Two-tailed (detects ↑ or ↓)
//                 </button>
//                 <button
//                   onClick={() => setTails(1)}
//                   className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     tails === 1
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   One-tailed (detects ↑ only)
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Use two-tailed unless you have strong directional hypothesis</p>
//             </div>
//           </div>
//         </div>

//         {/* Statistical Parameters Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//               <BarChart3 size={20} className="text-indigo-600" />
//             </div>
//             Statistical Parameters
//           </h3>
//           <div className="space-y-4">
//             <label className="flex flex-col gap-2">
//               <span className="text-sm font-semibold text-gray-700">Significance Levels (α) - comma separated</span>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
//                   value={alphaValues}
//                   onChange={(e) => setAlphaValues(e.target.value)}
//                   placeholder="1, 5, 10"
//                 />
//                 <span className="text-sm font-medium text-gray-600 whitespace-nowrap">%</span>
//               </div>
//               <span className="text-xs text-gray-500">Enter multiple values (e.g., "1, 5, 10" for 1%, 5%, 10%)</span>
//             </label>

//             <NumberInput
//               label="Statistical Power (1-β)"
//               value={power}
//               onChange={setPower}
//               step={0.05}
//               min={0.5}
//               max={0.99}
//               isPercentage={true}
//               suffix="%"
//               helpText="Probability of detecting a true effect. Common: 80%"
//             />
//             <label className="flex flex-col gap-2">
//               <span className="text-sm font-semibold text-gray-700">Bonferroni Correction</span>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setUseBonferroni(!useBonferroni)}
//                   className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
//                     useBonferroni ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
//                       useBonferroni ? "translate-x-6" : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//                 <span className="text-sm text-gray-700 font-medium">
//                   {useBonferroni ? "Enabled" : "Disabled"}
//                 </span>
//               </div>
//               <span className="text-xs text-gray-500">
//                 {useBonferroni 
//                   ? "Adjusts α for multiple comparisons to control family-wise error rate"
//                   : "No adjustment for multiple variations (increases Type I error risk)"
//                 }
//               </span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Metric Values Card */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//             <TrendingUp size={20} className="text-indigo-600" />
//           </div>
//           {mode === "two-prop" ? "Conversion Rate Configuration" : "Mean Values Configuration"}
//         </h3>
        
//         {mode === "two-prop" ? (
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-3 block">Effect Type</label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => {
//                     setEffectType("relative");
//                     setMdeValues("1, 3, 5, 8");
//                   }}
//                   className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     effectType === "relative"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Relative Lift
//                 </button>
//                 <button
//                   onClick={() => {
//                     setEffectType("absolute");
//                     setMdeValues("0.5, 1, 1.5, 2");
//                   }}
//                   className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
//                     effectType === "absolute"
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Absolute Lift
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Baseline Rate (Control)"
//                 value={baselineRate}
//                 onChange={setBaselineRate}
//                 step={0.01}
//                 min={0.01}
//                 max={0.99}
//                 isPercentage={true}
//                 suffix="%"
//                 helpText="Current conversion rate in control group"
//               />

//               <label className="flex flex-col gap-2">
//                 <span className="text-sm font-semibold text-gray-700">
//                   {effectType === "relative" ? "MDE (Relative) - comma separated" : "MDE (Absolute) - comma separated"}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
//                     value={mdeValues}
//                     onChange={(e) => setMdeValues(e.target.value)}
//                     placeholder={effectType === "relative" ? "1, 3, 5, 8" : "0.5, 1, 1.5, 2"}
//                   />
//                   <span className="text-sm font-medium text-gray-600 whitespace-nowrap">%</span>
//                 </div>
//                 <span className="text-xs text-gray-500">
//                   {effectType === "relative"
//                     ? "Relative lift values (e.g., \"1, 3, 5\" for 1%, 3%, 5% lifts)"
//                     : "Absolute lift values (e.g., \"0.5, 1\" for 0.5pp, 1pp lifts)"
//                   }
//                 </span>
//               </label>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Control Mean"
//                 value={meanA}
//                 onChange={setMeanA}
//                 step={1}
//                 helpText="Average value in control group"
//               />
//               <NumberInput
//                 label="Variation Mean"
//                 value={meanB}
//                 onChange={setMeanB}
//                 step={1}
//                 helpText="Expected average in variation"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-6">
//               <NumberInput
//                 label="Control Std Dev (σ)"
//                 value={sdA}
//                 onChange={setSdA}
//                 step={1}
//                 min={0.1}
//                 helpText="Standard deviation in control"
//               />
//               <NumberInput
//                 label="Variation Std Dev (σ)"
//                 value={sdB}
//                 onChange={setSdB}
//                 step={1}
//                 min={0.1}
//                 helpText="Standard deviation in variation"
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Test Variations & Traffic Settings Card */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
//             <Users size={20} className="text-indigo-600" />
//           </div>
//           Test Variations & Traffic
//         </h3>
//         <div className="grid grid-cols-3 gap-6">
//           <NumberInput
//             label="Number of Variations"
//             value={numVariations}
//             onChange={setNumVariations}
//             step={1}
//             min={1}
//             max={10}
//             helpText={`Testing ${numVariations} variation${numVariations > 1 ? 's' : ''} against control${useBonferroni && numVariations > 1 ? ' (Bonferroni corrected)' : ''}`}
//           />
//           <NumberInput
//             label="Average Daily Traffic"
//             value={avgDailyTraffic}
//             onChange={setAvgDailyTraffic}
//             step={100}
//             min={0}
//             helpText="Average number of users per day"
//           />
//           <NumberInput
//             label="Expected Drop-off Rate"
//             value={dropoffRate}
//             onChange={setDropoffRate}
//             step={0.01}
//             min={0}
//             max={0.5}
//             isPercentage={true}
//             suffix="%"
//             helpText="Users who drop out before test completion"
//           />
//         </div>
//       </div>

//       {/* Results Table */}
//       <SectionDivider icon={BarChart3} title={`Scenario Results (${scenarios.length} scenarios)`} />

//       {scenarios.length > 0 && (
//         <div className="mb-4 flex justify-end">
//           <button
//             onClick={() => {
//               // Prepare data for Excel
//               const excelData = scenarios.map(s => ({
//                 'Significance Level (%)': s.alpha.toFixed(1),
//                 'MDE (%)': s.mde.toFixed(1),
//                 'Control Rate (%)': s.controlRate.toFixed(2),
//                 'Variation Rate (%)': s.variationRate.toFixed(2),
//                 'Number of Variations': s.numVariations,
//                 'n (Control)': s.nControl,
//                 'n (per Variation)': s.nPerVariation,
//                 'Total Sample Size': s.totalSample,
//                 'Duration (Days)': s.daysNeeded,
//                 'Duration (Weeks)': s.weeksNeeded
//               }));

//               // Create workbook and worksheet
//               const ws = XLSX.utils.json_to_sheet(excelData);
//               const wb = XLSX.utils.book_new();
//               XLSX.utils.book_append_sheet(wb, ws, "Sample Size Scenarios");

//               // Set column widths
//               ws['!cols'] = [
//                 { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 17 }, 
//                 { wch: 20 }, { wch: 12 }, { wch: 18 }, 
//                 { wch: 18 }, { wch: 15 }, { wch: 16 }
//               ];

//               // Download
//               XLSX.writeFile(wb, "sample_size_scenarios.xlsx");
//             }}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
//           >
//             <Download size={18} />
//             Export to Excel
//           </button>
//         </div>
//       )}

//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Significance Level</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">MDE (%)</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Control</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Variation</th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide"># Variations</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">n (Control)</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">n (per Var)</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Total Sample</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Days</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Weeks</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {scenarios.map((scenario, idx) => {
//                 // Color coding based on alpha level
//                 let bgColor = "bg-white";
//                 if (scenario.alpha <= 1) {
//                   bgColor = idx % 2 === 0 ? "bg-red-50" : "bg-red-100/50";
//                 } else if (scenario.alpha <= 5) {
//                   bgColor = idx % 2 === 0 ? "bg-amber-50" : "bg-amber-100/50";
//                 } else {
//                   bgColor = idx % 2 === 0 ? "bg-blue-50" : "bg-blue-100/50";
//                 }

//                 return (
//                   <tr key={idx} className={bgColor}>
//                     <td className="px-4 py-3 text-sm font-bold text-gray-900">{scenario.alpha.toFixed(1)}%</td>
//                     <td className="px-4 py-3 text-sm font-semibold text-indigo-700">{scenario.mde.toFixed(1)}%</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{scenario.controlRate.toFixed(2)}%</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{scenario.variationRate.toFixed(2)}%</td>
//                     <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{scenario.numVariations}</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.nControl.toLocaleString()}</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.nPerVariation.toLocaleString()}</td>
//                     <td className="px-4 py-3 text-sm text-right font-semibold text-indigo-700">{scenario.totalSample.toLocaleString()}</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-900">{scenario.daysNeeded}</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-700">{scenario.weeksNeeded}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Color Legend */}
//         <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <div className="flex items-center gap-6 text-xs">
//             <span className="font-semibold text-gray-700">Color Legend:</span>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-4 bg-red-50 border border-red-200 rounded"></div>
//               <span className="text-gray-600">α ≤ 1% (Very Conservative)</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-4 bg-amber-50 border border-amber-200 rounded"></div>
//               <span className="text-gray-600">α ≤ 5% (Standard)</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-4 bg-blue-50 border border-blue-200 rounded"></div>
//               <span className="text-gray-600">α > 5% (Liberal)</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {scenarios.length === 0 && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
//           <p className="text-sm text-yellow-800">
//             No valid scenarios generated. Please check your input values.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ===== Documentation Component =====
// // function Documentation() {
// //   const tests = useMemo(() => runTests(), []);

// //   return (
// //     <div className="space-y-8">
// //       <SectionDivider icon={BookOpen} title="Documentation & Reference" />

// //       {/* Validation Tests */}
// //       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
// //         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //           <div className="p-2 bg-emerald-100 rounded-lg">
// //             <CheckCircle2 size={18} className="text-emerald-600" />
// //           </div>
// //           Built-in Validation Tests
// //         </h4>
// //         <div className="flex flex-wrap gap-2 mb-3">
// //           {tests.map((t, i) => (
// //             <TestBadge key={i} pass={t.pass} msg={t.msg} />
// //           ))}
// //         </div>
// //         <p className="text-sm text-gray-600">
// //           These automated tests verify expected statistical relationships (e.g., larger effect sizes require smaller samples).
// //         </p>
// //       </div>

// //       {/* Formula Reference */}
// //       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
// //         <h4 className="text-lg font-semibold text-gray-900 mb-5">Statistical Formulas</h4>
// //         <div className="space-y-4 text-sm text-gray-700">
// //           <div>
// //             <p className="font-semibold text-gray-900 mb-2">Two-sample Proportions (unpooled variance):</p>
// //             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
// //               n<sub>A</sub> = (z<sub>α</sub> · √[p<sub>A</sub>(1−p<sub>A</sub>)(1+1/r)] + z<sub>β</sub> · √[p<sub>A</sub>(1−p<sub>A</sub>) + p<sub>B</sub>(1−p<sub>B</sub>)/r])² / (p<sub>B</sub>−p<sub>A</sub>)²
// //               <br />
// //               n<sub>B</sub> = r · n<sub>A</sub>
// //             </div>
// //           </div>
// //           <div>
// //             <p className="font-semibold text-gray-900 mb-2">Two-sample Means:</p>
// //             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
// //               n<sub>A</sub> = (z<sub>α</sub> + z<sub>β</sub>)² · (σ<sub>A</sub>² + σ<sub>B</sub>²/r) / Δ²
// //               <br />
// //               n<sub>B</sub> = r · n<sub>A</sub>
// //             </div>
// //           </div>
// //           <div>
// //             <p className="font-semibold text-gray-900 mb-2">Multiple Variations (Bonferroni correction):</p>
// //             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
// //               α<sub>adjusted</sub> = α / k, where k = number of variations
// //               <br />
// //               Total = n<sub>control</sub> + (n<sub>per_variation</sub> × k)
// //             </div>
// //           </div>
// //           <div>
// //             <p className="font-semibold text-gray-900 mb-2">Drop-off Adjustment & Duration:</p>
// //             <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-200">
// //               n<sub>recruit</sub> = n<sub>required</sub> / (1 - dropout_rate)
// //               <br />
// //               days_needed = n<sub>recruit</sub> / avg_daily_traffic
// //             </div>
// //           </div>
// //           <p className="text-xs text-gray-600 pt-2">
// //             Where z<sub>α</sub> = Φ⁻¹(1 − α/2) for two-tailed or Φ⁻¹(1 − α) for one-tailed, 
// //             z<sub>β</sub> = Φ⁻¹(power), r = allocation ratio
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // ===== Documentation Component =====
// function Documentation() {
//   const [openSection, setOpenSection] = useState("getting-started");

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const CollapsibleSection = ({ id, title, icon: Icon, children, defaultOpen = false }) => {
//     const isOpen = openSection === id;
    
//     return (
//       <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
//         <button
//           onClick={() => toggleSection(id)}
//           className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 flex items-center justify-between transition-all"
//         >
//           <div className="flex items-center gap-3">
//             {Icon && <Icon size={20} className="text-indigo-600" />}
//             <h3 className="text-lg font-bold text-gray-900">{title}</h3>
//           </div>
//           {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//         </button>
//         {isOpen && (
//           <div className="px-6 py-4 bg-white">
//             {children}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const ChevronDown = ({ size }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polyline points="6 9 12 15 18 9"></polyline>
//     </svg>
//   );

//   const ChevronRight = ({ size }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polyline points="9 18 15 12 9 6"></polyline>
//     </svg>
//   );

//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
//             <Calculator size={32} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">Sample Size Calculator Documentation</h1>
//             <p className="text-indigo-100 mt-1">Complete guide to determining how many users you need for your A/B test</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Navigation */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
//         <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
//           <Info size={18} />
//           Quick Navigation
//         </h2>
//         <div className="grid grid-cols-2 gap-2 text-sm">
//           <button onClick={() => setOpenSection("getting-started")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Getting Started</button>
//           <button onClick={() => setOpenSection("parameters")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Understanding Parameters</button>
//           <button onClick={() => setOpenSection("interpreting")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Interpreting Results</button>
//           <button onClick={() => setOpenSection("examples")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Practical Examples</button>
//           <button onClick={() => setOpenSection("best-practices")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Best Practices</button>
//           <button onClick={() => setOpenSection("common-mistakes")} className="text-left text-blue-700 hover:text-blue-900 hover:underline">→ Common Mistakes</button>
//         </div>
//       </div>

//       {/* Getting Started */}
//       <CollapsibleSection id="getting-started" title="Getting Started" icon={Target} defaultOpen={true}>
//         <div className="space-y-4">
//           <p className="text-gray-700">
//             The Sample Size Calculator helps you determine how many users you need in your A/B test to detect 
//             a meaningful difference. Running a test with too few users wastes time, while too many wastes resources.
//           </p>

//           <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
//             <h4 className="font-bold text-indigo-900 mb-2">Why Sample Size Matters</h4>
//             <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1 ml-4">
//               <li><strong>Too small:</strong> You might miss a real improvement (low statistical power)</li>
//               <li><strong>Too large:</strong> You waste time and resources testing longer than needed</li>
//               <li><strong>Just right:</strong> You can confidently detect meaningful improvements efficiently</li>
//             </ul>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-bold text-gray-900">Quick Start Guide</h4>
            
//             <div className="bg-gray-50 border-l-4 border-green-600 p-4 rounded-r-lg">
//               <div className="flex items-start gap-3">
//                 <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
//                 <div>
//                   <h5 className="font-bold text-gray-900 mb-1">Enter Your Baseline Rate</h5>
//                   <p className="text-sm text-gray-700">This is your current conversion rate (e.g., 8.5% of visitors convert)</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
//               <div className="flex items-start gap-3">
//                 <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
//                 <div>
//                   <h5 className="font-bold text-gray-900 mb-1">Set Your Minimum Detectable Effect</h5>
//                   <p className="text-sm text-gray-700">The smallest improvement you care about detecting (e.g., 10% relative improvement)</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
//               <div className="flex items-start gap-3">
//                 <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
//                 <div>
//                   <h5 className="font-bold text-gray-900 mb-1">Choose Power and Significance</h5>
//                   <p className="text-sm text-gray-700">Use defaults (80% power, 95% confidence) unless you have specific requirements</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
//               <div className="flex items-start gap-3">
//                 <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
//                 <div>
//                   <h5 className="font-bold text-gray-900 mb-1">Get Your Sample Size</h5>
//                   <p className="text-sm text-gray-700">The calculator tells you how many users you need per variation</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Understanding Parameters */}
//       <CollapsibleSection id="parameters" title="Understanding Parameters" icon={Settings}>
//         <div className="space-y-6">
          
//           {/* Baseline Rate */}
//           <div>
//             <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//               <TrendingUp size={16} className="text-indigo-600" />
//               Baseline Conversion Rate
//             </h4>
//             <p className="text-sm text-gray-700 mb-3">
//               Your current conversion rate before making any changes. This is the control group's expected performance.
//             </p>
            
//             <div className="bg-gray-50 rounded-lg p-4 text-sm">
//               <p className="font-semibold text-gray-900 mb-2">Examples:</p>
//               <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
//                 <li><strong>E-commerce:</strong> 2.5% of visitors make a purchase</li>
//                 <li><strong>SaaS signup:</strong> 8% of visitors create an account</li>
//                 <li><strong>Add-to-cart:</strong> 12% of visitors add items to cart</li>
//                 <li><strong>Email click:</strong> 15% of recipients click a link</li>
//               </ul>
//             </div>

//             <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
//               <strong className="text-yellow-900">⚠️ Important:</strong>
//               <span className="text-yellow-800"> Use a realistic baseline! Use a representative average from the past 2-4 weeks.</span>
//             </div>
//           </div>

//           {/* Minimum Detectable Effect */}
//           <div>
//             <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//               <Target size={16} className="text-indigo-600" />
//               Minimum Detectable Effect (MDE)
//             </h4>
//             <p className="text-sm text-gray-700 mb-3">
//               The smallest improvement you want to be able to detect. This is expressed as a <strong>relative</strong> change 
//               from your baseline, not an absolute change.
//             </p>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
//               <h5 className="font-semibold text-green-900 mb-2 text-sm">Understanding Relative vs Absolute:</h5>
//               <div className="text-sm text-green-800 space-y-2">
//                 <p><strong>Baseline: 5%</strong></p>
//                 <ul className="list-disc list-inside ml-4 space-y-1">
//                   <li><strong>10% relative increase</strong> = 5% → 5.5% (absolute +0.5%)</li>
//                   <li><strong>20% relative increase</strong> = 5% → 6.0% (absolute +1.0%)</li>
//                   <li><strong>50% relative increase</strong> = 5% → 7.5% (absolute +2.5%)</li>
//                 </ul>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 text-sm">
//               <p className="font-semibold text-gray-900 mb-2">Typical MDEs by Industry:</p>
//               <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
//                 <li><strong>E-commerce checkout:</strong> 5-15% (already optimized, looking for tweaks)</li>
//                 <li><strong>Landing pages:</strong> 15-25% (room for bigger wins)</li>
//                 <li><strong>New features:</strong> 20-50% (expect larger impact)</li>
//                 <li><strong>Email campaigns:</strong> 10-20% (moderate improvements expected)</li>
//               </ul>
//             </div>
//           </div>

//           {/* Statistical Power */}
//           <div>
//             <h4 className="font-bold text-gray-900 mb-2">Statistical Power (1 - β)</h4>
//             <p className="text-sm text-gray-700 mb-3">
//               The probability of detecting a real effect when it exists. Standard is 80%, meaning if there's a 
//               real improvement, you have an 80% chance of detecting it.
//             </p>

//             <div className="space-y-2 text-sm">
//               <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
//                 <strong>80% power (β = 0.20)</strong> - Industry standard, good balance
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
//                 <strong>90% power (β = 0.10)</strong> - More conservative, requires more samples
//               </div>
//             </div>
//           </div>

//           {/* Significance Level */}
//           <div>
//             <h4 className="font-bold text-gray-900 mb-2">Significance Level (α)</h4>
//             <p className="text-sm text-gray-700 mb-3">
//               The probability of declaring a difference when there isn't one (false positive). Standard is 0.05 
//               (5%), meaning 5% chance of incorrectly calling a winner.
//             </p>

//             <div className="space-y-2 text-sm">
//               <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
//                 <strong>α = 0.05 (95% confidence)</strong> - Industry standard
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
//                 <strong>α = 0.01 (99% confidence)</strong> - More stringent, for critical decisions
//               </div>
//             </div>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Interpreting Results */}
//       <CollapsibleSection id="interpreting" title="Interpreting Results" icon={LineChart}>
//         <div className="space-y-6">
          
//           <div>
//             <h4 className="font-bold text-gray-900 mb-3">Understanding the Output</h4>
            
//             <div className="space-y-3">
//               <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4">
//                 <h5 className="font-bold text-indigo-900 mb-2">Sample Size Per Variation</h5>
//                 <p className="text-sm text-indigo-800 mb-2">
//                   The number of users you need in EACH group (control and variation).
//                 </p>
//                 <div className="bg-indigo-100 rounded p-3 text-sm">
//                   <p className="font-mono text-indigo-900"><strong>Example:</strong> 15,683 per variation</p>
//                   <p className="text-indigo-800 mt-1">For an A/B test: <strong>15,683 × 2 = 31,366 total users</strong></p>
//                   <p className="text-indigo-800">For an A/B/C test: <strong>15,683 × 3 = 47,049 total users</strong></p>
//                 </div>
//               </div>

//               <div className="bg-green-50 border border-green-300 rounded-lg p-4">
//                 <h5 className="font-bold text-green-900 mb-2">Test Duration</h5>
//                 <p className="text-sm text-green-800 mb-2">
//                   How long you need to run the test based on your daily traffic.
//                 </p>
//                 <div className="bg-green-100 rounded p-3 text-sm">
//                   <p className="text-green-800">With 31,366 total needed and 5,000 daily visitors: <strong>~6.3 days</strong></p>
//                   <p className="text-green-700 mt-1 text-xs">Always round UP to full business cycles (weeks)</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-bold text-gray-900 mb-3">What If My Sample Size Is Too Large?</h4>
            
//             <div className="space-y-2">
//               <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg text-sm">
//                 <strong className="text-blue-900">Option 1: Increase MDE</strong>
//                 <p className="text-blue-800">Accept that you can only detect larger improvements. Change MDE from 5% to 10% or 15%.</p>
//               </div>
//               <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg text-sm">
//                 <strong className="text-green-900">Option 2: Run Longer</strong>
//                 <p className="text-green-800">Let the test run for more weeks. Make sure to run in full business cycles.</p>
//               </div>
//               <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg text-sm">
//                 <strong className="text-purple-900">Option 3: Test Different Metric</strong>
//                 <p className="text-purple-800">Use a higher-volume metric (e.g., add-to-cart instead of purchase) as a proxy.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Practical Examples */}
//       <CollapsibleSection id="examples" title="Practical Examples" icon={BarChart3}>
//         <div className="space-y-6">
          
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
//             <h4 className="font-bold text-blue-900 mb-3 text-lg">Example 1: E-commerce Product Page</h4>
//             <div className="space-y-3 text-sm">
//               <div className="bg-white rounded p-3">
//                 <p className="text-gray-900"><strong>Scenario:</strong> Testing a new product image layout</p>
//                 <p className="text-gray-700 mt-1"><strong>Baseline:</strong> 2.5% purchase rate</p>
//                 <p className="text-gray-700"><strong>MDE:</strong> 20% relative improvement (2.5% → 3.0%)</p>
//                 <p className="text-gray-700"><strong>Power:</strong> 80%, <strong>Significance:</strong> 95%</p>
//               </div>
//               <div className="bg-blue-100 rounded p-3">
//                 <p className="font-bold text-blue-900">Results:</p>
//                 <p className="text-blue-800"><strong>Sample size:</strong> ~6,200 per variation (12,400 total)</p>
//                 <p className="text-blue-800"><strong>With 5,000 daily visitors:</strong> ~2.5 days → Run for 1 week</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
//             <h4 className="font-bold text-green-900 mb-3 text-lg">Example 2: SaaS Signup Flow</h4>
//             <div className="space-y-3 text-sm">
//               <div className="bg-white rounded p-3">
//                 <p className="text-gray-900"><strong>Scenario:</strong> Simplifying the signup form</p>
//                 <p className="text-gray-700 mt-1"><strong>Baseline:</strong> 8% signup rate</p>
//                 <p className="text-gray-700"><strong>MDE:</strong> 10% relative improvement (8% → 8.8%)</p>
//               </div>
//               <div className="bg-green-100 rounded p-3">
//                 <p className="font-bold text-green-900">Results:</p>
//                 <p className="text-green-800"><strong>Sample size:</strong> ~22,000 per variation (44,000 total)</p>
//                 <p className="text-green-800"><strong>With 2,000 daily visitors:</strong> ~22 days → Run for 3-4 weeks</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Best Practices */}
//       <CollapsibleSection id="best-practices" title="Best Practices" icon={CheckCircle2}>
//         <div className="space-y-4">
          
//           <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
//             <h5 className="font-bold text-green-900 mb-2">✅ Always Calculate Before Testing</h5>
//             <p className="text-sm text-green-800">
//               Never start a test without knowing your required sample size. Running underpowered tests wastes time.
//             </p>
//           </div>

//           <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
//             <h5 className="font-bold text-blue-900 mb-2">✅ Run Tests in Full Business Cycles</h5>
//             <p className="text-sm text-blue-800 mb-2">
//               Always run tests for complete weeks (Monday-Sunday) to account for day-of-week effects.
//             </p>
//             <ul className="list-disc list-inside text-sm text-blue-700 ml-4 space-y-1">
//               <li>Weekend behavior often differs from weekday</li>
//               <li>Run at least 1 full week, preferably 2 weeks</li>
//               <li>Avoid major holidays or unusual events</li>
//             </ul>
//           </div>

//           <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
//             <h5 className="font-bold text-purple-900 mb-2">✅ Be Realistic About MDE</h5>
//             <p className="text-sm text-purple-800 mb-2">
//               Don't chase tiny effects unless you have massive traffic. For most sites, 10-20% MDE is practical.
//             </p>
//           </div>

//           <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
//             <h5 className="font-bold text-orange-900 mb-2">✅ Don't Stop Early</h5>
//             <p className="text-sm text-orange-800 mb-2">
//               Even if you see "significance" after 2 days, wait for your planned sample size!
//             </p>
//             <ul className="list-disc list-inside text-sm text-orange-700 ml-4 space-y-1">
//               <li>Early results are often misleading</li>
//               <li>P-values fluctuate wildly with small samples</li>
//               <li>Stick to your predetermined sample size</li>
//             </ul>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Common Mistakes */}
//       <CollapsibleSection id="common-mistakes" title="Common Mistakes to Avoid" icon={AlertTriangle}>
//         <div className="space-y-4">
          
//           <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//             <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
//               <AlertTriangle size={18} />
//               Mistake #1: Using Absolute Instead of Relative MDE
//             </h4>
//             <div className="text-sm text-red-800 space-y-2">
//               <p><strong>Wrong:</strong> "I want to detect a 1% improvement" (absolute)</p>
//               <p><strong>Right:</strong> "I want to detect a 20% improvement" (relative to baseline)</p>
//             </div>
//           </div>

//           <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
//             <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
//               <AlertTriangle size={18} />
//               Mistake #2: Stopping When You See Significance
//             </h4>
//             <div className="text-sm text-orange-800 space-y-2">
//               <p><strong>The trap:</strong> "We hit p &lt; 0.05 after 3 days, let's stop!"</p>
//               <p><strong>The problem:</strong> This inflates false positives</p>
//               <p className="text-orange-700 bg-orange-100 rounded p-2 mt-2">
//                 <strong>Solution:</strong> Run until you hit your predetermined sample size
//               </p>
//             </div>
//           </div>

//           <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
//             <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
//               <AlertTriangle size={18} />
//               Mistake #3: Forgetting About Total Sample Size
//             </h4>
//             <div className="text-sm text-yellow-800 space-y-2">
//               <p><strong>Remember:</strong> Sample size per variation × number of variations = total needed</p>
//               <p>Example: 15,000 per variation × 2 groups = 30,000 total</p>
//             </div>
//           </div>

//           <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
//             <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
//               <AlertTriangle size={18} />
//               Mistake #4: Using an Outdated Baseline
//             </h4>
//             <div className="text-sm text-blue-800 space-y-2">
//               <p><strong>Best practice:</strong> Use the most recent 2-4 weeks of data for your baseline.</p>
//             </div>
//           </div>
//         </div>
//       </CollapsibleSection>

//       {/* Quick Reference */}
//       <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6 mt-8">
//         <h3 className="font-bold text-indigo-900 mb-4 text-lg">Quick Reference Guide</h3>
        
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white rounded-lg p-4">
//             <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recommended Defaults</h4>
//             <ul className="text-xs text-gray-700 space-y-1">
//               <li><strong>Power:</strong> 80% (β = 0.20)</li>
//               <li><strong>Significance:</strong> 95% (α = 0.05)</li>
//               <li><strong>MDE:</strong> 10-20% for most cases</li>
//               <li><strong>Duration:</strong> Min 1 week, prefer 2+</li>
//             </ul>
//           </div>

//           <div className="bg-white rounded-lg p-4">
//             <h4 className="font-semibold text-gray-900 mb-2 text-sm">Common MDEs</h4>
//             <ul className="text-xs text-gray-700 space-y-1">
//               <li><strong>Mature product:</strong> 5-10%</li>
//               <li><strong>Standard optimization:</strong> 10-20%</li>
//               <li><strong>Major redesign:</strong> 20-50%</li>
//               <li><strong>Low traffic site:</strong> 25-50%</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// // ===== Sample Size Tab with Nested Tabs =====
// function SampleSizeTab() {
//   const [activeSubTab, setActiveSubTab] = useState("single");

//   const subTabs = [
//     { id: "single", label: "Sample Size Calculator", icon: Calculator },
//     { id: "multiple", label: "Multiple Scenarios", icon: Grid3x3 },
//     { id: "docs", label: "Documentation", icon: BookOpen },
//   ];

//   return (
//     <div>
//       {/* Sub-tab Navigation */}
//       <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 mb-6 -mt-2">
//         <div className="flex gap-1 px-2 pt-2">
//           {subTabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveSubTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all rounded-t-xl ${
//                   activeSubTab === tab.id
//                     ? "bg-white text-indigo-700 shadow-sm border-t-2 border-x-2 border-indigo-500"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
//                 }`}
//               >
//                 <Icon size={16} />
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Sub-tab Content */}
//       <div>
//         {activeSubTab === "single" && <SingleScenarioCalculator />}
//         {activeSubTab === "multiple" && <MultipleScenarios />}
//         {activeSubTab === "docs" && <Documentation />}
//       </div>
//     </div>
//   );
// }

// // ===== Test Monitoring Tab =====
// function TestMonitoringTab({ testData }) {
//   return <ExperimentMonitoring testData={testData} />;
// }

// // ===== Test Repository Tab =====
// function TestRepositoryTab({ testData }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [stageFilter, setStageFilter] = useState("All");
//   const [selectedTest, setSelectedTest] = useState(null);

//   const filteredTests = useMemo(() => {
//     return testData.filter(test => {
//       const matchesSearch = 
//         test.Summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         test.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         test.Hypothesis.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesStage = stageFilter === "All" || test["Test Stage"] === stageFilter;
      
//       return matchesSearch && matchesStage;
//     });
//   }, [searchTerm, stageFilter]);

//   const stageStats = useMemo(() => {
//     const stats = {
//       Total: testData.length,
//       Completed: 0,
//       Intake: 0,
//       Proposal: 0,
//       Development: 0,
//       Live: 0,
//       "Result Analysis": 0,
//       "Result Implementation": 0
//     };
    
//     testData.forEach(test => {
//       const stage = test["Test Stage"];
//       if (stage === "Completed") stats.Completed++;
//       else if (stage === "Intake") stats.Intake++;
//       else if (stage === "Proposal") stats.Proposal++;
//       else if (stage === "Development") stats.Development++;
//       else if (stage === "Live") stats.Live++;
//       else if (stage === "Result Analysis") stats["Result Analysis"]++;
//       else if (stage === "Result Implementation") stats["Result Implementation"]++;
//     });
    
//     return stats;
//   }, []);

//   // Timeline data - group completed tests by month-year (by end date)
//   const completedTimelineData = useMemo(() => {
//     const monthCounts = {};
    
//     // Filter only completed tests
//     const completedTests = testData.filter(test => test["Test Stage"] === "Completed");
    
//     completedTests.forEach(test => {
//       const date = new Date(test["Test End Date"]);
//       const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//       monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
//     });
    
//     // Sort by date
//     const sorted = Object.entries(monthCounts).sort((a, b) => {
//       const dateA = new Date(a[0]);
//       const dateB = new Date(b[0]);
//       return dateA - dateB;
//     });
    
//     return sorted;
//   }, []);

//   const completedMaxCount = Math.max(...completedTimelineData.map(([_, count]) => count), 1);

//   const getStageColor = (stage) => {
//     if (stage === "Completed") return "bg-emerald-100 text-emerald-800 border-emerald-300";
//     const colors = {
//       "Live": "bg-blue-100 text-blue-800 border-blue-300",
//       "Result Analysis": "bg-purple-100 text-purple-800 border-purple-300",
//       "Result Implementation": "bg-indigo-100 text-indigo-800 border-indigo-300",
//       "Development": "bg-yellow-100 text-yellow-800 border-yellow-300",
//       "Intake": "bg-orange-100 text-orange-800 border-orange-300",
//       "Proposal": "bg-gray-100 text-gray-800 border-gray-300"
//     };
//     return colors[stage] || "bg-gray-100 text-gray-800 border-gray-300";
//   };

//   const scorecards = [
//     { 
//       label: "# A/B Tests", 
//       value: stageStats.Total, 
//       icon: FlaskConical, 
//       gradient: "from-indigo-600 to-purple-700",
//       border: "border-indigo-400"
//     },
//     { 
//       label: "# Completed Tests", 
//       value: stageStats.Completed, 
//       icon: CheckCircle2, 
//       gradient: "from-emerald-500 to-teal-600",
//       border: "border-emerald-400"
//     },
//     { 
//       label: "# A/B Tests in Intake", 
//       value: stageStats.Intake, 
//       icon: Clock, 
//       gradient: "from-orange-500 to-amber-600",
//       border: "border-orange-400"
//     },
//     { 
//       label: "# A/B Tests in Proposal", 
//       value: stageStats.Proposal, 
//       icon: BookOpen, 
//       gradient: "from-gray-500 to-slate-600",
//       border: "border-gray-400"
//     },
//     { 
//       label: "# A/B Tests in Dev", 
//       value: stageStats.Development, 
//       icon: Settings, 
//       gradient: "from-yellow-500 to-orange-600",
//       border: "border-yellow-400"
//     },
//     { 
//       label: "# Live A/B Tests", 
//       value: stageStats.Live, 
//       icon: Play, 
//       gradient: "from-blue-500 to-cyan-600",
//       border: "border-blue-400"
//     },
//     { 
//       label: "# A/B Tests in Result Analysis", 
//       value: stageStats["Result Analysis"], 
//       icon: BarChart3, 
//       gradient: "from-purple-500 to-pink-600",
//       border: "border-purple-400"
//     },
//     { 
//       label: "# A/B Tests in Implementation", 
//       value: stageStats["Result Implementation"], 
//       icon: CheckSquare, 
//       gradient: "from-indigo-500 to-blue-600",
//       border: "border-indigo-400"
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Stats Overview */}
//       <div className="grid grid-cols-4 gap-4">
//         {scorecards.map((card, idx) => {
//           const Icon = card.icon;
//           return (
//             <div 
//               key={idx} 
//               className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-xl p-3 text-white border-2 ${card.border} hover:shadow-2xl transition-all cursor-pointer`}
//             >
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="p-1.5 bg-white/20 backdrop-blur rounded-lg">
//                   <Icon size={18} />
//                 </div>
//                 <span className="text-xs font-semibold opacity-90 leading-tight">{card.label}</span>
//               </div>
//               <div className="text-3xl font-bold">{card.value}</div>
//             </div>
            



//           );
//         })}
//       </div>

//       {/* Completed Tests Timeline Chart */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
//             <BarChart3 size={20} className="text-emerald-600" />
//           </div>
//           Completed Tests Timeline (by Completion Month)
//         </h3>
        
//         {completedTimelineData.length > 0 ? (
//           <div className="relative">
//             {/* Column chart */}
//             <div className="flex items-end justify-around gap-4 h-40 border-b-2 border-gray-300 pb-2 px-6 relative">
//               {/* Bars container */}
//               <div className="flex items-end justify-around gap-4 flex-1">
//                 {completedTimelineData.map(([monthYear, count], idx) => {
//                   // Calculate exact pixel height based on chart area
//                   const chartHeight = 130; // h-56 = 224px minus some padding
//                   const barHeight = (count / completedMaxCount) * chartHeight;
                  
//                   return (
//                     <div key={monthYear} className="flex flex-col items-center flex-1 max-w-[100px]">
//                       {/* Count label on top */}
//                       <div className="text-sm font-bold text-gray-800 mb-1.5 h-5">
//                         {count}
//                       </div>
                      
//                       {/* Bar with emerald/teal gradient for completed tests */}
//                       <div 
//                         className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg hover:from-emerald-700 hover:to-teal-600 transition-all cursor-pointer shadow-md hover:shadow-xl group relative"
//                         style={{ 
//                           height: `${barHeight}px`
//                         }}
//                       >
//                         {/* Tooltip on hover */}
//                         <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
//                           {monthYear}: {count} {count === 1 ? 'test' : 'tests'}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
            
//             {/* X-axis labels */}
//             <div className="flex justify-around gap-4 px-6 mt-3">
//               {completedTimelineData.map(([monthYear], idx) => (
//                 <div key={idx} className="flex-1 max-w-[100px] text-center">
//                   <div className="text-xs font-semibold text-gray-700">
//                     {monthYear}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* X-axis label */}
//             <div className="text-center mt-4">
//               <span className="text-sm font-semibold text-gray-700">Completion Month</span>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <BarChart3 size={48} className="mx-auto mb-3 text-gray-300" />
//             <p>No completed tests to display</p>
//           </div>
//         )}
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         <div className="grid grid-cols-3 gap-4">
//           <div className="col-span-2">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by summary, product, or hypothesis..."
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div>
//             <div className="relative">
//               <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <select
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all appearance-none"
//                 value={stageFilter}
//                 onChange={(e) => setStageFilter(e.target.value)}
//               >
//                 <option>All</option>
//                 <option>Completed</option>
//                 <option>Live</option>
//                 <option>Result Analysis</option>
//                 <option>Result Implementation</option>
//                 <option>Development</option>
//                 <option>Intake</option>
//                 <option>Proposal</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Test Table */}
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Experiment Name</th>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Stage</th>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Launch Date</th>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Product</th>
//                 <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Countries</th>
//                 <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredTests.map((test, idx) => (
//                 <React.Fragment key={idx}>
//                   <tr className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-semibold text-gray-900">{test.Summary}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStageColor(test["Test Stage"])} inline-block`}>
//                         {test["Test Stage"]}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{test["Test Launch Date"]}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{test["Test End Date"]}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">{test.Product}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{test["Country or Countries"]}</td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => setSelectedTest(selectedTest === idx ? null : idx)}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto text-xs"
//                       >
//                         <Eye size={14} />
//                         {selectedTest === idx ? "Hide" : "View"} Details
//                       </button>
//                     </td>
//                   </tr>
//                   {selectedTest === idx && (
//                     <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
//                       <td colSpan="7" className="px-6 py-6">
//                         <div className="space-y-6">
//                           {/* Hypothesis Section */}
//                           <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200">
//                             <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
//                               <Target size={16} className="text-indigo-600" />
//                               Hypothesis
//                             </h4>
//                             <p className="text-sm text-gray-700 leading-relaxed">
//                               {test.Hypothesis}
//                             </p>
//                           </div>

//                           {/* Optimization Results Section */}
//                           {test["Optimization Result"] && (
//                             <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200">
//                               <h4 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
//                                 <CheckCircle2 size={16} className="text-emerald-600" />
//                                 Optimization Results
//                               </h4>
//                               <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
//                                 {test["Optimization Result"]}
//                               </div>
//                             </div>
//                           )}

//                           {/* Metadata Grid */}
//                           <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//                             <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//                               <Info size={16} className="text-gray-600" />
//                               Test Metadata
//                             </h4>
//                             <div className="grid grid-cols-3 gap-6">
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platform</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test.Platform}</p>
//                               </div>
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test.Category}</p>
//                               </div>
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">LOB(s)</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test["LOB(s)"]}</p>
//                               </div>
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Type(s)</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Type(s)"]}</p>
//                               </div>
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Section(s)</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Section(s)"]}</p>
//                               </div>
//                               <div>
//                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Element(s)</span>
//                                 <p className="text-sm text-gray-900 font-semibold mt-1">{test["Page Element(s)"]}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredTests.length === 0 && (
//           <div className="p-12 text-center">
//             <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//               <Search size={32} className="text-gray-400" />
//             </div>
//             <p className="text-gray-600 font-medium">No experiments found matching your criteria.</p>
//             <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ===== Placeholder Tab Component =====
// function PlaceholderTab({ title, description, icon: Icon }) {
//   return (
//     <div className="flex items-center justify-center min-h-[600px]">
//       <div className="text-center max-w-md">
//         <div className="inline-flex p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
//           <Icon size={64} className="text-indigo-600" />
//         </div>
//         <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
//         <p className="text-gray-600 text-lg">{description}</p>
//         <div className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">
//           Coming Soon
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== ADMIN TAB COMPONENT =====
// function AdminTab({ testData, setTestData }) {
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [previewData, setPreviewData] = useState(null);

//   // Handle Excel file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         // Validate required columns
//         const requiredColumns = [
//           "Test Launch Date", "Test End Date", "Test Stage", "Summary",
//           "Platform", "Category", "LOB(s)", "Country or Countries",
//           "Page Type(s)", "Page Section(s)", "Page Element(s)", "Product",
//           "Hypothesis", "Optimization Result"
//         ];

//         if (jsonData.length > 0) {
//           const columns = Object.keys(jsonData[0]);
//           const missingColumns = requiredColumns.filter(col => !columns.includes(col));
          
//           if (missingColumns.length > 0) {
//             setUploadStatus(`Error: Missing columns: ${missingColumns.join(", ")}`);
//             return;
//           }

//           setPreviewData(jsonData);
//           setUploadStatus(`Preview: ${jsonData.length} experiments loaded. Review and confirm to import.`);
//         }
//       } catch (error) {
//         setUploadStatus(`Error: ${error.message}`);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const confirmImport = () => {
//     if (previewData) {
//       setTestData(previewData);
//       setUploadStatus(`Success: ${previewData.length} experiments imported!`);
//       setPreviewData(null);
//     }
//   };

//   const cancelImport = () => {
//     setPreviewData(null);
//     setUploadStatus("");
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(testData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Experiments");
//     XLSX.writeFile(workbook, `experiments_${new Date().toISOString().split('T')[0]}.xlsx`);
//     setUploadStatus("Success: Experiments exported to Excel!");
//   };

//   const deleteExperiment = (index) => {
//     if (window.confirm("Are you sure you want to delete this experiment?")) {
//       const newData = testData.filter((_, i) => i !== index);
//       setTestData(newData);
//       setUploadStatus("Experiment deleted successfully.");
//     }
//   };

//   const downloadTemplate = () => {
//     const template = [{
//       "Test Launch Date": "2025-01-01",
//       "Test End Date": "2025-01-15",
//       "Test Stage": "Completed",
//       "Summary": "Example Experiment",
//       "Platform": "Platform Name",
//       "Category": "BAU",
//       "LOB(s)": "Multi-LOB",
//       "Country or Countries": "United States",
//       "Page Type(s)": "Homepage",
//       "Page Section(s)": "Hero Banner",
//       "Page Element(s)": "CTA",
//       "Product": "Product Name",
//       "Hypothesis": "Your hypothesis here...",
//       "Optimization Result": "Your results here..."
//     }];
    
//     const worksheet = XLSX.utils.json_to_sheet(template);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
//     XLSX.writeFile(workbook, "experiment_template.xlsx");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
//             <Settings size={32} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">Admin Panel</h1>
//             <p className="text-purple-100 mt-1">Manage your experiment data - Upload, edit, and export</p>
//           </div>
//         </div>
//       </div>

//       {/* Status Message */}
//       {uploadStatus && (
//         <div className={`p-4 rounded-xl border-2 ${
//           uploadStatus.includes("Error") 
//             ? "bg-red-50 border-red-400 text-red-800"
//             : uploadStatus.includes("Success")
//             ? "bg-green-50 border-green-400 text-green-800"
//             : "bg-blue-50 border-blue-400 text-blue-800"
//         }`}>
//           <p className="font-semibold">{uploadStatus}</p>
//         </div>
//       )}

//       {/* Action Cards */}
//       <div className="grid grid-cols-3 gap-6">
//         {/* Upload Excel */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <Upload size={24} className="text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900">Upload Excel</h3>
//           </div>
//           <p className="text-sm text-gray-600 mb-4">
//             Import experiments from Excel file. File must match the required format.
//           </p>
//           <label className="block">
//             <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-all text-center">
//               Choose File
//             </div>
//             <input
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </label>
//         </div>

//         {/* Download Template */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-purple-100 rounded-xl">
//               <FileSpreadsheet size={24} className="text-purple-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900">Get Template</h3>
//           </div>
//           <p className="text-sm text-gray-600 mb-4">
//             Download Excel template with correct column format for easy data entry.
//           </p>
//           <button
//             onClick={downloadTemplate}
//             className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
//           >
//             Download Template
//           </button>
//         </div>

//         {/* Export Data */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-green-100 rounded-xl">
//               <Download size={24} className="text-green-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
//           </div>
//           <p className="text-sm text-gray-600 mb-4">
//             Export current experiments to Excel for backup or sharing.
//           </p>
//           <button
//             onClick={exportToExcel}
//             className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
//           >
//             Export to Excel
//           </button>
//         </div>
//       </div>

//       {/* Preview Data Table */}
//       {previewData && (
//         <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-bold text-gray-900">Preview Import Data</h3>
//             <div className="flex gap-3">
//               <button
//                 onClick={confirmImport}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
//               >
//                 <CheckCircle2 size={18} />
//                 Confirm Import
//               </button>
//               <button
//                 onClick={cancelImport}
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
//               >
//                 <XCircle size={18} />
//                 Cancel
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto max-h-96">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left font-semibold">Summary</th>
//                   <th className="px-4 py-2 text-left font-semibold">Stage</th>
//                   <th className="px-4 py-2 text-left font-semibold">Launch Date</th>
//                   <th className="px-4 py-2 text-left font-semibold">Product</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {previewData.slice(0, 10).map((exp, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-4 py-2">{exp.Summary}</td>
//                     <td className="px-4 py-2">{exp["Test Stage"]}</td>
//                     <td className="px-4 py-2">{exp["Test Launch Date"]}</td>
//                     <td className="px-4 py-2">{exp.Product}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {previewData.length > 10 && (
//               <p className="text-center text-gray-500 mt-4">
//                 ... and {previewData.length - 10} more experiments
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Current Data Management */}
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-2xl font-bold text-gray-900">Current Experiments ({testData.length})</h3>
//         </div>

//         <div className="overflow-x-auto max-h-[600px]">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase">#</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase">Summary</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase">Stage</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase">Launch Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase">Product</th>
//                 <th className="px-4 py-3 text-center text-xs font-bold uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {testData.map((exp, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3 text-sm font-semibold text-gray-600">{idx + 1}</td>
//                   <td className="px-4 py-3 text-sm text-gray-900">{exp.Summary}</td>
//                   <td className="px-4 py-3">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
//                       {exp["Test Stage"]}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{exp["Test Launch Date"]}</td>
//                   <td className="px-4 py-3 text-sm text-gray-900">{exp.Product}</td>
//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() => deleteExperiment(idx)}
//                       className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2 mx-auto text-xs"
//                     >
//                       <Trash2 size={14} />
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Instructions */}
//       <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
//         <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
//           <Info size={20} />
//           Excel Format Requirements
//         </h3>
//         <div className="text-sm text-blue-800 space-y-2">
//           <p><strong>Required Columns:</strong></p>
//           <ul className="list-disc list-inside ml-4 space-y-1">
//             <li>Test Launch Date, Test End Date, Test Stage</li>
//             <li>Summary, Platform, Category, LOB(s)</li>
//             <li>Country or Countries, Page Type(s), Page Section(s), Page Element(s)</li>
//             <li>Product, Hypothesis, Optimization Result</li>
//           </ul>
//           <p className="mt-3"><strong>Tips:</strong></p>
//           <ul className="list-disc list-inside ml-4 space-y-1">
//             <li>Use the template for correct format</li>
//             <li>Dates should be in YYYY-MM-DD format</li>
//             <li>Test Stage: Completed, Live, Development, Intake, Proposal, Result Analysis, Result Implementation</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== Main App Component =====
// export default function ExperimentationApp() {
//   const [activeTab, setActiveTab] = useState("repository");
//   const [testData, setTestData] = useState(INITIAL_TEST_DATA);

//   const tabs = [
//     { id: "repository", label: "Experiment Overview", icon: BookOpen },
//     { id: "sample-size", label: "Sample Size", icon: Calculator },
//     { id: "monitoring", label: "Experiment Monitoring", icon: BarChart3 },
//     { id: "analysis", label: "Results Analysis", icon: LineChart },
//     { id: "admin", label: "Admin", icon: Settings },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl border-b-4 border-indigo-400">
//         <div className="max-w-7xl mx-auto px-8 py-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 backdrop-blur rounded-2xl border-2 border-white/30">
//               <FlaskConical size={36} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-white tracking-tight">
//                 E2E Experimentation Platform
//               </h1>
//               <p className="text-indigo-100 text-sm mt-1">
//                 Complete toolkit for planning, running, and analyzing A/B tests
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="bg-white shadow-md border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-8">
//           <div className="flex gap-2">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative ${
//                     activeTab === tab.id
//                       ? "text-indigo-700 bg-gradient-to-b from-purple-50 to-indigo-50"
//                       : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   {tab.label}
//                   {activeTab === tab.id && (
//                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="max-w-7xl mx-auto px-8 py-8">
//         {activeTab === "sample-size" && <SampleSizeTab />}
//         {activeTab === "analysis" && <ResultsAnalysisComplete />}
//         {activeTab === "monitoring" && <TestMonitoringTab testData={testData} />}
//         {activeTab === "repository" && <TestRepositoryTab testData={testData} />}
//         {activeTab === "admin" && <AdminTab testData={testData} setTestData={setTestData} />}
//       </div>
//     </div>
//   );
// }