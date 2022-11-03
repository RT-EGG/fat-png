@setlocal
@pushd %~dp0

call do_deploy.bat

py -3.10 move_files.py

@rem push to repository
git add -A
git commit -m "deploy"
git push

@popd
@endlocal

exit /b 0
