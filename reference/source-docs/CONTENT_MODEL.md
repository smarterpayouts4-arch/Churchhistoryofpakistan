# Content Model

A future-proof archive should store content as structured records, not hard-code everything into homepage HTML.

## Person
- id
- public_name
- alternate_spellings
- birth/death dates if documented and appropriate
- clergy/layperson/other
- offices/roles with date ranges
- dioceses/places
- biography
- source citations
- family collection
- portrait asset + rights
- verification state

## Interview
- id
- person_id
- title
- deck/summary
- recorded_date
- interviewer
- location
- video/audio URL
- transcript
- key topics
- related people/places/events
- thumbnail + rights
- publication consent state
- sources / notes

## Church / Place
- id
- official/current name
- former names
- diocese
- street/locality/city/province
- map coordinates if verified
- foundation/consecration dates
- architecture
- historical notes
- current status
- image gallery + rights
- source citations

## Historical Event
- id
- title
- date or date range
- location
- short summary
- detailed article
- people
- related documents/photos
- source citations
- confidence/verification state

## Photograph
- id
- filename
- title
- date / approximate date
- photographer
- collection / donor
- subjects
- place
- caption
- rights status
- license
- required credit
- source/provenance
- scan notes
- publication approval

## Document
- id
- title
- type
- author/issuing body
- date
- scan/PDF
- transcription
- source/provenance
- rights status
- related people/events/places

## Family Collection
- id
- family/collection name
- donor/contact kept private
- public introduction
- date range
- items
- rights/consent restrictions
- citation label

## Tribute
- id
- person
- contributor
- relationship to person
- text
- date submitted
- moderation state
- consent state
- supporting records

## Source object shared by all historical records
- source_type: book / church record / archive / newspaper / oral history / website / family record
- citation_text
- URL or catalogue number
- page number
- author
- publication
- date
- access_date
- quoted_text (short only)
- notes
- reliability/verification state

## Provenance badges
- Church Record
- Published Source
- Family Archive
- Oral History
- Photograph
- Needs Verification

Never collapse “Oral History” and “Documented Fact” into one undifferentiated label.
