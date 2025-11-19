#!/bin/bash

API_URL="http://backend:8080"

# Orelsan
RESPONSE=$(curl -s -X POST "$API_URL/artists" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Orelsan"
         }')
# Extraction avec grep / sed
ARTIST_ID_ORELSAN=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $ARTIST_ID_ORELSAN"


# Lady Gaga
RESPONSE=$(curl -s -X POST "$API_URL/artists" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Lady Gaga"
         }')
# Extraction avec grep / sed
ARTIST_ID_LADY_GAGA=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $ARTIST_ID_LADY_GAGA"



# Dua lipa
RESPONSE=$(curl -s -X POST "$API_URL/artists" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Dua Lipa"
         }')
# Extraction avec grep / sed
ARTIST_ID_DUA_LIPA=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $ARTIST_ID_DUA_LIPA"


#Dire Straits
RESPONSE=$(curl -s -X POST "$API_URL/artists" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Dire Straits"
         }')
# Extraction avec grep / sed
ARTIST_ID_DIRE_STRAITS=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $ARTIST_ID_DIRE_STRAITS"

#Rihanna
RESPONSE=$(curl -s -X POST "$API_URL/artists" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Rihanna"
         }')
# Extraction avec grep / sed
ARTIST_ID_RIHANNA=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $ARTIST_ID_RIHANNA"


#Concert Rihanna
RESPONSE=$(curl -s -X POST "$API_URL/events" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Concert Rihanna",
           "startDate": "2025-05-10",
           "endDate": "2025-05-12"
         }')
# Extraction avec grep / sed
EVENT_ID_RIHANNA=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $EVENT_ID_RIHANNA"

#Concert Orelsan
RESPONSE=$(curl -s -X POST "$API_URL/events" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Concert Orelsan",
           "startDate": "2026-03-16",
           "endDate": "2026-03-16"
         }')
# Extraction avec grep / sed
EVENT_ID_ORELSAN=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $EVENT_ID_ORELSAN"

# Coachella
RESPONSE=$(curl -s -X POST "$API_URL/events" \
     -H "Content-Type: application/json" \
     -d '{
           "label": "Coachella",
           "startDate": "2026-04-10",
           "endDate": "2026-04-19"
         }')
# Extraction avec grep / sed
EVENT_ID_COACHELLA=$(echo "$RESPONSE" | sed -n 's/.*"id": *"\([^"]*\)".*/\1/p')
echo "Artiste créé avec l'id : $EVENT_ID_COACHELLA"

# Association Concert Orelsan
curl -X POST "$API_URL/events/$EVENT_ID_ORELSAN/artists/$ARTIST_ID_ORELSAN" \
     -H "Content-Type: application/json" \
     -d '{
         }'

echo -e "\nAssociation Concert Orelsan créée !"

# Association Concert Rihanna
curl -X POST "$API_URL/events/$EVENT_ID_RIHANNA/artists/$ARTIST_ID_RIHANNA" \
     -H "Content-Type: application/json" \
     -d '{
         }'

echo -e "\nAssociation Concert Rihanna créée !"

# Association Coachella
curl -X POST "$API_URL/events/$EVENT_ID_COACHELLA/artists/$ARTIST_ID_LADY_GAGA" \
     -H "Content-Type: application/json" \
     -d '{
         }'

curl -X POST "$API_URL/events/$EVENT_ID_COACHELLA/artists/$ARTIST_ID_DUA_LIPA" \
     -H "Content-Type: application/json" \
     -d '{
         }'
echo -e "\nAssociation Coachella créée !"