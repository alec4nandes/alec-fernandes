sed -i '' 's/IS_DEV = true/IS_DEV = false/g' chat-react/src/scripts/endpoints.js

cd chat-react
npm run build
firebase deploy
cd ..

sed -i '' 's/IS_DEV = false/IS_DEV = true/g' chat-react/src/scripts/endpoints.js
