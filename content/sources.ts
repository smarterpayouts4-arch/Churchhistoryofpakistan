/**
 * Draft content module — facts from reference/source-data/sources.json only.
 * Citation list only; do not invent sources.
 */

export type SourceEntry = {
  title: string;
  url: string;
  use: string;
};

export type SourcesContent = {
  accessed: string;
  institutional: SourceEntry[];
  raiwind: SourceEntry[];
  image_sources_file: string;
};

export const sources: SourcesContent = {
  "accessed": "2026-09-17",
  "institutional": [
    {
      "title": "Church of Pakistan — About Us",
      "url": "https://www.cop.org.pk/About-Us/",
      "use": "1970 union; 1980 diocesan expansion"
    },
    {
      "title": "Church of Pakistan — Finance",
      "url": "https://www.cop.org.pk/Finance/",
      "use": "Current list of eight dioceses"
    },
    {
      "title": "National Council of Churches in Pakistan — Member Churches",
      "url": "https://nccpakistan.org.pk/member-churches/",
      "use": "Eight dioceses, institutional addresses and several cathedral names"
    },
    {
      "title": "Diocese of Faisalabad",
      "url": "https://dofcop.org/",
      "use": "St. John's Cathedral, Gojra"
    },
    {
      "title": "Diocese of Lahore — About Us",
      "url": "https://copldc.org/about-us/",
      "use": "Cathedral Church of the Resurrection and 1887 construction"
    },
    {
      "title": "Diocese of Peshawar",
      "url": "https://peshawardiocese.org/",
      "use": "St. John's Cathedral and address"
    },
    {
      "title": "Sialkot District — Punjab Government",
      "url": "https://sialkot.punjab.gov.pk/important_places",
      "use": "Holy Trinity Cathedral Church foundation/consecration dates"
    }
  ],
  "raiwind": [
    {
      "title": "Diocese of Raiwind Vision 2020 newsletter, Spring 2019",
      "url": "https://d1yuutt686hfi0.cloudfront.net/media/documents/newsletter-diocese-of-raiwind-cop-spring-2019_6MWONSu.pdf",
      "use": "Central Cathedral of Praying Hands"
    },
    {
      "title": "Church of Scotland World Mission — Diocese of Raiwind tag",
      "url": "https://cofswmc.wordpress.com/tag/diocese-of-raiwind/",
      "use": "2011 cathedral dedication at Warris Road"
    }
  ],
  "image_sources_file": "assets/cathedrals/REMOTE_ASSET_MANIFEST.json"
} as const;
