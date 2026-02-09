@echo off
setlocal

rem Check for Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python...
    python "%~dp0check_text.py" %*
    goto :EOF
)

rem Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js...
    node "%~dp0check_text.js" %*
    goto :EOF
)

echo Error: Neither Python nor Node.js found in PATH.
exit /b 1
