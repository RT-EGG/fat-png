echo AAA

call :deploy

echo BBB

@rem push to repository
git add -A
git commit -m "deploy"
git push

:deploy
npm run deploy
