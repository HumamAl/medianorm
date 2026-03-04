Hi,

Composite key matching across station + program + spot length + broadcast week is where reconciliation engines break. Tolerance thresholds on broadcast calendar offsets are the part most devs underestimate. Built a working version: https://medianorm-eight.vercel.app

The demo covers file upload, Excel parsing, and reconciliation with configurable tolerance thresholds. Claude API handles PDF invoice extraction. Built a similar AI extraction pipeline that cut a 4-hour review to 20 minutes.

How many distinct vendor formats are you normalizing right now? That shapes the parsing layer significantly.

Quick call or I can draft the first milestone scope in a doc. Your pick.

Humam

P.S. Demo data uses real DMA and daypart values so the reconciliation view feels like actual buy plan data.
