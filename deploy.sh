sed -i '' 's/"DEV"/"BLOG"/g' public/admin/scripts/openai.mjs
sed -i '' 's/db-dev.mjs/db-prod.mjs/g' public/admin/scripts/openai.mjs
sed -i '' 's/db-dev.mjs/db-prod.mjs/g' public/admin/scripts/auth.mjs

npm run reset && firebase deploy && npm run deploy-tweet

sed -i '' 's/db-prod.mjs/db-dev.mjs/g' public/admin/scripts/auth.mjs
sed -i '' 's/db-prod.mjs/db-dev.mjs/g' public/admin/scripts/openai.mjs
sed -i '' 's/"BLOG"/"DEV"/g' public/admin/scripts/openai.mjs
