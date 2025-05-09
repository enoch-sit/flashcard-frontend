@echo off
echo Starting Flashcard Application with Docker Compose...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker is not running! Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo Building and starting containers...
docker-compose up --build -d

REM Wait for services to be fully up
echo.
echo Waiting for services to start up completely...
timeout /t 10 /nobreak

echo.
echo Flashcard Frontend is now running!
echo.
echo Frontend: http://localhost:3001
echo.
echo.
echo Press:
echo [1] to view Frontend logs
echo [2] to shut down containers
echo [3] to exit this script but keep containers running
echo.

choice /c 123 /n /m "Choose an option: "

if %ERRORLEVEL% EQU 1 (
    echo.
    echo Showing Frontend logs press Ctrl+C to stop viewing logs
    echo.
    docker-compose logs -f frontend
    goto :end
)

if %ERRORLEVEL% EQU 2 (
    echo.
    echo Shutting down all containers
    docker-compose down
    echo Done!
    pause
    exit /b 0
)

if %ERRORLEVEL% EQU 3 (
    echo.
    echo Exiting script but keeping containers running
    echo Use 'docker-compose down' later to stop the containers
    timeout /t 3 >nul
    exit /b 0
)

:end
echo.
echo Press any key to return to the menu
pause >nul
%0
